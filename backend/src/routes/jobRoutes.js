const express = require('express');
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByEmployer,
  getJobStats,
  searchJobs,
  getRecommendedJobs
} = require('../controllers/jobController');
const { authenticateToken, requireEmployer, requireWorker, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, getJobs);
router.get('/search', optionalAuth, searchJobs);
router.get('/:id', optionalAuth, getJobById);

// Worker-only routes
router.get('/recommendations/for-me', authenticateToken, requireWorker, getRecommendedJobs);

// Employer-only routes
router.post('/', authenticateToken, requireEmployer, createJob);
router.put('/:id', authenticateToken, requireEmployer, updateJob);
router.delete('/:id', authenticateToken, requireEmployer, deleteJob);
router.get('/employer/my-jobs', authenticateToken, requireEmployer, getJobsByEmployer);
router.get('/employer/stats', authenticateToken, requireEmployer, getJobStats);

module.exports = router; 