const express = require('express');
const {
  getPublicKnives,
  getPublicKnifeBySlug,
  getAdminKnives,
  getAdminKnifeById,
  createKnife,
  updateKnife,
  deleteKnife,
  updateKnifeStatus,
} = require('../controllers/knifeController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { validateRequired, validateEnum, validatePositiveNumber } = require('../middleware/validateMiddleware');
const { Knife } = require('../models');

const router = express.Router();
const adminRouter = express.Router();

router.get('/', getPublicKnives);
//slug is readable string derived from the name, like bush-knife
router.get('/:slug', getPublicKnifeBySlug);

adminRouter.use(authMiddleware, requireRole('admin'));

adminRouter.get('/', getAdminKnives);
adminRouter.get('/:id', getAdminKnifeById);
adminRouter.post(
  '/',
  validateRequired(['name']),
  validatePositiveNumber('price'),
  validateEnum('availability', Knife.AVAILABILITY_VALUES),
  createKnife
);
adminRouter.put('/:id', validatePositiveNumber('price'), updateKnife);
adminRouter.delete('/:id', deleteKnife);
adminRouter.patch(
  '/:id/status',
  validateRequired(['availability']),
  validateEnum('availability', Knife.AVAILABILITY_VALUES),
  updateKnifeStatus
);

module.exports = { publicRouter: router, adminRouter };
