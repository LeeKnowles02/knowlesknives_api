const { Op } = require('sequelize');
const { Knife, KnifeImage, sequelize } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const pickFields = require('../utils/pickFields');
const { KNIFE_FIELDS } = require('../utils/fieldWhitelist');
const { generateUniqueSlug } = require('../utils/generateSlug');
const { sendSuccess } = require('../utils/response');
const { validateImages, validatePrice } = require('../utils/validators');
const { applyFeaturedFields, MAX_FEATURED } = require('../utils/featuredKnives');

const imageInclude = {
  model: KnifeImage,
  as: 'images',
  separate: true,
  order: [['sortOrder', 'ASC']],
};

const formatKnife = (knife) => {
  const json = knife.toJSON();
  if (json.images) {
    json.primaryImage = json.images.find((img) => img.sortOrder === 1) || json.images[0] || null;
  }
  return json;
};

const createKnifeImages = async (knifeId, images, transaction) => {
  const imageRecords = images.map((img, index) => ({
    knifeId,
    imageUrl: img.imageUrl,
    altText: img.altText || null,
    sortOrder: index + 1,
  }));

  await KnifeImage.bulkCreate(imageRecords, { transaction });
};

const getPublicKnives = asyncHandler(async (req, res) => {
  const { category, availability, featured, search } = req.query;
  const where = { active: true };

  if (category) where.category = category;
  if (availability) {
    if (!Knife.AVAILABILITY_VALUES.includes(availability)) {
      throw new AppError(`Invalid availability filter. Allowed values: ${Knife.AVAILABILITY_VALUES.join(', ')}`, 400);
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

  const knives = await Knife.findAll({
    where,
    include: [imageInclude],
    order: featured === 'true'
      ? [['featuredOrder', 'ASC'], ['createdAt', 'DESC']]
      : [['createdAt', 'DESC']],
    limit: featured === 'true' ? MAX_FEATURED : undefined,
  });

  sendSuccess(res, knives.map(formatKnife));
});

const getPublicKnifeBySlug = asyncHandler(async (req, res) => {
  const knife = await Knife.findOne({
    where: { slug: req.params.slug, active: true },
    include: [imageInclude],
  });

  if (!knife) {
    throw new AppError('Knife not found', 404);
  }

  sendSuccess(res, formatKnife(knife));
});

const getAdminKnives = asyncHandler(async (_req, res) => {
  const knives = await Knife.findAll({
    include: [imageInclude],
    order: [['createdAt', 'DESC']],
  });

  sendSuccess(res, knives.map(formatKnife));
});

const getAdminKnifeById = asyncHandler(async (req, res) => {
  const knife = await Knife.findByPk(req.params.id, { include: [imageInclude] });

  if (!knife) {
    throw new AppError('Knife not found', 404);
  }

  sendSuccess(res, formatKnife(knife));
});

const createKnife = asyncHandler(async (req, res) => {
  const { images, ...body } = req.body;

  const imageError = validateImages(images);
  if (imageError) throw new AppError(imageError, 400);

  const knifeData = pickFields(body, KNIFE_FIELDS);
  const priceError = validatePrice(knifeData.price);
  if (priceError) throw new AppError(priceError, 400);

  const knife = await sequelize.transaction(async (transaction) => {
    await applyFeaturedFields(knifeData, null, transaction);
    const slug = await generateUniqueSlug(knifeData.name, Knife);
    const created = await Knife.create({ ...knifeData, slug }, { transaction });
    await createKnifeImages(created.id, images, transaction);
    return created;
  });

  const result = await Knife.findByPk(knife.id, { include: [imageInclude] });
  sendSuccess(res, formatKnife(result), 201);
});

const updateKnife = asyncHandler(async (req, res) => {
  const knife = await Knife.findByPk(req.params.id);

  if (!knife) {
    throw new AppError('Knife not found', 404);
  }

  const { images, ...body } = req.body;
  const knifeData = pickFields(body, KNIFE_FIELDS);

  if (knifeData.price !== undefined) {
    const priceError = validatePrice(knifeData.price);
    if (priceError) throw new AppError(priceError, 400);
  }

  if (images !== undefined) {
    const imageError = validateImages(images);
    if (imageError) throw new AppError(imageError, 400);
  }

  if (knifeData.name && knifeData.name !== knife.name) {
    knifeData.slug = await generateUniqueSlug(knifeData.name, Knife, knife.id);
  }

  await sequelize.transaction(async (transaction) => {
    await applyFeaturedFields(knifeData, knife.id, transaction);

    if (knifeData.featured === false) {
      knifeData.featuredOrder = null;
    }

    if (knifeData.active === false) {
      knifeData.featuredOrder = null;
    }

    await knife.update(knifeData, { transaction });

    if (images !== undefined) {
      await KnifeImage.destroy({ where: { knifeId: knife.id }, transaction });
      await createKnifeImages(knife.id, images, transaction);
    }
  });

  const updated = await Knife.findByPk(knife.id, { include: [imageInclude] });
  sendSuccess(res, formatKnife(updated));
});

const deleteKnife = asyncHandler(async (req, res) => {
  const knife = await Knife.findByPk(req.params.id);

  if (!knife) {
    throw new AppError('Knife not found', 404);
  }

  await knife.update({ active: false });
  sendSuccess(res, { message: 'Knife deactivated successfully' });
});

const updateKnifeStatus = asyncHandler(async (req, res) => {
  const { availability } = req.body;

  if (!availability || !Knife.AVAILABILITY_VALUES.includes(availability)) {
    throw new AppError(`Invalid availability. Allowed values: ${Knife.AVAILABILITY_VALUES.join(', ')}`, 400);
  }

  const knife = await Knife.findByPk(req.params.id);

  if (!knife) {
    throw new AppError('Knife not found', 404);
  }

  await knife.update({ availability });

  const updated = await Knife.findByPk(knife.id, { include: [imageInclude] });
  sendSuccess(res, formatKnife(updated));
});

module.exports = {
  getPublicKnives,
  getPublicKnifeBySlug,
  getAdminKnives,
  getAdminKnifeById,
  createKnife,
  updateKnife,
  deleteKnife,
  updateKnifeStatus,
};
