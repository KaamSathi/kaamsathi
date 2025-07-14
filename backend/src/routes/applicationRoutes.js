const express = require('express');
const {
  applyForJob,
  getWorkerApplications,
  getJobApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats,
  scheduleInterview
} = require('../controllers/applicationController');
const { authenticateToken, requireWorker, requireEmployer } = require('../middleware/auth');

const router = express.Router();

// Worker routes
router.post('/jobs/:jobId/apply', authenticateToken, requireWorker, applyForJob);
router.get('/my-applications', authenticateToken, requireWorker, getWorkerApplications);
router.post('/:id/withdraw', authenticateToken, requireWorker, withdrawApplication);

// Employer routes
router.get('/jobs/:jobId', authenticateToken, requireEmployer, getJobApplications);
router.put('/:id/status', authenticateToken, requireEmployer, updateApplicationStatus);
router.post('/:id/interview', authenticateToken, requireEmployer, scheduleInterview);
router.get('/employer/stats', authenticateToken, requireEmployer, getApplicationStats);

// Shared routes (both worker and employer can access)
router.get('/:id', authenticateToken, getApplicationById);

module.exports = router; 