const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v); // Indian phone number validation
      },
      message: 'Please enter a valid Indian phone number'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  role: {
    type: String,
    enum: ['worker', 'employer', 'admin'],
    required: true,
    default: 'worker'
  },
  avatar: {
    type: String,
    default: null
  },
  location: {
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { 
      type: String, 
      validate: {
        validator: function(v) {
          return !v || /^[1-9][0-9]{5}$/.test(v);
        },
        message: 'Please enter a valid pincode'
      }
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  
  // Worker-specific fields
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: String,
    enum: ['fresher', '1-2 years', '3-5 years', '5+ years'],
    default: 'fresher'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  hourlyRate: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 }
  },
  availability: {
    type: String,
    enum: ['immediate', 'within-week', 'within-month', 'not-available'],
    default: 'immediate'
  },
  portfolio: [{
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    images: [String],
    completedDate: Date
  }],
  
  // Employer-specific fields
  companyName: {
    type: String,
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  companyWebsite: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid website URL'
    }
  },
  companyDescription: {
    type: String,
    maxlength: [1000, 'Company description cannot exceed 1000 characters']
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  
  // Verification and status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: { type: String, enum: ['aadhaar', 'pan', 'license', 'certificate'] },
    url: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Ratings and reviews
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Activity tracking
  lastActive: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  
  // Preferences
  preferences: {
    jobAlerts: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    language: { type: String, enum: ['en', 'hi'], default: 'en' }
  },
  
  // Analytics
  profileViews: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  deactivatedAt: Date,
  deactivationReason: String
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location.city': 1, 'location.state': 1 });
userSchema.index({ skills: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for location string
userSchema.virtual('locationString').get(function() {
  const parts = [];
  if (this.location.city) parts.push(this.location.city);
  if (this.location.state) parts.push(this.location.state);
  return parts.join(', ');
});

// Method to update last active
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

// Method to calculate rating average
userSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
  return this.save();
};

// Method to add review
userSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  return this.updateRating();
};

// Static method to find workers by skills and location
userSchema.statics.findWorkersBySkillsAndLocation = function(skills, city, state) {
  const query = {
    role: 'worker',
    isActive: true,
    isVerified: true
  };
  
  if (skills && skills.length > 0) {
    query.skills = { $in: skills };
  }
  
  if (city) {
    query['location.city'] = new RegExp(city, 'i');
  }
  
  if (state) {
    query['location.state'] = new RegExp(state, 'i');
  }
  
  return this.find(query)
    .sort({ 'rating.average': -1, lastActive: -1 })
    .select('-reviews -verificationDocuments');
};

// Pre-save middleware to handle updates
userSchema.pre('save', function(next) {
  // Update lastActive on any save
  if (!this.isNew) {
    this.lastActive = new Date();
  }
  
  next();
});

// Transform output
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    
    // Don't expose sensitive data
    if (ret.verificationDocuments) {
      ret.verificationDocuments = ret.verificationDocuments.map(doc => ({
        type: doc.type,
        status: doc.status,
        uploadedAt: doc.uploadedAt
      }));
    }
    
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema); 