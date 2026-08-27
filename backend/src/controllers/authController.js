const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const config = require('../config/config');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  static async register(req, res, next) {
    try {
      const { 
        full_name, phone, nic, password, role, 
        employee_id, district, division, gnd_division, land_size_acres, 
        business_name, business_type 
      } = req.body;

      if (!['OFFICER', 'FARMER', 'BUYER'].includes(role)) {
        return ApiResponse.error(res, 'Invalid role.', 400);
      }

      // Check existing user
      let existingUser;
      try {
        const existing = await db.query('SELECT id FROM users WHERE phone = $1', [phone]);
        existingUser = existing.rows.length > 0;
      } catch(e) {
        existingUser = db.fileDb.users.some(u => u.phone === phone);
      }
      
      if (existingUser) {
        return ApiResponse.error(res, 'User with this phone number already exists.', 400);
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const is_verified = role === 'FARMER' || role === 'BUYER';
      
      const newUserObj = {
        full_name, phone, nic, password_hash, role, is_verified,
        district: district || null,
        division: division || null,
        employee_id: role === 'OFFICER' ? employee_id : null,
        gnd_division: role === 'FARMER' ? gnd_division : null,
        land_size_acres: role === 'FARMER' ? land_size_acres : null,
        business_name: role === 'BUYER' ? business_name : null,
        business_type: role === 'BUYER' ? business_type : null,
        created_at: new Date().toISOString()
      };

      let user;
      try {
        // Try PostgreSQL insert first
        const result = await db.query(
          `INSERT INTO users (full_name, phone, nic, password_hash, role, employee_id, district, division, gnd_division, land_size_acres, business_name, business_type, is_verified)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           RETURNING id, full_name, phone, nic, role, employee_id, district, division, gnd_division, land_size_acres, business_name, business_type, is_verified, created_at`,
          [full_name, phone, nic, password_hash, role, newUserObj.employee_id, newUserObj.district, newUserObj.division, newUserObj.gnd_division, newUserObj.land_size_acres, newUserObj.business_name, newUserObj.business_type, is_verified]
        );
        user = result.rows[0];
        
        // If db.query falls back to fileDb under the hood but returns mock data that doesn't match our schema, 
        // we might want to ensure we overwrite it in fileDb properly.
        if (result.rows && result.rows[0] && !result.rows[0].id) {
           throw new Error("Fallback needed");
        }
      } catch (err) {
        // Fallback to fileDb explicitly
        newUserObj.id = Date.now();
        db.fileDb.users.unshift(newUserObj);
        db.saveDb(db.fileDb);
        user = { ...newUserObj };
      }

      const expiresIn = role === 'OFFICER' ? config.jwt.officerExpiresIn : config.jwt.farmerExpiresIn;
      const token = jwt.sign({ id: user.id, role: user.role, phone: user.phone, district: user.district }, config.jwt.secret, { expiresIn });

      delete user.password_hash;
      return ApiResponse.success(res, { user, token }, 'User registered successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { phone, password, role } = req.body;

      let result;
      try {
        result = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
      } catch(e) {
        result = { rows: db.fileDb.users.filter(u => u.phone === phone) };
      }
      
      if (!result || result.rows.length === 0) {
        return ApiResponse.error(res, 'Invalid phone number or password.', 401);
      }

      const user = result.rows[0];
      
      if (role && user.role !== role) {
        return ApiResponse.error(res, 'Invalid role for this user.', 403);
      }

      if (user.is_active === false) {
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
