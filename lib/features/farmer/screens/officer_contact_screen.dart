import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/providers/app_state_provider.dart';

class OfficerContactScreen extends StatefulWidget {
  const OfficerContactScreen({super.key});

  @override
  State<OfficerContactScreen> createState() => _OfficerContactScreenState();
}

class _OfficerContactScreenState extends State<OfficerContactScreen> {
  final _messageController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      'isOfficer': true,
      'text': 'Ayubowan Imal. This is Mrs. Uthpala Athukorala from the Bandarawela Agrarian Services Centre. How can I assist your farm today?',
      'time': '10:15 AM',
    },
    {
      'isOfficer': false,
      'text': 'Good morning Officer. I wanted to verify if the fertilizer subsidy voucher is valid for organic compost purchases as well?',
      'time': '10:18 AM',
    },
    {
      'isOfficer': true,
      'text': 'Yes! As per the latest circular, 40% of the voucher value can be claimed directly for certified organic fertilizers at the Bandarawela Agrarian Centre.',
      'time': '10:20 AM',
    },
  ];

  void _sendMessage() {
    if (_messageController.text.trim().isNotEmpty) {
      setState(() {
        _messages.add({
          'isOfficer': false,
          'text': _messageController.text.trim(),
          'time': 'Just now',
        });
      });
      _messageController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppStateProvider>(context);
    final farmer = appState.farmerProfile;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Divisional Officer Link',
              style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              'Mrs. Uthpala Athukorala • ${farmer.agrarianDivision} Division',
              style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Call Officer',
            icon: const Icon(Icons.phone, color: AppColors.primary),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Calling Agrarian Services Centre: 057-2222123...')),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Officer Info Card Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: AppColors.primarySoft,
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const Text('🏛️', style: TextStyle(fontSize: 20)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Department of Agrarian Development',
                        style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryDark),
                      ),
                      Text(
                        'Bandarawela Division Office • Mon-Fri 8:30 AM - 4:15 PM',
                        style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Message Thread
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, i) {
                final msg = _messages[i];
                final isOfficer = msg['isOfficer'] as bool;

                return Align(
                  alignment: isOfficer ? Alignment.centerLeft : Alignment.centerRight,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.78,
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: isOfficer ? Colors.white : AppColors.primary,
                      borderRadius: BorderRadius.circular(16).copyWith(
                        bottomLeft: isOfficer ? const Radius.circular(0) : const Radius.circular(16),
                        bottomRight: !isOfficer ? const Radius.circular(0) : const Radius.circular(16),
                      ),
                      border: isOfficer ? Border.all(color: const Color(0xFFE2ECE2)) : null,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: isOfficer ? CrossAxisAlignment.start : CrossAxisAlignment.end,
                      children: [
                        Text(
                          msg['text'] as String,
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            color: isOfficer ? AppColors.textPrimary : Colors.white,
                            height: 1.3,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          msg['time'] as String,
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            color: isOfficer ? AppColors.textMuted : Colors.white70,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Message Input Field
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 8,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      decoration: InputDecoration(
                        hintText: 'Type your inquiry for the Agrarian Officer...',
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                        filled: true,
                        fillColor: const Color(0xFFF2F5F2),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                      onPressed: _sendMessage,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
