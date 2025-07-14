const express = require('express');
const { 
  sendOTP, 
  verifyOTP, 
  getMe, 
  logout, 
  refreshToken, 
  changePhone 
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);
router.post('/refresh-token', authenticateToken, refreshToken);
router.post('/change-phone', authenticateToken, changePhone);

module.exports = router; 