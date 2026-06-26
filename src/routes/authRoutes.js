const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, me, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { validateRequired } = require('../middleware/validateMiddleware');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/login',
  loginLimiter,
  validateRequired(['email', 'password']),
  login
);

router.get('/me', authMiddleware, requireRole('admin'), me);
router.post('/logout', authMiddleware, requireRole('admin'), logout);

module.exports = router;
