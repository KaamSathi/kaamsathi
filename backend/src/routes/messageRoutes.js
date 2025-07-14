const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Placeholder for messaging routes
// We'll implement these controllers later if needed
router.get('/', authenticateToken, (req, res) => {
  res.json({ status: 'success', message: 'Messages route - to be implemented' });
});

router.post('/', authenticateToken, (req, res) => {
  res.json({ status: 'success', message: 'Send message route - to be implemented' });
});

module.exports = router; 