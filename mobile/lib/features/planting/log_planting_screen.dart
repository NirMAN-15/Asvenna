import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/services/location_service.dart';

class LogPlantingScreen extends StatefulWidget {
  const LogPlantingScreen({super.key});

  @override
  State<LogPlantingScreen> createState() => _LogPlantingScreenState();
}

class _LogPlantingScreenState extends State<LogPlantingScreen> {
  String _selectedCrop = '1';
  final _acresController = TextEditingController();
  bool _isLoading = false;
  double? _latitude;
  double? _longitude;

  @override
  void initState() {
    super.initState();
    _fetchGPS();
  }

  void _fetchGPS() async {
    final pos = await LocationService.getCurrentLocation();
    setState(() {
      _latitude = pos.latitude;
      _longitude = pos.longitude;
    });
  }

  void _handleSubmit() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1)); // Mock save
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('✅ වගා දත්ත සාර්ථකව සටහන් විය! (Synced with Risk Engine)')),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('නව වගාවක් සටහන් කිරීම')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'වගා කරන බෝගය තෝරන්න (Select Crop)',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _selectedCrop,
              decoration: InputDecoration(border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
              items: const [
                DropdownMenuItem(value: '1', child: Text('ලීක්ස් (Leeks)')),
                DropdownMenuItem(value: '2', child: Text('ගෝවා (Cabbage)')),
                DropdownMenuItem(value: '3', child: Text('කැරට් (Carrot)')),
                DropdownMenuItem(value: '4', child: Text('බීට්රූට් (Beetroot)')),
                DropdownMenuItem(value: '5', child: Text('අර්තාපල් (Potato)')),
                DropdownMenuItem(value: '6', child: Text('නෝකෝල් (Knol Khol)')),
              ],
              onChanged: (val) => setState(() => _selectedCrop = val!),
            ),
            const SizedBox(height: 20),

            const Text(
              'ඉඩම් ප්‍රමාණය - අක්කර (Land Size in Acres)',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _acresController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                hintText: 'e.g. 1.5',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 20),

            // Location Box
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.my_location, color: AppColors.primary),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      _latitude != null
                          ? 'GPS: ${_latitude!.toStringAsFixed(4)}, ${_longitude!.toStringAsFixed(4)} (Bandarawela)'
                          : 'ස්ථානය ලබා ගනිමින් පවතී...',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 30),

            ElevatedButton(
              onPressed: _isLoading ? null : _handleSubmit,
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('දත්ත ඇතුළත් කර අවදානම පරීක්ෂා කරන්න'),
            ),
          ],
        ),
      ),
    );
  }
}
