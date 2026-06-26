const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware, requireRole('admin'));
router.get('/', getDashboardStats);

module.exports = router;
