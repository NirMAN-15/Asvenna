import 'package:flutter/material.dart';

class ListSurplusScreen extends StatelessWidget {
  const ListSurplusScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('අතිරික්ත අස්වනු පළ කිරීම')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(
              decoration: InputDecoration(
                labelText: 'අතිරික්ත ප්‍රමාණය - කිලෝ (Quantity in kg)',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                labelText: 'බලාපොරොත්තු මිල 1kg සඳහා (Asking Price Rs/kg)',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('✅ අතිරික්ත අස්වැන්න 5km කලාපීය ගැනුම්කරුවන්ට විවෘත විය!')),
                );
                Navigator.pop(context);
              },
              child: const Text('වෙළඳපලට ඇතුළත් කරන්න (Publish to Marketplace)'),
            )
          ],
        ),
      ),
    );
  }
}
