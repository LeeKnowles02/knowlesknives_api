const env = require('./config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const { publicRouter: knifePublicRoutes, adminRouter: knifeAdminRoutes } = require('./routes/knifeRoutes');
const { publicRouter: servicePublicRoutes, adminRouter: serviceAdminRoutes } = require('./routes/serviceRoutes');
const { publicRouter: enquiryPublicRoutes, adminRouter: enquiryAdminRoutes } = require('./routes/enquiryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const { sendSuccess, sendError } = require('./utils/response');

const app = express();

if (env.isProduction) {
  app.set('trust proxy', 1);
}

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: env.clientUrl,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);
app.use(morgan(env.isProduction ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', async (_req, res) => {
  try {
    await sequelize.authenticate();
    sendSuccess(res, { status: 'ok', database: 'connected' });
  } catch {
    sendError(res, 'Database unavailable', 503);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/knives', knifePublicRoutes);
app.use('/api/admin/knives', knifeAdminRoutes);
app.use('/api/services', servicePublicRoutes);
app.use('/api/admin/services', serviceAdminRoutes);
app.use('/api/enquiries', enquiryPublicRoutes);
app.use('/api/admin/enquiries', enquiryAdminRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/upload', uploadRoutes);

app.use((_req, res) => {
  sendError(res, 'Route not found', 404);
});

app.use(errorMiddleware);

module.exports = app;
