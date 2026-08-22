const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  AuthController.register
);

router.post(
  '/login',
  [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  AuthController.login
);

router.get('/me', authenticate, AuthController.getProfile);
router.post('/fcm-token', authenticate, AuthController.updateFcmToken);

module.exports = router;
