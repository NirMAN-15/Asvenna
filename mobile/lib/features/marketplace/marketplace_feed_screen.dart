import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import 'list_surplus_screen.dart';

class MarketplaceFeedScreen extends StatelessWidget {
  const MarketplaceFeedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final listings = [
      {
        'crop': 'ලීක්ස් (Leeks)',
        'qty': '450 kg',
        'price': 'Rs. 240/kg',
        'distance': '1.8 km දුරින්',
        'farmer': 'චමින්ද සිල්වා',
      },
      {
        'crop': 'ගෝවා (Cabbage)',
        'qty': '800 kg',
        'price': 'Rs. 160/kg',
        'distance': '3.2 km දුරින්',
        'farmer': 'කපිල බණ්ඩාර',
      },
    ];

    return Scaffold(
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text(
                'ආසන්න අතිරික්ත අස්වනු (5 km Radius)',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ListSurplusScreen()),
                  );
                },
                icon: const Icon(Icons.add, size: 16),
                label: const Text('අතිරික්තය විකුණන්න', style: TextStyle(fontSize: 12)),
              )
            ],
          ),
          const SizedBox(height: 12),

          ...listings.map((item) => Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Text(item['crop'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          Text(item['price'] as String, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary, fontSize: 15)),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text('ප්‍රමාණය: ${item['qty']} • ගොවියා: ${item['farmer']}', style: const TextStyle(fontSize: 12, color: Colors.black87)),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Text('📍 ${item['distance']}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                          OutlinedButton(
                            onPressed: () {},
                            child: const Text('මිලදී ගැනීමේ යෝජනාවක් එවන්න'),
                          )
                        ],
                      )
                    ],
                  ),
                ),
              ))
        ],
      ),
    );
  }
}
