const express = require('express');
const { body } = require('express-validator');
const MarketplaceController = require('../controllers/marketplaceController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/list', MarketplaceController.createListing);
router.get('/search-nearby', MarketplaceController.searchNearby);
router.post('/orders', MarketplaceController.placeOrder);
router.get('/orders/:orderId/messages', MarketplaceController.getMessages);
router.post('/orders/:orderId/messages', MarketplaceController.sendMessage);

module.exports = router;
