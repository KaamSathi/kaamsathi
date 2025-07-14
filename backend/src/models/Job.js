const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [2000, 'Job description cannot exceed 2000 characters']
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Job categorization
  category: {
    type: String,
    required: true,
    enum: [
      'construction',
      'plumbing',
      'electrical',
      'carpentry',
      'painting',
      'cleaning',
      'delivery',
      'housekeeping',
      'security',
      'gardening',
      'repair',
      'maintenance',
      'other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  
  // Location details
  location: {
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { 
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^[1-9][0-9]{5}$/.test(v);
        },
        message: 'Please enter a valid pincode'
      }
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  
  // Job type and duration
  type: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'temporary', 'hourly']
  },
  duration: {
    startDate: { type: Date },
    endDate: { type: Date },
    estimatedHours: { type: Number, min: 1 },
    isFlexible: { type: Boolean, default: false }
  },
  
  // Compensation
  salary: {
    type: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'fixed'],
      required: true
    },
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },
    isNegotiable: { type: Boolean, default: false }
  },
  
  // Requirements
  requirements: {
    experience: {
      type: String,
      enum: ['fresher', '1-2 years', '3-5 years', '5+ years'],
      default: 'fresher'
    },
    skills: [{
      type: String,
      required: true,
      trim: true
    }],
    education: {
      type: String,
      enum: ['none', 'primary', 'secondary', 'higher-secondary', 'graduate', 'any']
    },
    languages: [{
      type: String,
      enum: ['hindi', 'english', 'bengali', 'telugu', 'marathi', 'tamil', 'gujarati', 'urdu', 'kannada', 'odia', 'malayalam', 'punjabi']
    }],
    certifications: [String],
    tools: [String]
  },
  
  // Job details
  workingHours: {
    startTime: String,
    endTime: String,
    daysPerWeek: { type: Number, min: 1, max: 7 },
    isFlexible: { type: Boolean, default: false },
    shiftType: { type: String, enum: ['day', 'night', 'rotating', 'flexible'] }
  },
  
  benefits: [{
    type: String,
    enum: [
      'food-provided',
      'transport-provided',
      'accommodation',
      'medical-insurance',
      'bonus',
      'overtime-pay',
      'esi',
      'pf',
      'paid-leave',
      'festival-bonus'
    ]
  }],
  
  // Application settings
  applicationDeadline: Date,
  maxApplications: { type: Number, min: 1 },
  currentApplications: { type: Number, default: 0 },
  
  // Job status
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'cancelled', 'completed'],
    default: 'active'
  },
  
  // Priority and urgency
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isUrgent: { type: Boolean, default: false },
  
  // Contact information
  contactInfo: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    preferredContactMethod: { 
      type: String, 
      enum: ['phone', 'email', 'app-message'],
      default: 'app-message'
    }
  },
  
  // Additional details
  additionalInfo: {
    equipmentProvided: { type: Boolean, default: false },
    safetyRequirements: [String],
    workEnvironment: { 
      type: String,
      enum: ['indoor', 'outdoor', 'both'],
      default: 'indoor'
    },
    physicalRequirements: [String],
    trainingProvided: { type: Boolean, default: false }
  },
  
  // Images and attachments
  images: [String],
  documents: [{
    name: String,
    url: String,
    type: { type: String, enum: ['pdf', 'doc', 'image'] }
  }],
  
  // Performance metrics
  views: { type: Number, default: 0 },
  applications: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Application' 
  }],
  
  // SEO and searchability
  tags: [String],
  searchKeywords: [String],
  
  // Employer preferences
  preferredWorkerProfile: {
    ageRange: {
      min: { type: Number, min: 18 },
      max: { type: Number, max: 65 }
    },
    gender: { type: String, enum: ['any', 'male', 'female'], default: 'any' },
    localityPreference: { type: Boolean, default: false },
    maxDistance: { type: Number, default: 50 } // in kilometers
  },
  
  // Tracking
  postedDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  expiresAt: Date,
  
  // Analytics
  analytics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
    hired: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for performance
