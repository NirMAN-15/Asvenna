import 'package:geolocator/geolocator.dart';

class LocationService {
  static Future<Position> getCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      // Default to Bandarawela Agrarian Center coordinates if GPS is disabled
      return Position(
        latitude: 6.8258,
        longitude: 80.9982,
        timestamp: DateTime.now(),
        accuracy: 10,
        altitude: 1200,
        altitudeAccuracy: 5,
        heading: 0,
        headingAccuracy: 0,
        speed: 0,
        speedAccuracy: 0,
      );
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Position(
          latitude: 6.8258,
          longitude: 80.9982,
          timestamp: DateTime.now(),
          accuracy: 10,
          altitude: 1200,
          altitudeAccuracy: 5,
          heading: 0,
          headingAccuracy: 0,
          speed: 0,
          speedAccuracy: 0,
        );
      }
    }

    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }
}
