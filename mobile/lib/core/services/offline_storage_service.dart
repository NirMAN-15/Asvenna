import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class OfflineStorageService {
  static const String _offlinePlantingsKey = 'offline_plantings_queue';

  static Future<void> savePlantingOffline(Map<String, dynamic> plantingData) async {
    final prefs = await SharedPreferences.getInstance();
    List<String> list = prefs.getStringList(_offlinePlantingsKey) ?? [];
    list.add(jsonEncode(plantingData));
    await prefs.setStringList(_offlinePlantingsKey, list);
  }

  static Future<List<Map<String, dynamic>>> getOfflinePlantings() async {
    final prefs = await SharedPreferences.getInstance();
    List<String> list = prefs.getStringList(_offlinePlantingsKey) ?? [];
    return list.map((item) => jsonDecode(item) as Map<String, dynamic>).toList();
  }

  static Future<void> clearOfflinePlantings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_offlinePlantingsKey);
  }
}
