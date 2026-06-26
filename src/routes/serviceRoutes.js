const express = require('express');
const {
  getPublicServices,
  getPublicServiceBySlug,
  getAdminServices,
  getAdminServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
} = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { validateRequired, validateEnum } = require('../middleware/validateMiddleware');
const { Service } = require('../models');

const router = express.Router();
const adminRouter = express.Router();

router.get('/', getPublicServices);
router.get('/:slug', getPublicServiceBySlug);

adminRouter.use(authMiddleware, requireRole('admin'));

adminRouter.get('/', getAdminServices);
adminRouter.get('/:id', getAdminServiceById);
adminRouter.post(
  '/',
  validateRequired(['title', 'enquiryType']),
  validateEnum('enquiryType', Service.ENQUIRY_TYPE_VALUES),
  createService
);
adminRouter.put('/:id', updateService);
adminRouter.delete('/:id', deleteService);
adminRouter.patch('/:id/toggle-active', toggleServiceActive);

module.exports = { publicRouter: router, adminRouter };
