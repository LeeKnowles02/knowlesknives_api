const env = require('./config/env');
const app = require('./app');
const { sequelize } = require('./models');

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    const server = app.listen(env.port, () => {
      console.log(`Knowles Knives API running on port ${env.port}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await sequelize.close();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Unable to start server:', error.message);
    process.exit(1);
  }
};

startServer();
