const { Service } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const pickFields = require('../utils/pickFields');
const { SERVICE_FIELDS } = require('../utils/fieldWhitelist');
const { generateUniqueSlug } = require('../utils/generateSlug');
const { sendSuccess } = require('../utils/response');

const getPublicServices = asyncHandler(async (req, res) => {
  const where = { active: true };

  if (req.query.featured === 'true') {
    where.featured = true;
  }

  const services = await Service.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  sendSuccess(res, services);
});

const getPublicServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({
    where: { slug: req.params.slug, active: true },
  });

  if (!service) {
    throw new AppError('Service not found', 404);
  }

  sendSuccess(res, service);
});

const getAdminServices = asyncHandler(async (_req, res) => {
  const services = await Service.findAll({ order: [['createdAt', 'DESC']] });
  sendSuccess(res, services);
});

const getAdminServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    throw new AppError('Service not found', 404);
  }

  sendSuccess(res, service);
});

const createService = asyncHandler(async (req, res) => {
  const serviceData = pickFields(req.body, SERVICE_FIELDS);
  const slug = await generateUniqueSlug(serviceData.title, Service);

  const service = await Service.create({ ...serviceData, slug });
  sendSuccess(res, service, 201);
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    throw new AppError('Service not found', 404);
  }

  const updateData = pickFields(req.body, SERVICE_FIELDS);

  if (updateData.enquiryType && !Service.ENQUIRY_TYPE_VALUES.includes(updateData.enquiryType)) {
    throw new AppError(`Invalid enquiryType. Allowed values: ${Service.ENQUIRY_TYPE_VALUES.join(', ')}`, 400);
  }

  if (updateData.title && updateData.title !== service.title) {
    updateData.slug = await generateUniqueSlug(updateData.title, Service, service.id);
  }

  await service.update(updateData);
  sendSuccess(res, service);
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    throw new AppError('Service not found', 404);
  }

  await service.update({ active: false });
  sendSuccess(res, { message: 'Service deactivated successfully' });
});

const toggleServiceActive = asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    throw new AppError('Service not found', 404);
  }

  await service.update({ active: !service.active });
  sendSuccess(res, service);
});

module.exports = {
  getPublicServices,
  getPublicServiceBySlug,
  getAdminServices,
  getAdminServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
};
