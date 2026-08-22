const express = require('express');
const RiskEngineController = require('../controllers/riskEngineController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/crop/:cropId', authenticate, RiskEngineController.getCropRisk);
router.get('/regional-summary', authenticate, RiskEngineController.getRegionalRiskSummary);

module.exports = router;
