const express = require('express');
const {
  getPublicGallery,
  getAdminGallery,
  getAdminGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  updateGallerySortOrder,
} = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { validateRequired } = require('../middleware/validateMiddleware');

const router = express.Router();
const adminRouter = express.Router();

router.get('/', getPublicGallery);

adminRouter.use(authMiddleware, requireRole('admin'));

adminRouter.get('/', getAdminGallery);
adminRouter.get('/:id', getAdminGalleryById);
adminRouter.post(
  '/',
  validateRequired(['title', 'imageUrl', 'category']),
  createGalleryItem,
);
adminRouter.put('/:id', updateGalleryItem);
adminRouter.patch('/:id/sort-order', validateRequired(['sortOrder']), updateGallerySortOrder);
adminRouter.delete('/:id', deleteGalleryItem);

module.exports = { publicRouter: router, adminRouter };
