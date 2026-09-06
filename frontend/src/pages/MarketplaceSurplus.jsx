import React, { useState } from 'react';
import API from '../services/api';

export default function MarketplaceSurplus() {
  const [radiusKm, setRadiusKm] = useState(12);
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [maxPrice, setMaxPrice] = useState(800);
  const [selectedListing, setSelectedListing] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(100);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Chat message state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Buyer', text: 'Hello, what is the harvest time for this batch?', time: '10:14 AM' },
    { sender: 'Farmer', text: 'Harvested fresh this morning in Bandarawela. Can deliver within 2 hours.', time: '10:20 AM' },
  ]);
  const [newChatText, setNewChatText] = useState('');

  const listings = [
    {
      id: 1,
      farmName: 'Green Valley Farms',
      crop: 'Carrots (කැරට්)',
      cropKey: 'Carrot',
      distance: 5.2,
      availableKg: 450,
      pricePerKg: 280,
      badge: 'Organic',
      farmer: 'Sunil Shantha',
      phone: '0712345678',
      location: 'Bandarawela North',
      lat: '6.832',
      lng: '80.985',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDrNWGxLvu8_33PNLrKGJDGcgOMEZEWtUiW6RDwUHbmC7oNmvXkmDOuHWyX-RPMG0s0kV4IsnYx6a3uAU6dsRaCG7g5-ip3qbYYV7i3boe17w0K5UafyVCO_wDDNr5QMXcKHPMLj2lRSMmbHqAM4Z0EBnfeQXGN1TQ0V9-apU7jAELL6B2_TcG9D1VDCjMIwCVqQcO2fSpHdq7g0N7k_lZAbqAbWzY9rbKiV7RPtGyY3wDT5_KBwvGRhQ',
    },
    {
      id: 2,
      farmName: "Saman's Field",
      crop: 'Nadu Paddy Bulk (වී)',
      cropKey: 'Paddy',
      distance: 2.8,
      availableKg: 1200,
      pricePerKg: 145,
      badge: 'Bulk',
      farmer: 'Saman Kumara',
      phone: '0778899112',
      location: 'Wewathenna, Bandarawela',
      lat: '6.821',
      lng: '80.992',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1giOCs5BzQftiQnvZ50R-7yLxOQ-kYwzDowg6hMpv39ylc3mjjRYlMjyx8IcB1kOuSRenw3czlf1XdoJ6zeOzvYRPvHEbjkUGU1M2XTc-gkVZ2Ro1IVWJ4oaGM2uCiuObHTTZB2mBickYhOS67KuT7QOEvIKpuEqHb45kTpxpi-g2oun8oSYhzQbyUL3j3htYleQk7kpYx5QxhUXNiDFuimQCd17ziLFMl0gz3cMxZW6Tg7aoVUvydA',
    },
    {
      id: 3,
      farmName: 'Hillside Organic',
      crop: "Bird's Eye Chili (නයි මිරිස්)",
      cropKey: 'Chili',
      distance: 11.5,
      availableKg: 85,
      pricePerKg: 720,
      badge: 'Premium Spice',
      farmer: 'G. W. Bandara',
      phone: '0714455667',
      location: 'Haputale Slopes',
      lat: '6.768',
      lng: '80.950',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAcibpD0NqnNzcy8lEXsyVpbTl9o_UqwEIruK-oB1BfnlaCSzo9S0wHnDkB55ZtMTpTddE2Zp-NT1-poPw0GSHqLzQLMrpOP0cK5miELjUP2REfV-HOizSE-uU2mb4Q8eszl1sPzNkB6GvgulzwSqp9HwYVWTmZDYOjEicoxC_7yk0Oo30F-H4T-8DTvYCF2WlyCk-7o6i6hKX-G45xfhKSnbOie-cgAbrV6ankJwczqnchoxReMmui_w',
    },
    {
      id: 4,
      farmName: 'Central Depot Collective',
      crop: 'Red Onions (රතු ළූණු Grade A)',
      cropKey: 'Onion',
      distance: 14.0,
      availableKg: 300,
      pricePerKg: 310,
      badge: 'Dry Harvest',
      farmer: 'K. G. Dharmasiri',
      phone: '0773344556',
      location: 'Welimada Agro Hub',
      lat: '6.902',
      lng: '80.912',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDGp7GYvyt9NhBZdfezydhIoYDCr8RchvX0Y3wj7PwWh2QI1lL2qz3Zdad-O5wYwQ5q6RxYM5VSzyIsARAyRFM1xDnUfAhaDPwJyIANUTftJEhAsbTyqkfg59xWRUGxgFcnzT3VDNm0iJPdXg8Kn4Ymn5CPnFeDS6KAz03mqjYAFGqpxqteOqbo7FtQ33T0QWfa-GQOI2gAT54QTnop1TwAGUG4-VkaNbhqqKWqdluV1J66B31ncO6_QQ',
    },
    {
      id: 5,
      farmName: 'Bandarawela Leek Growers',
      crop: 'Highland Leeks (ලීක්ස්)',
      cropKey: 'Leeks',
      distance: 3.4,
      availableKg: 650,
      pricePerKg: 180,
      badge: 'Fresh Harvest',
      farmer: 'P. Jayampathi',
      phone: '0771122334',
      location: 'Kinigama Valley',
      lat: '6.839',
      lng: '80.999',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBrIf4ircA4lKc1wj_7PMNERy_Lkok23X-tzJJGce0sRQfLGINwKOoloBFsPCES279vKK8HaCuO_W_UQO7CCRZm0KhB0RS0pDIKb71DAo9uUHUDbUSC36zgKanicXUDl8jg95nHD52U9gucnlF5mKW9Vkn_jp1xY5lxHxb-Hrs6_RVP1fpUveDSsDyb7axWk12o5SEgT97Rvlc_sbdlQsSq1Bs5hlLT-mw1X5myKicltvJjFQXKnsA5vQ',
    },
  ];

  const popularCrops = ['All', 'Paddy', 'Chili', 'Onion', 'Carrot', 'Leeks', 'Potato'];

  // Filter listings based on radius, crop, and max price
  const filteredListings = listings.filter((item) => {
    const withinRadius = item.distance <= radiusKm;
    const matchesCrop = selectedCrop === 'All' || item.cropKey === selectedCrop;
    const withinPrice = item.pricePerKg <= maxPrice;
    return withinRadius && matchesCrop && withinPrice;
  });

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    setChatMessages([
      ...chatMessages,
      { sender: 'Buyer', text: newChatText, time: 'Just now' },
    ]);
    setNewChatText('');
  };

  const handlePlaceOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setSelectedListing(null);
    }, 2000);
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 space-y-6 font-body-md text-on-surface animate-fadeIn">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-headline text-headline-lg font-bold text-primary">
            Local Buyer Marketplace
          </h1>
          <p className="text-on-surface-variant font-body-md">
            Direct geo-fenced produce trade from upcountry farms (5km - 20km radius)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold bg-secondary-container text-on-secondary-fixed px-3 py-1.5 rounded-full self-start sm:self-center">
          <span className="material-symbols-outlined text-sm icon-fill">verified</span>
          <span>Zero-Waste Direct Procurement</span>
        </div>
      </div>

      {/* Filter Bar (From Stitch Design Screen d68a1217a89d4bb39418cb04bbe34232) */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-card p-6 border border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Radius Slider */}
          <div className="md:col-span-3 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
              <span>Proximity Radius</span>
              <span className="text-primary text-sm font-extrabold font-headline">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[11px] text-outline font-semibold">
              <span>5 km</span>
              <span>20 km</span>
            </div>
          </div>

          {/* Popular Crop Chips */}
          <div className="md:col-span-6 space-y-2">
            <label className="font-label-md text-xs font-bold text-on-surface-variant block">
              Popular Crops
            </label>
            <div className="flex flex-wrap gap-2">
              {popularCrops.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-3.5 py-1.5 rounded-full font-label-md text-xs font-semibold transition-all press-effect ${
                    selectedCrop === crop
                      ? 'bg-secondary-container text-on-secondary-fixed border border-secondary font-bold shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant border border-outline-variant hover:bg-secondary-container/50'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="md:col-span-3 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
              <span>Max Price</span>
              <span className="text-secondary text-sm font-extrabold font-headline">
                LKR {maxPrice}/kg
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-secondary"
            />
            <div className="flex justify-between text-[11px] text-outline font-semibold">
              <span>LKR 100</span>
              <span>LKR 1500</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace: Split Map & Cards (From Stitch Design) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map View (Left/Main - Span 7) */}
        <div className="lg:col-span-7 bg-surface-container rounded-2xl overflow-hidden relative border border-outline-variant/30 shadow-card min-h-[480px] lg:min-h-[640px] flex flex-col justify-between">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCaikMYXwwTO-Y5tKDZqT-MOM87AdtCwPLkaN7PD9jJKP05e14M610nKhv3rU4IKglRHELpRNUcBB0qaix_w6cs9C1Fo0t3hWubDUMlxPshVHXyKHjwpZjy6mIwf_DnCn8IYF_tfqtH_VWJ6oaPVNoLWZstdTsc34wQkXVagwL3A8lVsemxmtICa6EQoDk_J3CdA5NhKY5F3zNvURg_2YzkONV8ElHmd_UswcZV3NMwuVnX7-eXgCNlfA')`,
            }}
          />

          {/* Simulated Radius Circle & Pins on Map */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              className="border-2 border-primary border-dashed rounded-full bg-primary/5 transition-all duration-300"
              style={{
                width: `${Math.min(radiusKm * 32, 520)}px`,
                height: `${Math.min(radiusKm * 32, 520)}px`,
              }}
            />
          </div>

          {/* Map Location Pins (Matching Stitch UI) */}
          <div
            onClick={() => setSelectedListing(listings[0])}
            className="absolute top-1/4 left-1/3 group cursor-pointer"
          >
            <div className="bg-primary text-white p-2.5 rounded-full shadow-xl border-2 border-white flex items-center justify-center transform group-hover:scale-125 transition-transform">
              <span className="material-symbols-outlined text-sm">agriculture</span>
            </div>
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white text-on-surface px-2.5 py-1 rounded-lg shadow-md text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-outline-variant">
              Green Valley: Carrots (5.2km)
            </div>
          </div>

          <div
            onClick={() => setSelectedListing(listings[1])}
            className="absolute bottom-1/3 left-1/2 group cursor-pointer"
          >
            <div className="bg-secondary text-white p-2.5 rounded-full shadow-xl border-2 border-white flex items-center justify-center transform group-hover:scale-125 transition-transform">
              <span className="material-symbols-outlined text-sm">local_shipping</span>
            </div>
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white text-on-surface px-2.5 py-1 rounded-lg shadow-md text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-outline-variant">
              Saman's Farm: Paddy (2.8km)
            </div>
          </div>

          <div
            onClick={() => setSelectedListing(listings[4])}
            className="absolute top-1/2 right-1/4 group cursor-pointer"
          >
            <div className="bg-primary-container text-white p-2.5 rounded-full shadow-xl border-2 border-white flex items-center justify-center transform group-hover:scale-125 transition-transform">
              <span className="material-symbols-outlined text-sm">agriculture</span>
            </div>
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white text-on-surface px-2.5 py-1 rounded-lg shadow-md text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-outline-variant">
              Leek Growers: (3.4km)
            </div>
          </div>

          {/* Map Top Bar Status */}
          <div className="relative m-4 p-3 bg-white/90 backdrop-blur-md rounded-xl border border-outline-variant shadow-sm flex justify-between items-center text-xs">
            <span className="font-bold text-primary flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              Bandarawela GPS Center (6.8258° N, 80.9982° E)
            </span>
            <span className="font-semibold text-on-surface-variant">
              {filteredListings.length} Farms in {radiusKm}km Radius
            </span>
          </div>

          {/* Map Controls */}
          <div className="relative m-4 flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setRadiusKm((r) => Math.min(r + 2, 20))}
                className="bg-white p-2 rounded-lg shadow-md hover:bg-surface-container transition text-on-surface"
                title="Zoom Out Radius"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
              <button
                onClick={() => setRadiusKm((r) => Math.max(r - 2, 5))}
                className="bg-white p-2 rounded-lg shadow-md hover:bg-surface-container transition text-on-surface"
                title="Zoom In Radius"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
            </div>

            <button
              onClick={() => {
                setRadiusKm(12);
                setSelectedCrop('All');
              }}
              className="bg-primary text-white px-4 py-2 rounded-full shadow-lg font-label-md text-xs font-bold flex items-center gap-1.5 press-effect hover:bg-primary-container transition"
            >
              <span className="material-symbols-outlined text-sm">my_location</span>
              <span>Recenter Bandarawela</span>
            </button>
          </div>
        </div>

        {/* Card Grid (Right/Scrollable - Span 5) */}
        <div className="lg:col-span-5 max-h-[640px] overflow-y-auto custom-scrollbar pr-1">
          <div className="flex flex-col gap-4">
            {filteredListings.length === 0 ? (
              <div className="bg-surface-container-lowest p-8 rounded-2xl text-center border border-outline-variant/30 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
                <p className="font-bold text-sm">No produce listings found matching criteria.</p>
                <p className="text-xs mt-1">Try expanding the radius slider or resetting the crop filter.</p>
              </div>
            ) : (
              filteredListings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedListing(item)}
                  className="bg-white rounded-2xl shadow-card border-t-4 border-secondary flex gap-4 overflow-hidden hover:shadow-card-hover transition-all cursor-pointer group border border-outline-variant/30 p-1"
                >
                  {/* Left Thumbnail (1/3) */}
                  <div className="w-1/3 relative h-36 rounded-xl overflow-hidden my-auto">
                    <img
                      src={item.image}
                      alt={item.crop}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </div>
                  </div>

                  {/* Right Details (2/3) */}
                  <div className="w-2/3 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline text-headline-sm text-primary font-bold text-base truncate">
                          {item.farmName}
                        </h3>
                        <span className="bg-secondary/15 text-secondary text-[11px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap ml-1">
                          {item.distance} km
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-xs font-semibold mt-0.5">{item.crop}</p>
                      <p className="text-[11px] text-outline">{item.location}</p>
                    </div>

                    <div className="mt-2 flex justify-between items-end pt-2 border-t border-surface-variant">
                      <div>
                        <div className="text-[10px] font-bold text-outline uppercase tracking-wider">Available</div>
                        <div className="font-headline text-base font-extrabold text-on-surface">
                          {item.availableKg} kg
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-outline uppercase tracking-wider">Wholesale</div>
                        <div className="font-headline text-base font-extrabold text-secondary">
                          LKR {item.pricePerKg}/kg
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-3 w-full bg-primary text-white py-2 rounded-lg font-label-md text-xs font-bold hover:bg-primary-container transition group-active:scale-98"
                    >
                      View Details & Order
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Direct Order / Chat Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-outline-variant animate-fadeIn">
            <div className="p-6 bg-primary text-white flex justify-between items-center">
              <div>
                <h3 className="font-headline text-headline-sm font-bold">{selectedListing.farmName}</h3>
                <p className="text-primary-fixed-dim text-xs">
                  {selectedListing.crop} • {selectedListing.distance} km away • {selectedListing.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-white/80 hover:text-white"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {orderSuccess ? (
                <div className="p-6 text-center text-primary space-y-2">
                  <span className="material-symbols-outlined text-5xl text-primary icon-fill">
                    check_circle
                  </span>
                  <h4 className="font-headline text-headline-sm font-bold">Order Placed Successfully!</h4>
                  <p className="text-xs text-on-surface-variant">
                    Farmer {selectedListing.farmer} has been notified. Dispatch arranged within {selectedListing.distance}km.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-surface-container rounded-xl">
                      <span className="text-[10px] text-outline uppercase font-bold">Total Stock</span>
                      <p className="font-bold text-primary text-base">{selectedListing.availableKg} kg</p>
                    </div>
                    <div className="p-3 bg-surface-container rounded-xl">
                      <span className="text-[10px] text-outline uppercase font-bold">Unit Price</span>
                      <p className="font-bold text-secondary text-base">LKR {selectedListing.pricePerKg}/kg</p>
                    </div>
                    <div className="p-3 bg-surface-container rounded-xl">
                      <span className="text-[10px] text-outline uppercase font-bold">Direct Hotline</span>
                      <p className="font-bold text-on-surface text-xs mt-1">{selectedListing.phone}</p>
                    </div>
                  </div>

                  {/* Order Quantity Selector */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <label htmlFor="order_qty">Purchase Quantity (kg)</label>
                      <span className="text-primary">
                        Total: LKR {(orderQuantity * selectedListing.pricePerKg).toLocaleString()}
                      </span>
                    </div>
                    <input
                      id="order_qty"
                      type="number"
                      min="10"
                      max={selectedListing.availableKg}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Number(e.target.value))}
                      className="w-full h-11 px-4 border border-outline-variant rounded-xl text-sm font-bold bg-surface focus:border-primary outline-none"
                    />
                  </div>

                  {/* Direct Chat / Communication snippet */}
                  <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                    <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">chat</span> Direct Farmer Communication
                    </span>
                    <div className="max-h-32 overflow-y-auto p-3 bg-surface-container-low rounded-xl space-y-2 text-xs">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg max-w-[85%] ${
                            msg.sender === 'Buyer'
                              ? 'bg-primary text-white ml-auto'
                              : 'bg-white text-on-surface border border-outline-variant'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className="text-[9px] opacity-75 block text-right mt-0.5">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendChat} className="flex gap-2">
                      <input
                        type="text"
                        value={newChatText}
                        onChange={(e) => setNewChatText(e.target.value)}
                        placeholder="Type message to farmer..."
                        className="flex-1 h-10 px-3 border border-outline-variant rounded-lg text-xs bg-surface outline-none focus:border-primary"
                      />
                      <button
                        type="submit"
                        className="px-4 h-10 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-secondary/90 transition"
                      >
                        Send
                      </button>
                    </form>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedListing(null)}
                      className="flex-1 py-3 rounded-xl border border-outline-variant font-label-md text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className="flex-1 py-3 rounded-xl bg-primary text-white font-label-md text-xs font-bold hover:bg-primary-container shadow-sm press-effect"
                    >
                      Confirm Direct Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
