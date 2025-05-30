const express = require('express');
const router = express.Router();
const admin = require('../firebase/admin');

router.post('/api/delete-unverified-user', async (req, res) => {
  try {
    const { uid } = req.body;
    
    // Get user from Admin SDK
    const user = await admin.auth().getUser(uid);
    
    // Check if user is unverified
    if (!user.emailVerified) {
      await admin.auth().deleteUser(uid);
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(400).json({ message: 'User is already verified' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
