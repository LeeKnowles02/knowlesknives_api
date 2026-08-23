const { Op } = require('sequelize');
const { Good, GoodImage, sequelize } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const pickFields = require('../utils/pickFields');
const { GOOD_FIELDS } = require('../utils/fieldWhitelist');
const { generateUniqueSlug } = require('../utils/generateSlug');
const { sendSuccess } = require('../utils/response');
const { validateImages, validatePrice } = require('../utils/validators');
const { applyFeaturedFields } = require('../utils/featuredGoods');

const imageInclude = {
  model: GoodImage,
  as: 'images',
  separate: true,
  order: [['sortOrder', 'ASC']],
};

const formatGood = (good) => {
  const json = good.toJSON();
  if (json.images) {
    json.primaryImage = json.images.find((img) => img.sortOrder === 1) || json.images[0] || null;
  }
  return json;
};

const createGoodImages = async (goodId, images, transaction) => {
  const imageRecords = images.map((img, index) => ({
    goodId,
    imageUrl: img.imageUrl,
    altText: img.altText || null,
    sortOrder: index + 1,
  }));

  await GoodImage.bulkCreate(imageRecords, { transaction });
};

const getPublicGoods = asyncHandler(async (req, res) => {
  const { category, availability, featured, search } = req.query;
  const where = { active: true };

  if (category) where.category = category;
  if (availability) {
    if (!Good.AVAILABILITY_VALUES.includes(availability)) {
      throw new AppError(`Invalid availability filter. Allowed values: ${Good.AVAILABILITY_VALUES.join(', ')}`, 400);
    }
    where.availability = availability;
  }
  if (featured === 'true') where.featured = true;

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { shortDescription: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { category: { [Op.like]: `%${search}%` } },
    ];
  }

  const goods = await Good.findAll({
    where,
    include: [imageInclude],
    order: featured === 'true'
      ? [['featuredOrder', 'ASC'], ['createdAt', 'DESC']]
      : [['createdAt', 'DESC']],
    limit: featured === 'true' ? 5 : undefined,
  });

  sendSuccess(res, goods.map(formatGood));
});

const getPublicGoodBySlug = asyncHandler(async (req, res) => {
  const good = await Good.findOne({
    where: { slug: req.params.slug, active: true },
    include: [imageInclude],
  });

  if (!good) {
    throw new AppError('Good not found', 404);
  }

  sendSuccess(res, formatGood(good));
});

const getAdminGoods = asyncHandler(async (_req, res) => {
  const goods = await Good.findAll({
    include: [imageInclude],
    order: [['createdAt', 'DESC']],
  });

  sendSuccess(res, goods.map(formatGood));
});

const getAdminGoodById = asyncHandler(async (req, res) => {
  const good = await Good.findByPk(req.params.id, { include: [imageInclude] });

  if (!good) {
    throw new AppError('Good not found', 404);
  }

  sendSuccess(res, formatGood(good));
});

const createGood = asyncHandler(async (req, res) => {
  const { images, ...body } = req.body;

  const imageError = validateImages(images);
  if (imageError) throw new AppError(imageError, 400);

  const goodData = pickFields(body, GOOD_FIELDS);
  const priceError = validatePrice(goodData.price);
  if (priceError) throw new AppError(priceError, 400);

  const good = await sequelize.transaction(async (transaction) => {
    await applyFeaturedFields(goodData, null, transaction);
    const slug = await generateUniqueSlug(goodData.name, Good);
    const created = await Good.create({ ...goodData, slug }, { transaction });
    await createGoodImages(created.id, images, transaction);
    return created;
  });

  const result = await Good.findByPk(good.id, { include: [imageInclude] });
  sendSuccess(res, formatGood(result), 201);
});

const updateGood = asyncHandler(async (req, res) => {
  const good = await Good.findByPk(req.params.id);

  if (!good) {
    throw new AppError('Good not found', 404);
  }

  const { images, ...body } = req.body;
  const goodData = pickFields(body, GOOD_FIELDS);

  if (goodData.price !== undefined) {
    const priceError = validatePrice(goodData.price);
    if (priceError) throw new AppError(priceError, 400);
  }

  if (images !== undefined) {
    const imageError = validateImages(images);
    if (imageError) throw new AppError(imageError, 400);
  }

  if (goodData.name && goodData.name !== good.name) {
    goodData.slug = await generateUniqueSlug(goodData.name, Good, good.id);
  }

  await sequelize.transaction(async (transaction) => {
    await applyFeaturedFields(goodData, good.id, transaction);

    if (goodData.featured === false) {
      goodData.featuredOrder = null;
    }

    if (goodData.active === false) {
      goodData.featuredOrder = null;
    }

    await good.update(goodData, { transaction });

    if (images !== undefined) {
      await GoodImage.destroy({ where: { goodId: good.id }, transaction });
      await createGoodImages(good.id, images, transaction);
    }
  });

  const updated = await Good.findByPk(good.id, { include: [imageInclude] });
  sendSuccess(res, formatGood(updated));
});

const deleteGood = asyncHandler(async (req, res) => {
  const good = await Good.findByPk(req.params.id);

  if (!good) {
    throw new AppError('Good not found', 404);
  }

  await good.update({ active: false });
  sendSuccess(res, { message: 'Good deactivated successfully' });
});

const updateGoodStatus = asyncHandler(async (req, res) => {
  const { availability } = req.body;

  if (!availability || !Good.AVAILABILITY_VALUES.includes(availability)) {
    throw new AppError(`Invalid availability. Allowed values: ${Good.AVAILABILITY_VALUES.join(', ')}`, 400);
  }

  const good = await Good.findByPk(req.params.id);

  if (!good) {
    throw new AppError('Good not found', 404);
  }

  await good.update({ availability });

  const updated = await Good.findByPk(good.id, { include: [imageInclude] });
  sendSuccess(res, formatGood(updated));
});

module.exports = {
  getPublicGoods,
  getPublicGoodBySlug,
  getAdminGoods,
  getAdminGoodById,
  createGood,
  updateGood,
  deleteGood,
  updateGoodStatus,
};
