# Solar Battery Monitor & Fuel Tracker

A clean, minimal solar battery monitoring and fuel tracking app with 3 core functions:
- **24V Solar Battery Monitor** - 8S LiFePO4 voltage tracking
- **48V Home Solar System** - 16S LiFePO4 voltage tracking  
- **Fuel Cost Tracker** - Trip logging and fuel price history

## Stack

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + Wouter + React Query
- **Backend**: Express API server on port 8080
- **Database**: PostgreSQL via Drizzle ORM
- **Features**: Fully responsive design, error boundaries, input validation, auto-sync

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   - Create a PostgreSQL database named `solar_battery`
   - Copy `.env.example` to `.env` and update `DATABASE_URL`
   - Push schema to database:
     ```bash
     npx drizzle-kit push
     ```

3. **Run development servers:**
   ```bash
   npm run dev
   ```
   This starts both the API server (port 8080) and Vite dev server (port 5173)

5. **Open app:**
   Navigate to `http://localhost:5173`

## Project Structure

```
My_System/
├── src/
│   ├── components/      # TabLayout, ErrorBoundary
│   ├── db/             # Database schema & connection
│   ├── lib/            # API client, constants
│   ├── pages/          # BatteryStatus, HomeSolar, FuelCalculator
│   ├── server/         # Express API server
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Features

### 24V Solar Monitor
- Auto-calculates charge % from voltage
- 8S LiFePO4 voltage curve (20.0V – 29.2V)
- Real-time alerts (critical, warning, low, good, full)
- Reading history with timestamps
- Fully responsive design

### 48V Home Solar System
- Growatt 6kW | 8× Trina 575W | 300Ah CATL 16S
- 16S LiFePO4 voltage curve (44V – 54.4V)
- Estimates kWh remaining
- System specs display
- Mobile-optimized layout

### Fuel Cost Tracker
- Trip calculator with km/miles toggle
- Fuel price memory with history
- Cost calculation in MMK
- Trip history with edit/delete
- Auto-synced data

## Database Tables

- `battery_readings_24v` - 24V battery voltage readings
- `home_solar_readings_48v` - 48V system voltage readings
- `fuel_trips` - Fuel trip records
- `fuel_prices` - Fuel price history

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/battery/readings` - Get 24V readings
- `POST /api/battery/readings` - Add 24V reading
- `DELETE /api/battery/readings/:id` - Delete 24V reading
- `GET /api/home-solar/readings` - Get 48V readings
- `POST /api/home-solar/readings` - Add 48V reading
- `DELETE /api/home-solar/readings/:id` - Delete 48V reading
- `GET /api/fuel/trips` - Get fuel trips
- `POST /api/fuel/trips` - Add fuel trip
- `PUT /api/fuel/trips/:id` - Update fuel trip
- `DELETE /api/fuel/trips/:id` - Delete fuel trip
- `GET /api/fuel/prices` - Get fuel prices
- `POST /api/fuel/prices` - Add fuel price
- `DELETE /api/fuel/prices/:id` - Delete fuel price

## Build for Production

```bash
npm run build
npm run preview
```

## Notes

- All data auto-synced in real-time
- React Query polls every 30s for updates with smart caching
- Dark theme for battery pages, light theme for fuel page
- Fully responsive design for all screen sizes (mobile, tablet, desktop)
- Error boundaries for graceful error handling
- Backend input validation for data integrity
