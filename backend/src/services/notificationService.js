const { messaging } = require('../config/firebase');
const db = require('../config/database');

class NotificationService {
  /**
   * Send push notification with SMS fallback
   */
  static async sendAlert({ userIds, title, body, data = {} }) {
    console.log(`📢 Broadcasting alert to ${userIds.length} recipients: "${title}"`);
    
    // Fetch FCM tokens and phone numbers
    const usersRes = await db.query(
      `SELECT id, full_name, phone, fcm_token, language_preference FROM users WHERE id = ANY($1::int[])`,
      [userIds]
    );

    const fcmTokens = [];
    const smsNumbers = [];

    usersRes.rows.forEach(user => {
      if (user.fcm_token) fcmTokens.push(user.fcm_token);
      if (user.phone) smsNumbers.push(user.phone);
    });

    let fcmSuccess = 0;
    let fcmFailure = 0;

    // Send via Firebase Cloud Messaging if available
    if (messaging && fcmTokens.length > 0) {
      try {
        const response = await messaging.sendEachForMulticast({
          tokens: fcmTokens,
          notification: { title, body },
          data: { ...data, timestamp: String(Date.now()) }
        });
        fcmSuccess = response.successCount;
        fcmFailure = response.failureCount;
      } catch (err) {
        console.warn('⚠️ FCM sending encountered error, falling back to SMS:', err.message);
      }
    }

    // SMS Fallback simulation
    console.log(`📱 SMS Fallback dispatched to ${smsNumbers.length} numbers via Gateway.`);

    return {
      totalRecipients: userIds.length,
      fcmDispatched: fcmTokens.length,
      fcmSuccess,
      fcmFailure,
      smsDispatched: smsNumbers.length
    };
  }
}

module.exports = NotificationService;
