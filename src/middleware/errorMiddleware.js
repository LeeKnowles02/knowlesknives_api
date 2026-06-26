const errorMiddleware = (err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map((e) => e.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ success: false, message: 'Resource already exists' });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || statusCode < 500;

  if (!isOperational) {
    console.error(err);
  }

  const response = {
    success: false,
    message: isOperational ? err.message : 'Internal server error',
  };

  if (process.env.NODE_ENV !== 'production' && err.stack && !isOperational) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
