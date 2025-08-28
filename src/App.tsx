import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Star, Wifi, Car, Coffee, Utensils, CheckCircle } from 'lucide-react';

// Types
interface Room {
  id: string;
  name: string;
  type: string;
  basePrice: number;
  maxOccupancy: number;
  amenities: string[];
  image: string;
  description: string;
  size: string;
}

interface PricingRule {
  roomType: string;
  singleRate: number;
  doubleRate: number;
  extraPersonRate: number;
  extraChildRate: number;
  breakfastRate: number;
}

interface BookingDetails {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  selectedRoom: string;
  withBreakfast: boolean;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
}

// Sample data (normally from Google Sheets)
const rooms: Room[] = [
  {
    id: 'deluxe',
    name: 'Deluxe Ocean View',
    type: 'deluxe',
    basePrice: 299,
    maxOccupancy: 3,
    amenities: ['Ocean View', 'King Bed', 'Balcony', 'WiFi', 'Mini Bar'],
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Spacious room with stunning ocean views and premium amenities',
    size: '45 m²'
  },
  {
    id: 'suite',
    name: 'Executive Suite',
    type: 'suite',
    basePrice: 499,
    maxOccupancy: 4,
    amenities: ['Ocean View', 'Living Area', 'Jacuzzi', 'WiFi', 'Butler Service'],
    image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Luxury suite with separate living area and premium services',
    size: '75 m²'
  },
  {
    id: 'standard',
    name: 'Garden View Room',
    type: 'standard',
    basePrice: 199,
    maxOccupancy: 2,
    amenities: ['Garden View', 'Queen Bed', 'WiFi', 'Coffee Maker'],
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Comfortable room overlooking our beautiful gardens',
    size: '30 m²'
  }
];

const pricingRules: PricingRule[] = [
  {
    roomType: 'standard',
    singleRate: 1.0,
    doubleRate: 1.0,
    extraPersonRate: 50,
    extraChildRate: 25,
    breakfastRate: 25
  },
  {
    roomType: 'deluxe',
    singleRate: 0.8,
    doubleRate: 1.0,
    extraPersonRate: 75,
    extraChildRate: 35,
    breakfastRate: 35
  },
  {
    roomType: 'suite',
    singleRate: 0.7,
    doubleRate: 1.0,
    extraPersonRate: 100,
    extraChildRate: 50,
    breakfastRate: 45
  }
];

