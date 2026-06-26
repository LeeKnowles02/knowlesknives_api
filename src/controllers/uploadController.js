const env = require('../config/env');
const { sendSuccess, sendError } = require('../utils/response');

const buildFileResponse = (req, file) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return {
    url: `${baseUrl}/uploads/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
  };
};

const uploadImage = (req, res) => {
  if (!req.file) {
    return sendError(res, 'No image file provided', 400);
  }

  sendSuccess(res, buildFileResponse(req, req.file));
};

const uploadMultipleImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return sendError(res, 'No image files provided', 400);
  }

  sendSuccess(res, {
    images: req.files.map((file) => buildFileResponse(req, file)),
  });
};

module.exports = { uploadImage, uploadMultipleImages };
