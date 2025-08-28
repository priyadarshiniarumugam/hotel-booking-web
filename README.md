# Azure Bay Resort - Hotel Booking System

A sophisticated hotel booking website with dynamic pricing, Google Sheets integration, and responsive design built with React and TypeScript.

## 🌟 Features

### Core Functionality
- **Dynamic Room Booking**: Interactive date selection with real-time availability checking
- **Smart Pricing Engine**: Dynamic pricing based on room type, occupancy, meal plans, and seasonal rates
- **Room Comparison**: Side-by-side room comparison with detailed amenities and pricing
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Multi-step Booking Flow**: Intuitive search → select → book → confirm workflow

### Pricing System
- **Multiple Room Types**: Standard, Deluxe, and Suite accommodations
- **Occupancy-based Rates**: Single and double occupancy with different pricing
- **Extra Guest Charges**: Separate rates for additional adults and children
- **Meal Plan Options**: With/without breakfast pricing
- **Real-time Calculations**: Live price updates based on selection changes

### User Experience
- **Premium Design**: Luxury hotel aesthetic with sophisticated color palette
- **Smooth Animations**: Micro-interactions and transitions throughout the user journey
- **Professional Typography**: Clear hierarchy and excellent readability
- **Intuitive Navigation**: Clear visual feedback and loading states
- **Mobile-First**: Responsive design optimized for all screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Clone or download the project**
```bash
git clone <repository-url>
cd hotel-booking-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to `http://localhost:5173` to view the application.

## 📊 Data Management (Google Sheets Integration)

### Current Setup
The application currently uses hardcoded sample data for development and demonstration purposes. This data structure is designed to be easily replaced with Google Sheets integration.

### Sample Data Structure

#### Room Types
```javascript
{
  id: 'deluxe',
  name: 'Deluxe Ocean View',
  type: 'deluxe',
  basePrice: 299,
  maxOccupancy: 3,
  amenities: ['Ocean View', 'King Bed', 'Balcony', 'WiFi', 'Mini Bar'],
  description: 'Spacious room with stunning ocean views',
  size: '45 m²'
}
```

#### Pricing Rules
```javascript
{
  roomType: 'deluxe',
  singleRate: 0.8,      // 20% discount for single occupancy
  doubleRate: 1.0,      // Base rate for double occupancy
  extraPersonRate: 75,  // Extra charge per additional adult
  extraChildRate: 35,   // Extra charge per child
  breakfastRate: 35     // Breakfast cost per person per night
}
```

### Google Sheets Integration Plan

#### Sheet 1: Room Inventory
| Column | Description | Example |
|--------|-------------|---------|
| room_id | Unique room identifier | deluxe |
| room_name | Display name | Deluxe Ocean View |
| room_type | Room category | deluxe |
| base_price | Base nightly rate | 299 |
| max_occupancy | Maximum guests | 3 |
| amenities | Comma-separated list | Ocean View,King Bed,Balcony |
| description | Room description | Spacious room with ocean views |
| size | Room size | 45 m² |
| image_url | Room image URL | https://... |

#### Sheet 2: Pricing Rules
| Column | Description | Example |
|--------|-------------|---------|
| room_type | Room category | deluxe |
| single_rate | Single occupancy multiplier | 0.8 |
| double_rate | Double occupancy multiplier | 1.0 |
| extra_person_rate | Extra adult charge | 75 |
| extra_child_rate | Extra child charge | 35 |
| breakfast_rate | Breakfast per person | 35 |

#### Sheet 3: Availability Calendar
| Column | Description | Example |
|--------|-------------|---------|
| date | Date in YYYY-MM-DD format | 2025-01-15 |
| room_type | Room category | deluxe |
| available_rooms | Number of available rooms | 5 |
| seasonal_multiplier | Price adjustment factor | 1.2 |
| blocked | Room blocking status | FALSE |

### Integration Implementation

To connect with Google Sheets, implement these functions:

```javascript
// Google Sheets API integration
async function fetchRoomData() {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Rooms!A2:I?key=${API_KEY}`);
  const data = await response.json();
  return data.values.map(row => ({
    id: row[0],
    name: row[1],
    type: row[2],
    basePrice: parseFloat(row[3]),
    maxOccupancy: parseInt(row[4]),
    amenities: row[5].split(','),
    description: row[6],
    size: row[7],
    image: row[8]
  }));
}

