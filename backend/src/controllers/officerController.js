const bcrypt = require('bcryptjs');
const db = require('../config/database');
const ApiResponse = require('../utils/apiResponse');

class OfficerController {
  static async getFarmerDirectory(req, res, next) {
    try {
      const { division, search } = req.query;
      let query = `
        SELECT u.id, u.full_name, u.phone, u.nic, u.district, u.division, u.gnd_division, u.is_active, u.created_at,
               COUNT(pr.id) as total_planting_entries
        FROM users u
        LEFT JOIN planting_records pr ON u.id = pr.farmer_id
        WHERE u.role = 'FARMER'
      `;
      const params = [];
      if (division) {
        params.push(division);
        query += ` AND u.division = $${params.length}`;
      }
      if (search) {
        params.push(`%${search}%`);
        query += ` AND (u.full_name ILIKE $${params.length} OR u.phone ILIKE $${params.length} OR u.nic ILIKE $${params.length})`;
      }

      query += ' GROUP BY u.id ORDER BY u.created_at DESC';
      const result = await db.query(query, params);
      return ApiResponse.success(res, result.rows);
    } catch (err) {
      next(err);
    }
  }

  static async registerFarmerProxy(req, res, next) {
    try {
      const { full_name, phone, nic, district = 'Badulla', division = 'Bandarawela', gnd_division, address } = req.body;
      const salt = await bcrypt.genSalt(10);
      const defaultPassword = await bcrypt.hash('asvanna123', salt);

      const result = await db.query(
        `INSERT INTO users (full_name, phone, nic, password_hash, role, district, division, gnd_division, address, is_verified)
         VALUES ($1, $2, $3, $4, 'FARMER', $5, $6, $7, $8, true)
         RETURNING id, full_name, phone, nic, district, division, gnd_division, is_verified, created_at`,
        [full_name, phone, nic, defaultPassword, district, division, gnd_division, address]
      );

      return ApiResponse.success(res, result.rows[0], 'Farmer registered via proxy by DO Officer', 201);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OfficerController;
