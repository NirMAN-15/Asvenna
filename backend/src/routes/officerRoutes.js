const express = require('express');
const OfficerController = require('../controllers/officerController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/farmers', authenticate, authorizeRoles('OFFICER', 'ADMIN'), OfficerController.getFarmerDirectory);
router.post('/register-farmer-proxy', authenticate, authorizeRoles('OFFICER', 'ADMIN'), OfficerController.registerFarmerProxy);

module.exports = router;
