const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Application details
  coverLetter: {
    type: String,
    maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
  },
  proposedSalary: {
    amount: { type: Number, min: 0 },
    type: { type: String, enum: ['hourly', 'daily', 'weekly', 'monthly', 'fixed'] }
  },
  availability: {
    startDate: { type: Date },
    endDate: { type: Date },
    isFlexible: { type: Boolean, default: true }
  },
  
  // Application status
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'interview-scheduled', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  
  // Status tracking
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'interview-scheduled', 'accepted', 'rejected', 'withdrawn']
    },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
    note: String
  }],
  
  // Interview details
  interview: {
    scheduledAt: Date,
    location: String,
    type: { type: String, enum: ['in-person', 'phone', 'video'], default: 'in-person' },
    notes: String,
    conducted: { type: Boolean, default: false },
    feedback: String
  },
  
  // Documents and attachments
  documents: [{
    name: String,
    url: String,
    type: { type: String, enum: ['resume', 'certificate', 'id-proof', 'other'] }
  }],
  
  // Communication
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  
  // Employer feedback
  employerFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    wouldRecommend: Boolean
  },
  
  // Worker feedback
  workerFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    wouldWorkAgain: Boolean
  },
  
  // Application metadata
  appliedAt: { type: Date, default: Date.now },
  viewedByEmployer: { type: Boolean, default: false },
  viewedAt: Date,
  
  // Job completion (if hired)
  workCompleted: {
    status: { type: String, enum: ['not-started', 'in-progress', 'completed', 'cancelled'] },
    startDate: Date,
    completionDate: Date,
    hoursWorked: Number,
    finalAmount: Number
  }
}, {
  timestamps: true
});

// Indexes
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ job: 1 });
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ employer: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedAt: -1 });

// Virtual for time since applied
applicationSchema.virtual('daysSinceApplied').get(function() {
  const diffTime = Math.abs(new Date() - this.appliedAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to update status
applicationSchema.methods.updateStatus = function(newStatus, changedBy, note) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy,
    note,
    changedAt: new Date()
  });
  return this.save();
};

// Method to mark as viewed by employer
applicationSchema.methods.markAsViewed = function() {
  if (!this.viewedByEmployer) {
    this.viewedByEmployer = true;
    this.viewedAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to add message
applicationSchema.methods.addMessage = function(sender, message) {
  this.messages.push({
    sender,
    message,
    timestamp: new Date()
  });
  return this.save();
};

// Static method to get applications by job
applicationSchema.statics.getApplicationsByJob = function(jobId, status = null) {
  const query = { job: jobId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('applicant', 'name phone email avatar rating skills experience location')
    .sort({ appliedAt: -1 });
};

// Static method to get applications by worker
applicationSchema.statics.getApplicationsByWorker = function(workerId, status = null) {
  const query = { applicant: workerId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('job', 'title category location salary status')
    .populate('employer', 'name companyName avatar')
    .sort({ appliedAt: -1 });
};

// Pre-save middleware
applicationSchema.pre('save', function(next) {
  // Add initial status to history if new document
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: this.appliedAt
    });
  }
  
  next();
});

// Transform output
applicationSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Application', applicationSchema); 