const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Mock OTP service (for now - replace with real SMS service later)
const generateOTP = () => {
  if (process.env.OTP_ENABLED === 'false') {
    return process.env.MOCK_OTP || '123456';
  }
  // For real implementation: return Math.floor(100000 + Math.random() * 900000).toString();
  return '123456';
};

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// Send OTP to phone number
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid Indian phone number (10 digits starting with 6-9)'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiry (5 minutes)
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    });

    // In production, send SMS here
    console.log(`📱 OTP for ${phone}: ${otp}`);

    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully to your phone number',
      data: {
        phone,
        expiresIn: 300 // 5 minutes
      }
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send OTP. Please try again later.'
    });
  }
};

// Verify OTP and login/register user
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp, role = 'worker', name } = req.body;

    // Validate input
    if (!phone || !otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone number and OTP are required'
      });
    }

    if (!['worker', 'employer'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Role must be either worker or employer'
      });
    }

    // Check OTP
    const storedOTPData = otpStore.get(phone);
    
    if (!storedOTPData) {
      // For development, also check if it's the demo OTP
      if (process.env.NODE_ENV === 'development' && otp === '123456') {
        console.log(`🔧 Development mode: Accepting demo OTP for ${phone}`);
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'OTP not found or expired. Please request a new OTP.'
        });
      }
    }

    // Handle OTP verification
    let isValidOTP = false;
    
    if (storedOTPData) {
      // Check if OTP is expired
      if (Date.now() > storedOTPData.expiresAt) {
        otpStore.delete(phone);
        return res.status(400).json({
          status: 'error',
          message: 'OTP has expired. Please request a new OTP.'
        });
      }

      // Check attempts
      if (storedOTPData.attempts >= 3) {
        otpStore.delete(phone);
        return res.status(400).json({
          status: 'error',
          message: 'Too many failed attempts. Please request a new OTP.'
        });
      }

      // Verify OTP
      if (storedOTPData.otp !== otp) {
        storedOTPData.attempts += 1;
        return res.status(400).json({
          status: 'error',
          message: 'Invalid OTP. Please try again.'
        });
      }

      isValidOTP = true;
      // OTP verified successfully, remove from store
      otpStore.delete(phone);
    } else if (process.env.NODE_ENV === 'development' && otp === '123456') {
      // Demo OTP for development
      isValidOTP = true;
    }

    if (!isValidOTP) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid OTP. Please try again.'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ phone });

    if (user) {
      // Existing user - login
      const token = generateToken(user._id);
      
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            location: user.location,
            isVerified: user.isVerified,
            skills: user.skills,
            companyName: user.companyName,
            bio: user.bio,
            experience: user.experience,
            rating: user.rating
          },
          token
        }
      });

    } else {
      // New user - register
      if (!name || !name.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Name is required for new user registration'
        });
      }

      if (name.trim().length < 2) {
        return res.status(400).json({
          status: 'error',
          message: 'Name must be at least 2 characters long'
        });
      }

      user = new User({
        name: name.trim(),
        phone,
        role,
        isVerified: false
      });

      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        status: 'success',
        message: 'Account created successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            location: user.location,
            isVerified: user.isVerified,
            skills: user.skills,
            companyName: user.companyName,
            bio: user.bio,
            experience: user.experience,
            rating: user.rating
          },
          token
        }
      });
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone number already registered with a different account'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to verify OTP. Please try again later.'
    });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-verificationDocuments');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user profile'
    });
  }
};

// Logout user (client-side token removal, server can blacklist if needed)
const logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just send a success response
    
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to logout'
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'User account not found or deactivated'
      });
    }

    const newToken = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to refresh token'
    });
  }
};

// Change phone number (requires OTP verification)
const changePhone = async (req, res) => {
  try {
    const { newPhone, otp } = req.body;

    // Validate new phone number
    if (!newPhone || !/^[6-9]\d{9}$/.test(newPhone)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid Indian phone number'
      });
    }

    // Check if new phone is already in use
    const existingUser = await User.findOne({ phone: newPhone });
    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone number already in use by another account'
      });
    }

    // Verify OTP for new phone number
    const storedOTPData = otpStore.get(newPhone);
    
    if (!storedOTPData || storedOTPData.otp !== otp || Date.now() > storedOTPData.expiresAt) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired OTP'
      });
    }

    // Update phone number
    await User.findByIdAndUpdate(req.user._id, { phone: newPhone });
    otpStore.delete(newPhone);

    res.status(200).json({
      status: 'success',
      message: 'Phone number updated successfully'
    });

  } catch (error) {
    console.error('Change phone error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to change phone number'
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  getMe,
  logout,
  refreshToken,
  changePhone
}; 