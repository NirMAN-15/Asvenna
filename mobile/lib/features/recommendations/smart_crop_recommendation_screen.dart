import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class SmartCropRecommendationScreen extends StatelessWidget {
  const SmartCropRecommendationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final recommendations = [
      {
        'name': 'බීට්රූට් (Beetroot)',
        'score': '92%',
        'gap': '32,000 kg වෙළඳපල හිඩැසක්',
        'rationale': 'ඉහළ ඉල්ලුම සහ බණ්ඩාරවෙල පාංශු තත්ත්වයට උපරිම ගැලපීම.',
        'color': Colors.green,
      },
      {
        'name': 'නෝකෝල් (Knol Khol)',
        'score': '88%',
        'gap': '18,000 kg හිඩැසක්',
        'rationale': 'දින 60 කෙටි අස්වනු කාලය සහ අඩු අවදානම.',
        'color': Colors.green,
      },
      {
        'name': 'කැරට් (Carrot)',
        'score': '84%',
        'gap': '28,000 kg හිඩැසක්',
        'rationale': 'ස්ථාවර මිල ප්‍රවණතාවයක් සහ හොඳ ඉල්ලුමක් පවතී.',
        'color': Colors.teal,
      },
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'බුද්ධිමත් බෝග නිර්දේශ (Smart Crop Recommendations)',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 6),
        const Text(
          'CROPIX වෙළඳපල හිඩැස්, පස සහ කාලගුණය අනුව ගණනය කළ හොඳම විකල්ප බෝග:',
          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
        ),
        const SizedBox(height: 16),

        ...recommendations.map((item) => Card(
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Text(item['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(20)),
                          child: Text('සුදුසුකම: ${item['score']}', style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12)),
                        )
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(item['gap'] as String, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600, fontSize: 13)),
                    const SizedBox(height: 4),
                    Text(item['rationale'] as String, style: const TextStyle(color: Colors.black87, fontSize: 12)),
                  ],
                ),
              ),
            ))
      ],
    );
  }
}
