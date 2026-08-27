const { GalleryItem } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const pickFields = require('../utils/pickFields');
const { GALLERY_FIELDS } = require('../utils/fieldWhitelist');
const { sendSuccess } = require('../utils/response');
const buildPublicGallery = require('../utils/buildPublicGallery');

const getPublicGallery = asyncHandler(async (_req, res) => {
  const items = await buildPublicGallery();
  sendSuccess(res, items);
});

const getAdminGallery = asyncHandler(async (_req, res) => {
  const items = await GalleryItem.findAll({
    order: [
      ['sortOrder', 'ASC'],
      ['createdAt', 'DESC'],
    ],
  });

  sendSuccess(res, items);
});

const getAdminGalleryById = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findByPk(req.params.id);

  if (!item) {
    throw new AppError('Gallery item not found', 404);
  }

  sendSuccess(res, item);
});

const createGalleryItem = asyncHandler(async (req, res) => {
  const itemData = pickFields(req.body, GALLERY_FIELDS);

  if (itemData.category && !GalleryItem.CATEGORY_VALUES.includes(itemData.category)) {
    throw new AppError(`Invalid category. Allowed values: ${GalleryItem.CATEGORY_VALUES.join(', ')}`, 400);
  }

  const item = await GalleryItem.create(itemData);
  sendSuccess(res, item, 201);
});

const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findByPk(req.params.id);

  if (!item) {
    throw new AppError('Gallery item not found', 404);
  }

  const updateData = pickFields(req.body, GALLERY_FIELDS);

  if (updateData.category && !GalleryItem.CATEGORY_VALUES.includes(updateData.category)) {
    throw new AppError(`Invalid category. Allowed values: ${GalleryItem.CATEGORY_VALUES.join(', ')}`, 400);
  }

  await item.update(updateData);
  sendSuccess(res, item);
});

const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findByPk(req.params.id);

  if (!item) {
    throw new AppError('Gallery item not found', 404);
  }

  await item.destroy();
  sendSuccess(res, { message: 'Gallery item deleted successfully' });
});

const updateGallerySortOrder = asyncHandler(async (req, res) => {
  const { sortOrder } = req.body;

  if (sortOrder === undefined || sortOrder === null || Number.isNaN(Number(sortOrder))) {
    throw new AppError('sortOrder is required and must be a number', 400);
  }

  const item = await GalleryItem.findByPk(req.params.id);

  if (!item) {
    throw new AppError('Gallery item not found', 404);
  }

  await item.update({ sortOrder: Number(sortOrder) });
  sendSuccess(res, item);
});

module.exports = {
  getPublicGallery,
  getAdminGallery,
  getAdminGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  updateGallerySortOrder,
};
