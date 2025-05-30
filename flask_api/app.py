import os
import json
import re
import whisper
import torch
import numpy as np
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
from pytrends.request import TrendReq

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'}

latest_data = {
    "transcript": None,
    "keywords": None
}


print("Loading Whisper model...")
whisper_model = whisper.load_model("base")

print("Loading BERT model...")
bert_tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
bert_model = AutoModel.from_pretrained("bert-base-uncased")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_keywords_bert(text, top_k=20):
    words = list(set([w.lower() for w in text.split() if w.isalpha() and len(w) > 4]))
    if not words:
        return []
    inputs = bert_tokenizer(words, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = bert_model(**inputs)
    embeddings = outputs.last_hidden_state[:, 0, :]
    avg_embedding = embeddings.mean(dim=0, keepdim=True)
    sims = cosine_similarity(avg_embedding.numpy(), embeddings.numpy())[0]
    sorted_indices = np.argsort(sims)[::-1]
    return [words[i] for i in sorted_indices[:top_k]]

def rank_keywords_by_trends(keywords):
    pytrends = TrendReq(hl='en-US', tz=360)
    trend_scores = {}
    for word in keywords:
        try:
            pytrends.build_payload([word], timeframe='today 12-m')
            data = pytrends.interest_over_time()
            if not data.empty:
                trend_scores[word] = int(data[word].mean())
        except:
            trend_scores[word] = 0
    ranked = sorted(trend_scores.items(), key=lambda x: x[1], reverse=True)
    return [kw for kw, _ in ranked]

def clean_tags(tag_block):
    tag_block = tag_block.lower().replace("#", "").strip()
    if "\n" in tag_block:
        tags = tag_block.split("\n")
    elif "," in tag_block:
        tags = tag_block.split(",")
    else:
        tags = tag_block.split()
    clean = []
    for tag in tags:
        tag = tag.strip()
        if tag and tag not in clean:
            clean.append(tag)
    return clean[:10]

def clean_text(text):
    text = text.strip().replace("\n", " ")
    text = re.sub(r'^["“”‘’\'\s]+|["“”‘’\'\s]+$', '', text)
    text = re.sub(r'\s*\d+\.*\s*$', '', text)
    return re.sub(r'\s{2,}', ' ', text)

def generate_metadata(transcript, keywords):
    example_prompt = f"""
You are an expert YouTube SEO assistant. Given a transcript and a list of keywords, your job is to generate a YouTube title (no emojis), a 3–4 line description, and 10 lowercase SEO tags (as individual phrases, not split into words).

Example:

Transcript:
\"\"\"This is a step-by-step tutorial on creating a resume builder app. You don't need coding experience. Just use the AI-powered builder, answer some questions, and download your resume instantly.\"\"\" 

Keywords: resume maker, app builder, AI resume, job hunting, no code, resume download, tutorial, quick resume, build resume app, portfolio tool

Title: Build a Resume Maker App Without Code in Minutes  
Description: Learn how to create your very own resume maker app using a no-code builder. This step-by-step tutorial guides you through designing, customizing, and launching your own resume tool. Perfect for job seekers and creators alike!  
Tags: resume maker, app builder, ai resume, no code, tutorial, resume download, portfolio app, job seeker, resume design, build app

Now generate for:

Transcript:
\"\"\"{transcript[:1000]}...\"\"\"

Keywords: {', '.join(keywords)}

Respond in this format:
Title: ...
Description: ...
Tags: ...
"""

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",
                "prompt": example_prompt,
                "stream": False
            }
        )
        result = response.json()
        output_text = result.get("response", "")

        title = output_text.split("Title:")[1].split("Description:")[0]
        description = output_text.split("Description:")[1].split("Tags:")[0]
        tags_block = output_text.split("Tags:")[1]

        return {
            "title": clean_text(title),
            "description": clean_text(description),
            "tags": clean_tags(tags_block)
        }

    except Exception as e:
        print(f"[Metadata Generation Error]: {e}")
        return {
            "title": "could not generate title",
            "description": "could not generate description",
            "tags": []
        }


@app.route('/')
def home():
    return "SEOrdinal Flask API is running"

@app.route('/transcribe', methods=['POST'])
def transcribe_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video/audio file uploaded'}), 400

    file = request.files['video']
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Supported: mp4, mov, avi, mp3, wav, m4a, aac, ogg, flac'}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        result = whisper_model.transcribe(file_path, task="translate", language=None)
        transcript = result['text']
        detected_lang = result.get('language', 'unknown')
        print(f"Detected language: {detected_lang}")

        keywords = extract_keywords_bert(transcript, top_k=20)
        ranked_keywords = rank_keywords_by_trends(keywords)

        latest_data["transcript"] = transcript
        latest_data["keywords"] = ranked_keywords[:20]

        return jsonify({
            'transcript': transcript,
            'detected_language': detected_lang,
            'keywords': keywords,
            'ranked_keywords': ranked_keywords
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.route('/metadata', methods=['GET'])
def metadata():
    transcript = latest_data.get("transcript")
    keywords = latest_data.get("keywords")

    if not transcript or not keywords:
        return jsonify({'error': 'No transcript or keywords found. Run /transcribe first.'}), 400

    metadata = generate_metadata(transcript, keywords)
    return jsonify(metadata)

@app.route('/regenerate', methods=['POST'])
def regenerate_metadata():
    transcript = latest_data.get("transcript")
    keywords = latest_data.get("keywords")

    if not transcript or not keywords:
        return jsonify({'error': 'No transcript or keywords found. Run /transcribe first.'}), 400

    metadata = generate_metadata(transcript, keywords)
    return jsonify(metadata)

if __name__ == '__main__':
    app.run(debug=True)
