const { Enquiry, Knife, Good, Service } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { normalizeEmail } = require('../utils/validators');

const SUCCESS_MESSAGE =
  'Thank you. Your enquiry has been received. Knowles Knives will contact you to confirm details and availability.';

const createEnquiry = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    enquiryType,
    selectedKnifeId,
    selectedGoodId,
    selectedServiceId,
    message,
  } = req.body;

  let selectedKnifeName = null;
  let selectedGoodName = null;
  let selectedServiceName = null;

  if (selectedKnifeId) {
    const knife = await Knife.findOne({
      where: { id: selectedKnifeId, active: true },
    });

    if (!knife) {
      throw new AppError('Selected knife not found or is not available', 400);
    }

    selectedKnifeName = knife.name;
  }

  if (selectedGoodId) {
    const good = await Good.findOne({
      where: { id: selectedGoodId, active: true },
    });

    if (!good) {
      throw new AppError('Selected good not found or is not available', 400);
    }

    selectedGoodName = good.name;
  }

  if (selectedServiceId) {
    const service = await Service.findOne({
      where: { id: selectedServiceId, active: true },
    });

    if (!service) {
      throw new AppError('Selected service not found or is not available', 400);
    }

    selectedServiceName = service.title;
  }

  await Enquiry.create({
    name: name.trim(),
    email: normalizeEmail(email),
    phone: phone.trim(),
    enquiryType,
    selectedKnifeId: selectedKnifeId || null,
    selectedKnifeName,
    selectedGoodId: selectedGoodId || null,
    selectedGoodName,
    selectedServiceId: selectedServiceId || null,
    selectedServiceName,
    message: message.trim(),
    status: 'New',
  });

  sendSuccess(res, { message: SUCCESS_MESSAGE }, 201);
});

const getAdminEnquiries = asyncHandler(async (req, res) => {
  const where = {};
  const { status, enquiryType } = req.query;

  if (status) {
    if (!Enquiry.STATUS_VALUES.includes(status)) {
      throw new AppError(`Invalid status filter. Allowed values: ${Enquiry.STATUS_VALUES.join(', ')}`, 400);
    }
    where.status = status;
  }

  if (enquiryType) {
    if (!Enquiry.ENQUIRY_TYPE_VALUES.includes(enquiryType)) {
      throw new AppError(`Invalid enquiryType filter. Allowed values: ${Enquiry.ENQUIRY_TYPE_VALUES.join(', ')}`, 400);
    }
    where.enquiryType = enquiryType;
  }

  const enquiries = await Enquiry.findAll({
    where,
    include: [
      { model: Knife, as: 'selectedKnife', attributes: ['id', 'name', 'slug'] },
      { model: Good, as: 'selectedGood', attributes: ['id', 'name', 'slug'] },
      { model: Service, as: 'selectedService', attributes: ['id', 'title', 'slug'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  sendSuccess(res, enquiries);
});

const getAdminEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByPk(req.params.id, {
    include: [
      { model: Knife, as: 'selectedKnife', attributes: ['id', 'name', 'slug'] },
      { model: Good, as: 'selectedGood', attributes: ['id', 'name', 'slug'] },
      { model: Service, as: 'selectedService', attributes: ['id', 'title', 'slug'] },
    ],
  });

  if (!enquiry) {
    throw new AppError('Enquiry not found', 404);
  }

  sendSuccess(res, enquiry);
});

const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !Enquiry.STATUS_VALUES.includes(status)) {
    throw new AppError(`Invalid status. Allowed values: ${Enquiry.STATUS_VALUES.join(', ')}`, 400);
  }

  const enquiry = await Enquiry.findByPk(req.params.id);

  if (!enquiry) {
    throw new AppError('Enquiry not found', 404);
  }

  await enquiry.update({ status });
  sendSuccess(res, enquiry);
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByPk(req.params.id);

  if (!enquiry) {
    throw new AppError('Enquiry not found', 404);
  }

  await enquiry.destroy();
  sendSuccess(res, { message: 'Enquiry deleted successfully' });
});

module.exports = {
  createEnquiry,
  getAdminEnquiries,
  getAdminEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
};
