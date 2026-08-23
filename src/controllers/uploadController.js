const cloudinaryUtil = require('../utils/cloudinary');
const { sendSuccess, sendError } = require('../utils/response');

const resolveBaseUrl = (req) => {
  const forwardedProto = req.get('x-forwarded-proto');
  const protocol = forwardedProto ? forwardedProto.split(',')[0].trim() : req.protocol;
  return `${protocol}://${req.get('host')}`;
};

const buildLocalFileResponse = (req, file) => {
  const baseUrl = resolveBaseUrl(req);
  return {
    url: `${baseUrl}/uploads/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
  };
};

const buildCloudinaryFileResponse = (file, result) => ({
  url: result.secure_url,
  filename: result.public_id,
  originalName: file.originalname,
  size: file.size,
  mimeType: file.mimetype,
});

const processFile = async (req, file) => {
  if (cloudinaryUtil.isConfigured()) {
    const result = await cloudinaryUtil.uploadBuffer(file.buffer, file.originalname);
    return buildCloudinaryFileResponse(file, result);
  }
  return buildLocalFileResponse(req, file);
};

const uploadImage = async (req, res) => {
  if (!req.file) {
    return sendError(res, 'No image file provided', 400);
  }

  try {
    const response = await processFile(req, req.file);
    sendSuccess(res, response);
  } catch (error) {
    sendError(res, error.message || 'Upload failed', 500);
  }
};

const uploadMultipleImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return sendError(res, 'No image files provided', 400);
  }

  try {
    const images = await Promise.all(req.files.map((file) => processFile(req, file)));
    sendSuccess(res, { images });
  } catch (error) {
    sendError(res, error.message || 'Upload failed', 500);
  }
};

module.exports = { uploadImage, uploadMultipleImages };
