# Firebase Setup Guide

This guide will help you migrate from PostgreSQL to Firebase Firestore with offline-first capabilities.

## Prerequisites

1. Firebase account (https://firebase.google.com)
2. Firebase project created
3. Firebase CLI installed: `npm install -g firebase-tools`

## Step 1: Install Firebase Dependencies

```bash
npm install firebase
```

## Step 2: Firebase Configuration

Create a `.env.local` file (already gitignored) with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 3: Firestore Database Structure

### Collections:

#### `battery_readings_24v`
```typescript
{
  id: string;           // Auto-generated
  voltage: number;      // 18-32V
  pct: number;         // 0-100
  alert: string;       // "critical" | "warning" | "low" | "good" | "full"
  ts: string;          // Timestamp string
  createdAt: Timestamp; // Firestore server timestamp
}
```

#### `home_solar_readings_48v`
```typescript
{
  id: string;
  voltage: number;      // 40-58V
  pct: number;
  alert: string;
  ts: string;
  createdAt: Timestamp;
}
```

#### `fuel_trips`
```typescript
{
  id: string;
  name: string;
  distance: number;
  unit: "km" | "mile";
  efficiency: number;
  pricePerLiter: number;
  cost: number;
  liters: number;
  tripTimestamp: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `fuel_prices`
```typescript
{
  id: string;
  priceMmk: number;
  note: string | null;
  recordedAt: Timestamp;
}
```

## Step 4: Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to all authenticated users
    // For public access (no auth), use: if true
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Or more specific rules:
    match /battery_readings_24v/{readingId} {
      allow read: if true;
      allow create: if request.resource.data.voltage >= 18 
                   && request.resource.data.voltage <= 32
                   && request.resource.data.pct >= 0
                   && request.resource.data.pct <= 100;
      allow delete: if true;
    }
    
    match /home_solar_readings_48v/{readingId} {
      allow read: if true;
      allow create: if request.resource.data.voltage >= 40 
                   && request.resource.data.voltage <= 58
                   && request.resource.data.pct >= 0
                   && request.resource.data.pct <= 100;
      allow delete: if true;
    }
    
    match /fuel_trips/{tripId} {
      allow read, create, update, delete: if true;
    }
    
    match /fuel_prices/{priceId} {
      allow read, create, delete: if true;
    }
  }
}
```

## Step 5: Firestore Indexes

Create these composite indexes in Firebase Console:

### `battery_readings_24v`
- Collection: `battery_readings_24v`
- Fields: `createdAt` (Descending)

### `home_solar_readings_48v`
- Collection: `home_solar_readings_48v`
- Fields: `createdAt` (Descending)

### `fuel_trips`
- Collection: `fuel_trips`
- Fields: `tripTimestamp` (Descending)

### `fuel_prices`
- Collection: `fuel_prices`
- Fields: `recordedAt` (Descending)

## Step 6: Firebase Hosting Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Hosting
# - Firestore (if not already set up)

# Build your app
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

### `firebase.json` Configuration

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

## Offline Support Features

### Automatic Offline Persistence
Firebase Firestore automatically caches data locally and syncs when online.

### Key Features:
1. **Offline Reads**: Cached data available offline
2. **Offline Writes**: Queued and synced when online
3. **Real-time Sync**: Automatic sync across devices
4. **Conflict Resolution**: Automatic merge of offline changes

### Implementation:
```typescript
// Enable offline persistence (already in firebase.ts)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser doesn\'t support persistence');
  }
});
```

## Migration from PostgreSQL

### Option 1: Manual Migration
1. Export data from PostgreSQL
2. Import to Firestore using Firebase Admin SDK

### Option 2: Keep Both (Hybrid)
1. Keep PostgreSQL for development
2. Use Firestore for production
3. Use environment variables to switch

## Testing Offline Functionality

1. **Chrome DevTools**:
   - Open DevTools → Network tab
   - Check "Offline" checkbox
   - Test app functionality

2. **Real Device**:
   - Enable airplane mode
   - Use the app
   - Disable airplane mode
   - Verify sync

## Monitoring & Analytics

Enable Firebase Analytics in your project:
```typescript
import { getAnalytics } from 'firebase/analytics';
const analytics = getAnalytics(app);
```

## Cost Optimization

### Free Tier Limits:
- **Firestore**: 50K reads, 20K writes, 20K deletes per day
- **Hosting**: 10GB storage, 360MB/day transfer
- **Storage**: 5GB

### Tips:
1. Use `.limit()` on queries
2. Cache data with React Query
3. Use Firestore offline persistence
4. Implement pagination

## Next Steps

1. Get Firebase config from Firebase Console
2. Update `.env.local` with your credentials
3. Run the migration script (when provided)
4. Test offline functionality
5. Deploy to Firebase Hosting

## Support

For issues or questions:
- Firebase Docs: https://firebase.google.com/docs
- Firestore Docs: https://firebase.google.com/docs/firestore
- Firebase Hosting: https://firebase.google.com/docs/hosting
