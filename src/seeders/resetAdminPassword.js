require('dotenv').config();
const bcrypt = require('bcrypt');
const env = require('../config/env');
const { User } = require('../models');

const resetAdminPassword = async () => {
  const email = env.admin.email.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('Set ADMIN_PASSWORD before resetting the admin password.');
    process.exit(1);
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    console.error(`Admin not found: ${email}`);
    process.exit(1);
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  await user.save();
  console.log(`Password reset for ${email}`);
  process.exit(0);
};

resetAdminPassword().catch((error) => {
  console.error('Failed to reset admin password:', error.message);
  process.exit(1);
});
