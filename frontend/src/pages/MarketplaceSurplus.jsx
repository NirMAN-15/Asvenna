import React, { useState } from 'react';
import { Tag, MapPin, ShoppingBag, MessageSquare, Send, CheckCircle2, Sliders } from 'lucide-react';
import API from '../services/api';

export default function MarketplaceSurplus() {
  const [radiusKm, setRadiusKm] = useState(5.0);
  const [activeChatListing, setActiveChatListing] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { senderName: 'Bandarawela Wholesale Buyer', senderRole: 'BUYER', text: 'Hello, can you deliver 200kg Leeks by tomorrow morning?', timestamp: '10:14 AM' },
    { senderName: 'Sunil Shantha (Farmer)', senderRole: 'FARMER', text: 'Yes, fresh harvest ready at my farm in Bandarawela. Rs 180 per kg is confirmed.', timestamp: '10:20 AM' }
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  const listings = [
    { id: 1, crop: 'Leeks (ලීක්ස්)', farmer: 'Sunil Shantha', phone: '0712345678', quantity: '500 kg', price: 'Rs. 180/kg', distance: '1.8 km away', pickup: 'Main St, Bandarawela', status: 'AVAILABLE' },
    { id: 2, crop: 'Carrot (කැරට්)', farmer: 'Sunil Shantha', phone: '0712345678', quantity: '300 kg', price: 'Rs. 220/kg', distance: '3.2 km away', pickup: 'Agrarian Hub, Bandarawela', status: 'AVAILABLE' },
    { id: 3, crop: 'Cabbage (ගෝවා)', farmer: 'K. G. Dharmasiri', phone: '0778899001', quantity: '800 kg', price: 'Rs. 140/kg', distance: '4.5 km away', pickup: 'Welimada Road', status: 'AVAILABLE' }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const msg = {
      senderName: 'Bandarawela Wholesale Buyer',
      senderRole: 'BUYER',
      text: newMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, msg]);
    setNewMessageText('');

    try {
      if (activeChatListing) {
        await API.post(`/marketplace/orders/${activeChatListing.id}/messages`, { text: msg.text, listingId: activeChatListing.id });
      }
    } catch (err) {
      console.warn('Real-time message posted locally:', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Radius Proximity Slider */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 stich-card p-6 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-transparent">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-wide">🛒 Zero-Waste Surplus Marketplace</h1>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Geo-Fenced Direct Farmer-to-Buyer Produce Procurement (5 km Proximity Radius)
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-emerald-950/80 border border-emerald-500/30 px-4 py-2 rounded-xl">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-emerald-300">Radius: {radiusKm} km</span>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={radiusKm}
            onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
            className="w-24 accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Produce Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => (
          <div key={item.id} className="stich-card p-5 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400 transition-all">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-extrabold text-white text-base">{item.crop}</h3>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full">
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-emerald-400/80 font-medium">Farmer: {item.farmer} ({item.phone})</p>

              <div className="mt-4 space-y-2 text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  <span className="font-extrabold text-base text-white">{item.price}</span>
                  <span className="text-emerald-400/70">({item.quantity})</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300/80">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{item.distance} • {item.pickup}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveChatListing(item)}
              className="mt-6 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition"
            >
              <MessageSquare className="w-4 h-4" />
              Direct Buyer Order & Negotiation
            </button>
          </div>
        ))}
      </div>

      {/* Direct Buyer-Farmer Chat Drawer Modal */}
      {activeChatListing && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="stich-card w-full max-w-lg overflow-hidden border border-emerald-500/40 shadow-2xl">
            <div className="p-4 bg-emerald-950/90 border-b border-emerald-500/30 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-white text-base">Direct Negotiation: {activeChatListing.crop}</h3>
                <p className="text-xs text-emerald-400/80">Farmer: {activeChatListing.farmer} • {activeChatListing.price}</p>
              </div>
              <button
                onClick={() => setActiveChatListing(null)}
                className="text-gray-400 hover:text-white font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            {/* Chat Thread */}
            <div className="p-4 h-64 overflow-y-auto space-y-3 bg-slate-950/60">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-2xl max-w-[85%] text-xs ${
                    msg.senderRole === 'BUYER'
                      ? 'ml-auto bg-emerald-600 text-white rounded-br-none'
                      : 'mr-auto bg-emerald-950/90 text-emerald-100 border border-emerald-500/20 rounded-bl-none'
                  }`}
                >
                  <div className="font-bold text-[10px] opacity-80 mb-0.5">{msg.senderName}</div>
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className="text-[9px] opacity-60 text-right mt-1">{msg.timestamp}</div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-emerald-950/80 border-t border-emerald-500/20 flex gap-2">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type price offer or delivery query..."
                className="flex-1 bg-slate-900 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-500/60 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                className="stich-btn-primary px-4 py-2 flex items-center justify-center text-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
