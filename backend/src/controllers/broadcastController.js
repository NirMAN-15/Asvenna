const db = require('../config/database');
const NotificationService = require('../services/notificationService');
const ApiResponse = require('../utils/apiResponse');

class BroadcastController {
  static async createBroadcast(req, res, next) {
    try {
      const { title_en, title_si, title_ta, message_en, message_si, message_ta, target_district = 'Badulla', target_division, target_crop_id, severity = 'HIGH' } = req.body;

      // 1. Find target farmers
      let farmerQuery = `SELECT id, phone, fcm_token FROM users WHERE role = 'FARMER' AND district = $1`;
      const params = [target_district];

      if (target_division) {
        params.push(target_division);
        farmerQuery += ` AND division = $${params.length}`;
      }

      const farmersRes = await db.query(farmerQuery, params);
      const farmerIds = farmersRes.rows.map(f => f.id);

      // 2. Insert warning record
      const insertRes = await db.query(
        `INSERT INTO broadcast_warnings
         (officer_id, title_en, title_si, title_ta, message_en, message_si, message_ta, target_district, target_division, target_crop_id, severity, sent_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [req.user.id, title_en, title_si, title_ta, message_en, message_si, message_ta, target_district, target_division, target_crop_id, severity, farmerIds.length]
      );

      // 3. Dispatch Push Notifications & SMS Fallback
      if (farmerIds.length > 0) {
        await NotificationService.sendAlert({
          userIds: farmerIds,
          title: title_si || title_en,
          body: message_si || message_en,
          data: { warningId: String(insertRes.rows[0].id), severity }
        });
      }

      return ApiResponse.success(res, insertRes.rows[0], `Broadcast warning issued to ${farmerIds.length} farmers`, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getActiveBroadcasts(req, res, next) {
    try {
      const { district = 'Badulla' } = req.query;
      const result = await db.query(
        `SELECT bw.*, u.full_name as officer_name, c.name_en as crop_name
         FROM broadcast_warnings bw
         JOIN users u ON bw.officer_id = u.id
         LEFT JOIN crops c ON bw.target_crop_id = c.id
         WHERE bw.target_district = $1
         ORDER BY bw.created_at DESC LIMIT 50`,
        [district]
      );
      return ApiResponse.success(res, result.rows);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BroadcastController;
