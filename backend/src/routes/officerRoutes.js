const express = require('express');
const OfficerController = require('../controllers/officerController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/farmers', OfficerController.getFarmerDirectory);
router.post('/register-farmer-proxy', OfficerController.registerFarmerProxy);
router.get('/export-report', OfficerController.exportReport);

module.exports = router;