function App() {
  const [currentStep, setCurrentStep] = useState<'search' | 'select' | 'book' | 'confirm'>('search');
  const [booking, setBooking] = useState<BookingDetails>({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    rooms: 1,
    selectedRoom: '',
    withBreakfast: false,
    guestName: '',
    guestEmail: '',
    guestPhone: ''
  });
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate dynamic pricing
  const calculatePrice = (room: Room, adults: number, children: number, withBreakfast: boolean, nights: number) => {
    const rule = pricingRules.find(r => r.roomType === room.type)!;
    let basePrice = room.basePrice;
    
    // Apply occupancy rates
    if (adults === 1) {
      basePrice *= rule.singleRate;
    }
    
    // Add extra person charges
    const extraPersons = Math.max(0, adults - 2);
    const extraPersonCharges = extraPersons * rule.extraPersonRate;
    const childCharges = children * rule.extraChildRate;
    
    // Add breakfast if selected
    const breakfastCharges = withBreakfast ? (adults + children) * rule.breakfastRate : 0;
    
    const totalPerNight = basePrice + extraPersonCharges + childCharges + breakfastCharges;
    return {
      basePrice,
      extraPersonCharges,
      childCharges,
      breakfastCharges,
      totalPerNight,
      totalStay: totalPerNight * nights
    };
  };

  const calculateNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 1;
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    return Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));
  };

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSearchResults(rooms);
      setCurrentStep('select');
      setIsLoading(false);
    }, 1500);
  };

  const handleRoomSelect = (roomId: string) => {
    setBooking({ ...booking, selectedRoom: roomId });
    setCurrentStep('book');
  };

  const handleBookingSubmit = () => {
    setCurrentStep('confirm');
  };

  const selectedRoom = rooms.find(r => r.id === booking.selectedRoom);
  const nights = calculateNights();
  const pricing = selectedRoom ? calculatePrice(selectedRoom, booking.adults, booking.children, booking.withBreakfast, nights) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Azure Bay Resort</h1>
                <p className="text-sm text-slate-600">Luxury by the Ocean</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4" />
              <span>Malibu, California</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {currentStep === 'search' && (
        <div 
          className="relative h-[70vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1600)' }}
        >
          <div className="absolute inset-0 bg-slate-900/40"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Discover Luxury<br />by the Ocean
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-slate-200">
                Experience unparalleled comfort and breathtaking views at Azure Bay Resort
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        {currentStep === 'search' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 -mt-32 relative z-20">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Find Your Perfect Stay</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Check-in Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={booking.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                  <Calendar className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Check-out Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={booking.checkOut}
                    min={booking.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                  <Calendar className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Guests</label>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <select
                      value={booking.adults}
                      onChange={(e) => setBooking({ ...booking, adults: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    >
                      {[1, 2, 3, 4].map(n => (
                        <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <select
                      value={booking.children}
                      onChange={(e) => setBooking({ ...booking, children: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    >
                      {[0, 1, 2, 3].map(n => (
                        <option key={n} value={n}>{n} Child{n > 1 ? 'ren' : n === 1 ? '' : 'ren'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Rooms</label>
                <select
                  value={booking.rooms}
                  onChange={(e) => setBooking({ ...booking, rooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                  {[1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleSearch}
                disabled={!booking.checkIn || !booking.checkOut || isLoading}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
              >
                {isLoading ? 'Searching...' : 'Search Available Rooms'}
              </button>
            </div>
          </div>
        )}

        {/* Room Selection */}
        {currentStep === 'select' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-slate-900">Available Rooms</h3>
                <p className="text-slate-600 mt-2">
                  {booking.checkIn} to {booking.checkOut} • {nights} night{nights > 1 ? 's' : ''} • {booking.adults} adult{booking.adults > 1 ? 's' : ''} {booking.children > 0 ? `+ ${booking.children} child${booking.children > 1 ? 'ren' : ''}` : ''}
                </p>
              </div>
              <button
                onClick={() => setCurrentStep('search')}
                className="text-amber-600 hover:text-amber-700 font-semibold"
              >
                Modify Search
              </button>
            </div>

            <div className="grid gap-8">
              {searchResults.map(room => {
                const roomPricing = calculatePrice(room, booking.adults, booking.children, booking.withBreakfast, nights);
                return (
                  <div key={room.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img 
                          src={room.image} 
                          alt={room.name}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-2">{room.name}</h4>
                            <p className="text-slate-600 mb-3">{room.description}</p>
                            <p className="text-sm text-slate-500 mb-4">Size: {room.size} • Max {room.maxOccupancy} guests</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-slate-900">
                              ${roomPricing.totalPerNight}
                              <span className="text-lg font-normal text-slate-600">/night</span>
                            </div>
                            <div className="text-slate-500">
                              Total: ${roomPricing.totalStay} for {nights} night{nights > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {room.amenities.map(amenity => (
                            <span key={amenity} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                              {amenity}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={booking.withBreakfast}
                                onChange={(e) => setBooking({ ...booking, withBreakfast: e.target.checked })}
                                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                              />
                              <span className="text-sm text-slate-700">
                                Include Breakfast (+${pricingRules.find(r => r.roomType === room.type)?.breakfastRate}/person/night)
                              </span>
                            </label>
                          </div>
                          <button
                            onClick={() => handleRoomSelect(room.id)}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-[1.02] shadow-md"
                          >
                            Select Room
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Booking Form */}
        {currentStep === 'book' && selectedRoom && pricing && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <button
                onClick={() => setCurrentStep('select')}
                className="text-amber-600 hover:text-amber-700 font-semibold mb-4"
              >
                ← Back to Room Selection
              </button>
              <h3 className="text-3xl font-bold text-slate-900">Complete Your Booking</h3>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h4 className="text-xl font-bold text-slate-900 mb-6">Guest Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={booking.guestName}
                        onChange={(e) => setBooking({ ...booking, guestName: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={booking.guestEmail}
                        onChange={(e) => setBooking({ ...booking, guestEmail: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={booking.guestPhone}
                        onChange={(e) => setBooking({ ...booking, guestPhone: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                  <h4 className="text-xl font-bold text-slate-900 mb-6">Booking Summary</h4>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Room:</span>
                      <span className="font-semibold">{selectedRoom.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Check-in:</span>
                      <span>{booking.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Check-out:</span>
                      <span>{booking.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Guests:</span>
                      <span>{booking.adults} adults {booking.children > 0 ? `+ ${booking.children} children` : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Nights:</span>
                      <span>{nights}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 mb-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Room rate ({nights} night{nights > 1 ? 's' : ''})</span>
                        <span>${(pricing.basePrice * nights).toFixed(2)}</span>
                      </div>
                      {pricing.extraPersonCharges > 0 && (
                        <div className="flex justify-between">
                          <span>Extra person charges</span>
                          <span>${(pricing.extraPersonCharges * nights).toFixed(2)}</span>
                        </div>
                      )}
                      {pricing.childCharges > 0 && (
                        <div className="flex justify-between">
                          <span>Children charges</span>
                          <span>${(pricing.childCharges * nights).toFixed(2)}</span>
                        </div>
                      )}
                      {pricing.breakfastCharges > 0 && (
                        <div className="flex justify-between">
                          <span>Breakfast</span>
                          <span>${(pricing.breakfastCharges * nights).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-slate-200 pt-2 mt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>${pricing.totalStay.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBookingSubmit}
                    disabled={!booking.guestName || !booking.guestEmail || !booking.guestPhone}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
                  >
                    Complete Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation */}
        {currentStep === 'confirm' && selectedRoom && pricing && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Booking Confirmed!</h3>
              <p className="text-slate-600 mb-8">
                Thank you {booking.guestName}! Your reservation has been confirmed.
                A confirmation email will be sent to {booking.guestEmail}.
              </p>

              <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
                <h4 className="font-semibold text-slate-900 mb-4">Booking Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Confirmation #:</span>
                    <div className="font-mono">AZB-{Date.now().toString().slice(-6)}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Total Amount:</span>
                    <div className="font-semibold">${pricing.totalStay.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Check-in:</span>
                    <div>{booking.checkIn}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Check-out:</span>
                    <div>{booking.checkOut}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-600">Room:</span>
                    <div className="font-semibold">{selectedRoom.name}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentStep('search');
                  setBooking({
                    checkIn: '',
                    checkOut: '',
                    adults: 2,
                    children: 0,
                    rooms: 1,
                    selectedRoom: '',
                    withBreakfast: false,
                    guestName: '',
                    guestEmail: '',
                    guestPhone: ''
                  });
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Make Another Booking
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Azure Bay Resort</span>
              </div>
              <p className="text-slate-400">
                Experience luxury by the ocean with world-class amenities and breathtaking views.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Amenities</h5>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4" />
                  <span>Free WiFi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Car className="h-4 w-4" />
                  <span>Valet Parking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Coffee className="h-4 w-4" />
                  <span>24/7 Room Service</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Utensils className="h-4 w-4" />
                  <span>Fine Dining</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-slate-400">
                <li>1234 Ocean Drive</li>
                <li>Malibu, CA 90265</li>
                <li>(555) 123-4567</li>
                <li>reservations@azurebay.com</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Policies</h5>
              <ul className="space-y-2 text-slate-400">
                <li>Check-in: 3:00 PM</li>
                <li>Check-out: 11:00 AM</li>
                <li>Cancellation: 24 hours</li>
                <li>Pet Policy: Dog-friendly</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 mt-8 text-center text-slate-400">
            <p>&copy; 2025 Azure Bay Resort. All rights reserved. | Built with dynamic pricing technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;