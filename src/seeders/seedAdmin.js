require('dotenv').config();
const bcrypt = require('bcrypt');
const env = require('../config/env');
const { sequelize, User } = require('../models');

const seedAdmin = async () => {
  try {
    if (env.isProduction && !process.env.ADMIN_PASSWORD) {
      console.log('Skipping admin seed in production. Set ADMIN_PASSWORD to seed.');
      process.exit(0);
    }

    await sequelize.authenticate();

    const email = env.admin.email.toLowerCase();
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      console.log('Admin user already exists. Skipping.');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(env.admin.password, 10);

    await User.create({
      name: 'Knowles Admin',
      email,
      passwordHash,
      role: 'admin',
      active: true,
    });

    console.log('Admin user created successfully.');
    console.log(`Email: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
