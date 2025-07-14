const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// Get all jobs with filtering and search
const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      city,
      state,
      type,
      salaryMin,
      salaryMax,
      experience,
      skills,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build search filters
    const filters = { status: 'active' };

    // Text search
    if (search) {
      filters.$text = { $search: search };
    }

    // Category filter
    if (category && category !== 'all') {
      filters.category = category;
    }

    // Location filters
    if (city && city !== 'all') {
      filters['location.city'] = new RegExp(city, 'i');
    }
    if (state && state !== 'all') {
      filters['location.state'] = new RegExp(state, 'i');
    }

    // Job type filter
    if (type && type !== 'all') {
      filters.type = type;
    }

    // Experience filter
    if (experience && experience !== 'all') {
      filters['requirements.experience'] = experience;
    }

    // Skills filter
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      filters['requirements.skills'] = { $in: skillsArray };
    }

    // Salary filters
    if (salaryMin) {
      filters['salary.min'] = { $gte: Number(salaryMin) };
    }
    if (salaryMax) {
      filters['salary.max'] = { $lte: Number(salaryMax) };
    }

    // Sorting
    const sortOptions = {};
    switch (sortBy) {
      case 'salary':
        sortOptions['salary.min'] = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'date':
        sortOptions.createdAt = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'relevance':
        if (search) {
          sortOptions.score = { $meta: 'textScore' };
        } else {
          sortOptions.createdAt = -1;
        }
        break;
      default:
        sortOptions.createdAt = -1;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const jobs = await Job.find(filters)
      .populate('employer', 'name companyName avatar rating.average isVerified')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(filters);
    const totalPages = Math.ceil(totalJobs / Number(limit));

    res.status(200).json({
      status: 'success',
      data: {
        jobs,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalJobs,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch jobs'
    });
  }
};

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate('employer', 'name companyName avatar rating.average isVerified phone email companyDescription');

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Increment view count
    await job.incrementViews();

    // Check if current user has applied (if authenticated)
    let hasApplied = false;
    if (req.user) {
      const application = await Application.findOne({
        job: id,
        applicant: req.user._id
      });
      hasApplied = !!application;
    }

    res.status(200).json({
      status: 'success',
      data: {
        job,
        hasApplied
      }
    });

  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch job details'
    });
  }
};

// Create new job (employer only)
const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      employer: req.user._id
    };

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'location', 'type', 'salary', 'requirements'];
    const missingFields = requiredFields.filter(field => !jobData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Create job
    const job = new Job(jobData);
    await job.save();

    // Populate employer data
    await job.populate('employer', 'name companyName avatar rating.average isVerified');

    res.status(201).json({
      status: 'success',
      message: 'Job created successfully',
      data: {
        job
      }
    });

  } catch (error) {
    console.error('Create job error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create job'
    });
  }
};

// Update job (employer only)
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find job and check ownership
    const job = await Job.findOne({ _id: id, employer: req.user._id });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found or you do not have permission to update it'
      });
    }

    // Update job
    Object.assign(job, req.body);
    await job.save();

    // Populate employer data
    await job.populate('employer', 'name companyName avatar rating.average isVerified');

    res.status(200).json({
      status: 'success',
      message: 'Job updated successfully',
      data: {
        job
      }
    });

  } catch (error) {
    console.error('Update job error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to update job'
    });
  }
};

// Delete job (employer only)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find job and check ownership
    const job = await Job.findOne({ _id: id, employer: req.user._id });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found or you do not have permission to delete it'
      });
    }

    // Check if job has applications
    const applicationCount = await Application.countDocuments({ job: id });
    
    if (applicationCount > 0) {
      // Don't delete, just mark as cancelled
      job.status = 'cancelled';
      await job.save();
      
      return res.status(200).json({
        status: 'success',
        message: 'Job cancelled successfully (has applications, so marked as cancelled instead of deleted)'
      });
    }

    // Safe to delete
    await Job.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete job'
    });
  }
};

// Get jobs by employer
const getJobsByEmployer = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = 'all'
    } = req.query;

    const filters = { employer: req.user._id };
    
    if (status && status !== 'all') {
      filters.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get application counts for each job
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ job: job._id });
        return {
          ...job.toJSON(),
          applicationCount
        };
      })
    );

    const totalJobs = await Job.countDocuments(filters);
    const totalPages = Math.ceil(totalJobs / Number(limit));

    res.status(200).json({
      status: 'success',
      data: {
        jobs: jobsWithStats,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalJobs,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get jobs by employer error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch your jobs'
    });
  }
};

// Get job statistics for employer
const getJobStats = async (req, res) => {
  try {
    const employerId = req.user._id;

    const stats = await Job.aggregate([
      { $match: { employer: employerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalApplications: { $sum: '$currentApplications' }
        }
      }
    ]);

    const totalJobs = await Job.countDocuments({ employer: employerId });
    const activeJobs = await Job.countDocuments({ employer: employerId, status: 'active' });

    // Get recent applications
    const recentApplications = await Application.find({
      employer: employerId
    })
      .populate('applicant', 'name avatar rating')
      .populate('job', 'title')
      .sort({ appliedAt: -1 })
      .limit(5);

    res.status(200).json({
      status: 'success',
      data: {
        totalJobs,
        activeJobs,
        stats,
        recentApplications
      }
    });

  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch job statistics'
    });
  }
};

// Search jobs with advanced filters
const searchJobs = async (req, res) => {
  try {
    const {
      q: searchQuery,
      category,
      city,
      state,
      salaryMin,
      salaryMax,
      type,
      experience,
      skills,
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = req.query;

    const filters = {
      category,
      city,
      state,
      salaryMin,
      salaryMax,
      type,
      experience,
      skills: skills ? skills.split(',') : undefined,
      sortBy
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );

    const jobs = await Job.searchJobs(searchQuery, filters);

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const paginatedJobs = jobs.slice(skip, skip + Number(limit));

    res.status(200).json({
      status: 'success',
      data: {
        jobs: paginatedJobs,
        pagination: {
          currentPage: Number(page),
          totalJobs: jobs.length,
          totalPages: Math.ceil(jobs.length / Number(limit))
        }
      }
    });

  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search jobs'
    });
  }
};

// Get recommended jobs for worker
const getRecommendedJobs = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'worker') {
      return res.status(403).json({
        status: 'error',
        message: 'Only workers can get job recommendations'
      });
    }

    const filters = { status: 'active' };

    // Match based on user's skills
    if (user.skills && user.skills.length > 0) {
      filters['requirements.skills'] = { $in: user.skills };
    }

    // Match based on user's location
    if (user.location && user.location.city) {
      filters['location.city'] = new RegExp(user.location.city, 'i');
    }

    // Match based on user's experience
    if (user.experience) {
      filters['requirements.experience'] = { $in: ['fresher', user.experience] };
    }

    const recommendedJobs = await Job.find(filters)
      .populate('employer', 'name companyName avatar rating.average isVerified')
      .sort({ priority: -1, createdAt: -1 })
      .limit(20);

    res.status(200).json({
      status: 'success',
      data: {
        jobs: recommendedJobs
      }
    });

  } catch (error) {
    console.error('Get recommended jobs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch recommended jobs'
    });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByEmployer,
  getJobStats,
  searchJobs,
  getRecommendedJobs
}; 