jobSchema.index({ employer: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ 'location.city': 1, 'location.state': 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ 'salary.min': 1, 'salary.max': 1 });
jobSchema.index({ 'requirements.skills': 1 });
jobSchema.index({ tags: 1 });
jobSchema.index({ searchKeywords: 1 });

// Text search index
jobSchema.index({
  title: 'text',
  description: 'text',
  'requirements.skills': 'text',
  tags: 'text'
});

// Compound indexes for common queries
jobSchema.index({ category: 1, status: 1, createdAt: -1 });
jobSchema.index({ 'location.city': 1, category: 1, status: 1 });

// Virtual for formatted salary
jobSchema.virtual('formattedSalary').get(function() {
  if (this.salary.max && this.salary.max !== this.salary.min) {
    return `₹${this.salary.min} - ₹${this.salary.max}/${this.salary.type}`;
  }
  return `₹${this.salary.min}/${this.salary.type}`;
});

// Virtual for location string
jobSchema.virtual('locationString').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} - ${this.location.pincode}`;
});

// Virtual for days since posted
jobSchema.virtual('daysSincePosted').get(function() {
  const diffTime = Math.abs(new Date() - this.postedDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to increment views
jobSchema.methods.incrementViews = function() {
  this.views += 1;
  this.analytics.impressions += 1;
  return this.save();
};

// Method to increment applications
jobSchema.methods.incrementApplications = function() {
  this.currentApplications += 1;
  this.analytics.applications += 1;
  return this.save();
};

// Method to check if application deadline has passed
jobSchema.methods.isApplicationDeadlinePassed = function() {
  if (!this.applicationDeadline) return false;
  return new Date() > this.applicationDeadline;
};

// Method to check if job is full
jobSchema.methods.isJobFull = function() {
  if (!this.maxApplications) return false;
  return this.currentApplications >= this.maxApplications;
};

// Static method to find jobs by location and category
jobSchema.statics.findJobsByLocationAndCategory = function(city, state, category, limit = 20) {
  const query = {
    status: 'active',
    ...(category && { category }),
    ...(city && { 'location.city': new RegExp(city, 'i') }),
    ...(state && { 'location.state': new RegExp(state, 'i') })
  };
  
  return this.find(query)
    .populate('employer', 'name companyName rating.average isVerified')
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit);
};

// Static method for job search
jobSchema.statics.searchJobs = function(searchQuery, filters = {}) {
  const {
    category,
    city,
    state,
    salaryMin,
    salaryMax,
    type,
    experience,
    skills,
    sortBy = 'createdAt'
  } = filters;
  
  let query = { status: 'active' };
  
  // Text search
  if (searchQuery) {
    query.$text = { $search: searchQuery };
  }
  
  // Apply filters
  if (category) query.category = category;
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (state) query['location.state'] = new RegExp(state, 'i');
  if (type) query.type = type;
  if (experience) query['requirements.experience'] = experience;
  if (skills && skills.length > 0) {
    query['requirements.skills'] = { $in: skills };
  }
  if (salaryMin) query['salary.min'] = { $gte: Number(salaryMin) };
  if (salaryMax) query['salary.max'] = { $lte: Number(salaryMax) };
  
  // Sorting
  let sort = {};
  switch (sortBy) {
    case 'salary_asc':
      sort = { 'salary.min': 1 };
      break;
    case 'salary_desc':
      sort = { 'salary.min': -1 };
      break;
    case 'date_asc':
      sort = { createdAt: 1 };
      break;
    case 'relevance':
      sort = searchQuery ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }
  
  return this.find(query)
    .populate('employer', 'name companyName rating.average isVerified avatar')
    .sort(sort);
};

// Pre-save middleware
jobSchema.pre('save', function(next) {
  // Update lastUpdated
  this.lastUpdated = new Date();
  
  // Generate search keywords
  const keywords = [
    this.title,
    this.category,
    ...this.requirements.skills,
    this.location.city,
    this.location.state
  ].filter(Boolean).map(keyword => keyword.toLowerCase());
  
  this.searchKeywords = [...new Set(keywords)];
  
  // Set expiry date if not set (default 30 days)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Transform output
jobSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Job', jobSchema); 