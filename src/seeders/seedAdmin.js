require('dotenv').config();
const bcrypt = require('bcrypt');
const env = require('../config/env');
const { sequelize, User } = require('../models');

const defaultAdmins = [
  {
    name: 'Knowles Admin',
    email: env.admin.email,
    password: env.admin.password,
  },
  {
    name: 'Knowles Admin',
    email: 'knowles@admin.com',
    password: 'Qwerty12',
  },
];

const seedAdmin = async () => {
  try {
    if (env.isProduction && !process.env.ADMIN_PASSWORD) {
      console.log('Skipping admin seed in production. Set ADMIN_PASSWORD to seed.');
      process.exit(0);
    }

    await sequelize.authenticate();

    for (const admin of defaultAdmins) {
      const email = admin.email.toLowerCase();
      const existing = await User.findOne({ where: { email } });

      if (existing) {
        console.log(`Admin already exists: ${email}`);
        continue;
      }

      const passwordHash = await bcrypt.hash(admin.password, 10);

      await User.create({
        name: admin.name,
        email,
        passwordHash,
        role: 'admin',
        active: true,
      });

      console.log(`Admin user created: ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
