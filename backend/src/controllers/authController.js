const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const config = require('../config/config');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  static async register(req, res, next) {
    try {
      const { full_name, phone, nic, email, password, role = 'FARMER', language_preference = 'si', district = 'Badulla', division = 'Bandarawela', latitude, longitude } = req.body;

      // Check existing user
      const existing = await db.query('SELECT id FROM users WHERE phone = $1 OR (email IS NOT NULL AND email = $2)', [phone, email || '']);
      if (existing.rows.length > 0) {
        return ApiResponse.error(res, 'User with this phone or email already exists.', 400);
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Officers require Super Admin verification by default
      const is_verified = role === 'FARMER' || role === 'BUYER';

      const result = await db.query(
        `INSERT INTO users (full_name, phone, nic, email, password_hash, role, language_preference, district, division, latitude, longitude, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id, full_name, phone, nic, email, role, language_preference, district, division, is_verified, created_at`,
        [full_name, phone, nic, email, password_hash, role, language_preference, district, division, latitude, longitude, is_verified]
      );

      const user = result.rows[0];
      const expiresIn = role === 'OFFICER' ? config.jwt.officerExpiresIn : config.jwt.farmerExpiresIn;
      const token = jwt.sign({ id: user.id, role: user.role, phone: user.phone, district: user.district }, config.jwt.secret, { expiresIn });

      return ApiResponse.success(res, { user, token }, 'User registered successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { phone, password } = req.body;

      const result = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
      if (result.rows.length === 0) {
        return ApiResponse.error(res, 'Invalid phone number or password.', 401);
      }

      const user = result.rows[0];
      if (!user.is_active) {
        return ApiResponse.error(res, 'Your account has been deactivated. Please contact support.', 403);
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return ApiResponse.error(res, 'Invalid phone number or password.', 401);
      }

      const expiresIn = user.role === 'OFFICER' ? config.jwt.officerExpiresIn : config.jwt.farmerExpiresIn;
      const token = jwt.sign({ id: user.id, role: user.role, phone: user.phone, district: user.district }, config.jwt.secret, { expiresIn });

      delete user.password_hash;
      return ApiResponse.success(res, { user, token }, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const result = await db.query(
        'SELECT id, full_name, phone, nic, email, role, language_preference, district, division, gnd_division, latitude, longitude, is_verified, created_at FROM users WHERE id = $1',
        [req.user.id]
      );
      if (result.rows.length === 0) return ApiResponse.error(res, 'User not found', 404);
      return ApiResponse.success(res, result.rows[0]);
    } catch (err) {
      next(err);
    }
  }

  static async updateFcmToken(req, res, next) {
    try {
      const { fcm_token } = req.body;
      await db.query('UPDATE users SET fcm_token = $1 WHERE id = $2', [fcm_token, req.user.id]);
      return ApiResponse.success(res, null, 'FCM token updated successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
