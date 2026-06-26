const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  createEnquiry,
  getAdminEnquiries,
  getAdminEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { validateRequired, validateEnum } = require('../middleware/validateMiddleware');
const { Enquiry } = require('../models');

const router = express.Router();
const adminRouter = express.Router();

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many enquiries submitted. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/',
  enquiryLimiter,
  validateRequired(['name', 'email', 'phone', 'enquiryType', 'message']),
  validateEnum('enquiryType', Enquiry.ENQUIRY_TYPE_VALUES),
  createEnquiry
);

adminRouter.use(authMiddleware, requireRole('admin'));

adminRouter.get('/', getAdminEnquiries);
adminRouter.get('/:id', getAdminEnquiryById);
adminRouter.patch(
  '/:id/status',
  validateRequired(['status']),
  validateEnum('status', Enquiry.STATUS_VALUES),
  updateEnquiryStatus
);
adminRouter.delete('/:id', deleteEnquiry);

module.exports = { publicRouter: router, adminRouter };
