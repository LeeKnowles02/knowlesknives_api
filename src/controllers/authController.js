const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');
const { normalizeEmail } = require('../utils/validators');

const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  active: user.active,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user || !user.active) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  sendSuccess(res, { token, user: formatUser(user) });
});

const me = asyncHandler(async (req, res) => {
  sendSuccess(res, formatUser(req.user));
});

const logout = (_req, res) => {
  sendSuccess(res, { message: 'Logged out successfully' });
};

module.exports = { login, me, logout };