async function fetchPricingRules() {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Pricing!A2:F?key=${API_KEY}`);
  const data = await response.json();
  return data.values.map(row => ({
    roomType: row[0],
    singleRate: parseFloat(row[1]),
    doubleRate: parseFloat(row[2]),
    extraPersonRate: parseFloat(row[3]),
    extraChildRate: parseFloat(row[4]),
    breakfastRate: parseFloat(row[5])
  }));
}

async function checkAvailability(roomType, checkIn, checkOut) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Availability!A2:E?key=${API_KEY}`);
  const data = await response.json();
  // Process availability data for the specified date range
  return availableRooms;
}
```

## 🏗️ Architecture Overview

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── SearchForm/     # Date and guest selection
│   ├── RoomCard/       # Room display and selection
│   ├── BookingForm/    # Guest information form
│   └── PricingSummary/ # Price breakdown display
├── services/           # External service integrations
│   ├── googleSheets.ts # Google Sheets API client
│   ├── pricing.ts      # Dynamic pricing engine
│   └── booking.ts      # Booking management
├── utils/              # Helper functions
│   ├── dateUtils.ts    # Date manipulation utilities
│   ├── validation.ts   # Form validation helpers
│   └── formatting.ts   # Price and text formatting
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

### Data Flow
1. **User Input** → Search form captures dates and guest information
2. **Availability Check** → System queries Google Sheets for room availability
3. **Price Calculation** → Dynamic pricing engine applies rules and calculates totals
4. **Room Selection** → User compares options and selects preferred room
5. **Booking Process** → Guest information collected and booking confirmed
6. **Data Storage** → Booking details saved to Google Sheets

### API Integration Points

#### Google Sheets API Endpoints
- `GET /spreadsheets/{id}/values/Rooms` - Fetch room data
- `GET /spreadsheets/{id}/values/Pricing` - Get pricing rules
- `GET /spreadsheets/{id}/values/Availability` - Check room availability
- `POST /spreadsheets/{id}/values/Bookings:append` - Save booking

#### Pricing Engine Flow
```
Base Room Price
  ↓
Apply Occupancy Rules (single/double)
  ↓
Add Extra Person Charges
  ↓
Add Children Charges
  ↓
Add Meal Plan Options
  ↓
Apply Seasonal Multipliers
  ↓
Calculate Total for Stay Duration
```

## 🛠️ Development

### Available Scripts
```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Code linting
npm run lint
```

### Code Structure
- **Components**: Modular React components with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks and local state
- **Type Safety**: Comprehensive TypeScript definitions
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Customization

#### Adding New Room Types
1. Update room data structure in Google Sheets
2. Add corresponding pricing rules
3. Update TypeScript interfaces if needed

#### Modifying Pricing Logic
1. Edit pricing calculation functions in `src/services/pricing.ts`
2. Update pricing rules in Google Sheets
3. Test calculations with various scenarios

#### Styling Customization
1. Modify Tailwind configuration in `tailwind.config.js`
2. Update color palette and design tokens
3. Customize component styles in respective files

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options

#### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables for Google Sheets API

#### Vercel
1. Connect your repository to Vercel
2. Set build command to `npm run build`
3. Set output directory to `dist`
4. Configure environment variables

#### Traditional Hosting
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure web server to serve the single-page application

### Environment Variables
```bash
VITE_GOOGLE_SHEETS_API_KEY=your_api_key
VITE_GOOGLE_SHEETS_ID=your_sheet_id
```

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile (320px+)**: Single-column layout, touch-optimized interactions
- **Tablet (768px+)**: Two-column layout, improved spacing
- **Desktop (1024px+)**: Multi-column layout, hover effects
- **Large Desktop (1280px+)**: Maximum content width, enhanced typography

## 🎨 Design System

### Color Palette
- **Primary**: Amber (#F59E0B) - Call-to-action buttons and highlights
- **Secondary**: Slate (#475569) - Text and subtle elements
- **Background**: Gradient from slate-50 to slate-100
- **Accent**: Green (#10B981) - Success states and confirmations

### Typography
- **Headings**: Bold weights with clear hierarchy
- **Body Text**: Optimal line spacing (150%) for readability
- **UI Text**: Semibold for labels and actions

### Components
- **Cards**: Rounded corners (12px), subtle shadows
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Consistent padding, focus states, validation feedback
- **Images**: Responsive with object-cover for consistency

## 🔧 Technical Implementation

### Pricing Engine
The dynamic pricing system supports:
- Base room rates with occupancy multipliers
- Additional guest charges (adults and children)
- Meal plan add-ons
- Seasonal rate adjustments
- Multi-night stay calculations

### Booking Flow
1. **Search**: Date selection and guest count input
2. **Availability**: Real-time room availability checking
3. **Selection**: Room comparison with live pricing
4. **Details**: Guest information collection with validation
5. **Confirmation**: Booking summary and confirmation

### Data Validation
- Date range validation (check-out after check-in)
- Occupancy limits per room type
- Required field validation for booking
- Email format validation
- Phone number format checking

## 📚 Additional Documentation

### Google Sheets Setup Guide
1. Create a new Google Sheet with the required structure
2. Enable Google Sheets API in Google Cloud Console
3. Generate an API key with appropriate permissions
4. Configure sharing settings for the spreadsheet
5. Update environment variables in the application

### API Documentation
The application interfaces with Google Sheets API v4:
- Authentication: API key-based
- Rate Limits: 100 requests per 100 seconds per user
- Data Format: Values returned as arrays
- Error Handling: Graceful fallbacks to cached data

### Testing Guidelines
- Test all device sizes and orientations
- Verify pricing calculations with various scenarios
- Test booking flow end-to-end
- Validate form submissions and error states
- Check accessibility features and keyboard navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Review the documentation above
- Check the Google Sheets API documentation
- Test with sample data before implementing live integration

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**