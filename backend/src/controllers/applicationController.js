const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, proposedSalary, availability } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId).populate('employer');
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        status: 'error',
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if worker has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already applied for this job'
      });
    }

    // Check if application deadline has passed
    if (job.isApplicationDeadlinePassed()) {
      return res.status(400).json({
        status: 'error',
        message: 'Application deadline has passed'
      });
    }

    // Check if job is full
    if (job.isJobFull()) {
      return res.status(400).json({
        status: 'error',
        message: 'This job has reached maximum applications'
      });
    }

    // Create application
    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      employer: job.employer._id,
      coverLetter,
      proposedSalary,
      availability
    });

    await application.save();

    // Update job application count
    await job.incrementApplications();

    // Populate application data
    await application.populate([
      { path: 'job', select: 'title category location salary' },
      { path: 'employer', select: 'name companyName avatar' }
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully',
      data: {
        application
      }
    });

  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit application'
    });
  }
};

// Get applications for a worker
const getWorkerApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = 'all'
    } = req.query;

    const filters = { applicant: req.user._id };
    
    if (status && status !== 'all') {
      filters.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const applications = await Application.find(filters)
      .populate('job', 'title category location salary status')
      .populate('employer', 'name companyName avatar rating.average')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalApplications = await Application.countDocuments(filters);
    const totalPages = Math.ceil(totalApplications / Number(limit));

    res.status(200).json({
      status: 'success',
      data: {
        applications,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalApplications,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get worker applications error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch applications'
    });
  }
};

// Get applications for an employer's job
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      page = 1,
      limit = 20,
      status = 'all'
    } = req.query;

    // Verify job ownership
    const job = await Job.findOne({ _id: jobId, employer: req.user._id });
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found or you do not have permission to view applications'
      });
    }

    const filters = { job: jobId };
    
    if (status && status !== 'all') {
      filters.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const applications = await Application.find(filters)
      .populate('applicant', 'name phone email avatar rating skills experience location bio')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Mark applications as viewed
    await Application.updateMany(
      { job: jobId, viewedByEmployer: false },
      { viewedByEmployer: true, viewedAt: new Date() }
    );

    const totalApplications = await Application.countDocuments(filters);
    const totalPages = Math.ceil(totalApplications / Number(limit));

    res.status(200).json({
      status: 'success',
      data: {
        applications,
        job,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalApplications,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch job applications'
    });
  }
};

// Get single application details
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('job', 'title category location salary employer')
      .populate('applicant', 'name phone email avatar rating skills experience location bio')
      .populate('employer', 'name companyName avatar');

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    // Check if user has permission to view this application
    const isApplicant = application.applicant._id.toString() === req.user._id.toString();
    const isEmployer = application.employer._id.toString() === req.user._id.toString();

    if (!isApplicant && !isEmployer) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to view this application'
      });
    }

    // Mark as viewed if employer is viewing
    if (isEmployer && !application.viewedByEmployer) {
      await application.markAsViewed();
    }

    res.status(200).json({
      status: 'success',
      data: {
        application
      }
    });

  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch application details'
    });
  }
};

// Update application status (employer only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'shortlisted', 'interview-scheduled', 'accepted', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    const application = await Application.findById(id)
      .populate('applicant', 'name phone email')
      .populate('job', 'title');

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    // Check if user is the employer for this application
    if (application.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to update this application'
      });
    }

    // Update status
    await application.updateStatus(status, req.user._id, note);

    res.status(200).json({
      status: 'success',
      message: `Application ${status} successfully`,
      data: {
        application
      }
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update application status'
    });
  }
};

// Withdraw application (worker only)
const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    // Check if user is the applicant
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only withdraw your own applications'
      });
    }

    // Check if application can be withdrawn
    if (['accepted', 'rejected'].includes(application.status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot withdraw application that has been accepted or rejected'
      });
    }

    // Update status to withdrawn
    await application.updateStatus('withdrawn', req.user._id, 'Application withdrawn by applicant');

    res.status(200).json({
      status: 'success',
      message: 'Application withdrawn successfully'
    });

  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to withdraw application'
    });
  }
};

// Get application statistics for employer
const getApplicationStats = async (req, res) => {
  try {
    const employerId = req.user._id;

    const stats = await Application.aggregate([
      { $match: { employer: employerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await Application.countDocuments({ employer: employerId });
    const newApplications = await Application.countDocuments({ 
      employer: employerId, 
      viewedByEmployer: false 
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalApplications,
        newApplications,
        stats
      }
    });

  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch application statistics'
    });
  }
};

// Schedule interview
const scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledAt, location, type, notes } = req.body;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    // Check if user is the employer
    if (application.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the employer can schedule interviews'
      });
    }

    // Update interview details
    application.interview = {
      scheduledAt: new Date(scheduledAt),
      location,
      type,
      notes
    };

    // Update status to interview-scheduled
    await application.updateStatus('interview-scheduled', req.user._id, 'Interview scheduled');

    res.status(200).json({
      status: 'success',
      message: 'Interview scheduled successfully',
      data: {
        application
      }
    });

  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to schedule interview'
    });
  }
};

module.exports = {
  applyForJob,
  getWorkerApplications,
  getJobApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats,
  scheduleInterview
}; 