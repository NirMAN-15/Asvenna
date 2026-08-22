const app = require('./app');
const config = require('./config/config');

const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🌾 ASVANNA Backend API Server Started`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🚀 Listening on Port: http://localhost:${config.port}`);
  console.log(`📡 Health Check: http://localhost:${config.port}/health`);
  console.log(`=======================================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
