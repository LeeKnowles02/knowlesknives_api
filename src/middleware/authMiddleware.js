const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');
const { sendError } = require('../utils/response');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwt.secret);

    const user = await User.findByPk(decoded.id);

    if (!user || !user.active) {
      return sendError(res, 'Invalid or inactive user', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
