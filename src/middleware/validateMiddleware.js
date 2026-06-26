const AppError = require('../utils/AppError');

const isMissing = (value) => {
  if (value === undefined || value === null || value === '') {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  return false;
};

const validateRequired = (fields) => {
  return (req, res, next) => {
    const missing = fields.filter((field) => isMissing(req.body[field]));

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    next();
  };
};

const validateEnum = (field, allowedValues) => {
  return (req, res, next) => {
    const value = req.body[field];

    if (!isMissing(value) && !allowedValues.includes(value)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${field}. Allowed values: ${allowedValues.join(', ')}`,
      });
    }

    next();
  };
};

const validatePositiveNumber = (field) => {
  return (req, res, next) => {
    const value = req.body[field];

    if (value === undefined || value === null || value === '') {
      return next();
    }

    const num = Number(value);
    if (Number.isNaN(num) || num < 0) {
      return res.status(400).json({
        success: false,
        message: `${field} must be a valid positive number`,
      });
    }

    next();
  };
};

module.exports = { validateRequired, validateEnum, validatePositiveNumber, isMissing };
