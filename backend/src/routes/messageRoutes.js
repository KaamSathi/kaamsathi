const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Get all conversations for the current user
router.get('/conversations', authenticateToken, messageController.getConversations);

// Get all messages for a conversation
router.get('/', authenticateToken, messageController.getMessages);

// Send a message
router.post('/', authenticateToken, messageController.sendMessage);

module.exports = router; 