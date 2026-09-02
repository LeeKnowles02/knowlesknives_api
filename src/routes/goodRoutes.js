const express = require('express');
const {
  getPublicGoods,
  getPublicGoodBySlug,
  getAdminGoods,
  getAdminGoodById,
  createGood,
  updateGood,
  deleteGood,
  updateGoodStatus,
} = require('../controllers/goodController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { validateRequired, validateEnum, validatePositiveNumber } = require('../middleware/validateMiddleware');
const { Good } = require('../models');

const router = express.Router();
const adminRouter = express.Router();

router.get('/', getPublicGoods);
router.get('/:slug', getPublicGoodBySlug);

adminRouter.use(authMiddleware, requireRole('admin'));

adminRouter.get('/', getAdminGoods);
adminRouter.get('/:id', getAdminGoodById);
adminRouter.post(
  '/',
  validateRequired(['name']),
  validatePositiveNumber('price'),
  validateEnum('availability', Good.AVAILABILITY_VALUES),
  createGood
);
adminRouter.put('/:id', validatePositiveNumber('price'), updateGood);
adminRouter.delete('/:id', deleteGood);
adminRouter.patch(
  '/:id/status',
  validateRequired(['availability']),
  validateEnum('availability', Good.AVAILABILITY_VALUES),
  updateGoodStatus
);

module.exports = { publicRouter: router, adminRouter };
