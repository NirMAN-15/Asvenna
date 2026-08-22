const express = require('express');
const { body } = require('express-validator');
const MarketplaceController = require('../controllers/marketplaceController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post(
  '/list',
  authenticate,
  authorizeRoles('FARMER', 'ADMIN'),
  [
    body('crop_id').isInt(),
    body('quantity_kg').isFloat({ min: 1 }),
    body('price_per_kg').isFloat({ min: 1 }),
    body('pickup_address').notEmpty(),
    body('latitude').isFloat(),
    body('longitude').isFloat()
  ],
  validateRequest,
  MarketplaceController.createListing
);

router.get('/search-nearby', authenticate, MarketplaceController.searchNearby);
router.post('/orders', authenticate, authorizeRoles('BUYER', 'ADMIN'), MarketplaceController.placeOrder);

module.exports = router;
