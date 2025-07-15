const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Send a message (store in DB)
exports.sendMessage = async (req, res) => {
  try {
    const { jobId, receiver, content } = req.body;
    const sender = req.user._id;
    if (!receiver || !content) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields.' });
    }
    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
      ...(jobId ? { jobId } : {}),
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        jobId: jobId || undefined,
      });
    }
    // Create message
    const message = await Message.create({
      conversationId: conversation._id,
      sender,
      receiver,
      content,
    });
    // Update lastMessage
    conversation.lastMessage = message._id;
    await conversation.save();
    res.status(201).json({ status: 'success', message, conversation });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.query;
    if (!conversationId) {
      return res.status(400).json({ status: 'error', message: 'Missing conversationId.' });
    }
    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 })
      .populate('sender', 'name _id')
      .populate('receiver', 'name _id');
    res.json({ status: 'success', messages });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all conversations for the current user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name _id')
      .populate({ path: 'lastMessage', populate: { path: 'sender receiver', select: 'name _id' } })
      .sort({ updatedAt: -1 });
    res.json({ status: 'success', conversations });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}; 