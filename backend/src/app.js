const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const plantingRoutes = require('./routes/plantingRoutes');
const riskRoutes = require('./routes/riskRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const officerRoutes = require('./routes/officerRoutes');
const broadcastRoutes = require('./routes/broadcastRoutes');
const errorHandler = require('./middlewares/errorHandler');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health Check Endpoint
app.get('/health', (req, res) => {
  return ApiResponse.success(res, { status: 'UP', service: 'ASVANNA Backend API' }, 'Service healthy');
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/planting', plantingRoutes);
app.use('/api/v1/risk', riskRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/officer', officerRoutes);
app.use('/api/v1/broadcasts', broadcastRoutes);

// 404 Handler
app.use((req, res) => {
  return ApiResponse.error(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
