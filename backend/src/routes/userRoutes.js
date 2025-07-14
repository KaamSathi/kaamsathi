const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Placeholder for user profile routes
// We'll implement these controllers later if needed
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ status: 'success', message: 'User profile route - to be implemented' });
});

router.put('/profile', authenticateToken, (req, res) => {
  res.json({ status: 'success', message: 'Update profile route - to be implemented' });
});

module.exports = router; 