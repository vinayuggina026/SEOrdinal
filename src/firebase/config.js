import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDWnT_OdVjgJxCUrtLX-xR03O6ESPQUpm0",
  authDomain: "seordinal.firebaseapp.com",
  projectId: "seordinal",
  storageBucket: "seordinal.firebasestorage.app",
  messagingSenderId: "689389896410",
  appId: "1:689389896410:web:b81d4ddb9bce900204dbe3",
  measurementId: "G-LP4S7ZCYDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, analytics };
