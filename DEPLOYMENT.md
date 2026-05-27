# Deployment Guide

## 🚀 Quick Start: Firebase Deployment

### Step 1: Firebase Project Setup

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Create a new project** (or select existing)
3. **Enable Firestore Database**:
   - Go to "Build" → "Firestore Database"
   - Click "Create database"
   - Start in **production mode** (we'll add rules)
   - Choose a location (closest to your users)

4. **Register your web app**:
   - Go to Project Settings (⚙️ icon)
   - Scroll to "Your apps"
   - Click "Web" icon (</>) to add a web app
   - Give it a nickname: "My ToolBox"
   - **Copy the Firebase config object**

### Step 2: Local Configuration

1. **Create `.env.local` file** in project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Paste your Firebase config** into `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=my-toolbox-xxxxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=my-toolbox-xxxxx
   VITE_FIREBASE_STORAGE_BUCKET=my-toolbox-xxxxx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
   VITE_DATABASE_MODE=firebase
   ```

### Step 3: Install Firebase Dependencies

```bash
npm install firebase
npm install -g firebase-tools
```

### Step 4: Initialize Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# ✓ Firestore: Configure security rules and indexes files
# ✓ Hosting: Configure files for Firebase Hosting

# Firestore Setup:
# - Use existing firestore.rules
# - Use existing firestore.indexes.json

# Hosting Setup:
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds with GitHub: No (optional, can set up later)
# - Overwrite index.html: No
```

### Step 5: Deploy Firestore Rules & Indexes

```bash
firebase deploy --only firestore
```

This will:
- Deploy security rules (validation, access control)
- Create database indexes (for fast queries)

### Step 6: Build Your App

```bash
npm run build
```

This creates optimized production files in `dist/` folder.

### Step 7: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

---

## 🔄 Offline-First Architecture

### How It Works

Firebase Firestore automatically handles offline functionality:

1. **Offline Reads**: 
   - Data is cached locally in IndexedDB
   - App works even without internet
   - Reads from cache when offline

2. **Offline Writes**:
   - Changes are queued locally
   - Automatically synced when online
   - No data loss

3. **Cross-Device Sync**:
   - Changes sync across all devices
   - Real-time updates when online
   - Conflict resolution handled automatically

### Testing Offline Mode

#### Chrome DevTools:
```
1. Open DevTools (F12)
2. Go to "Network" tab
3. Check "Offline" checkbox
4. Test app functionality
5. Uncheck "Offline"
6. Watch data sync automatically
```

#### Real Device:
```
1. Use app normally (online)
2. Enable airplane mode
3. Add/edit/delete data
4. Disable airplane mode
5. Watch changes sync
```

### Offline Persistence Code

Already implemented in `src/lib/firebase.ts`:

```typescript
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open
    console.warn('Persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support
    console.warn('Browser doesn\'t support offline persistence');
  }
});
```

---

## 📱 Multi-Device Sync

### Automatic Sync Features

1. **Real-time Updates**:
   - Changes appear instantly on all devices
   - No manual refresh needed
   - Uses WebSocket connections

2. **Conflict Resolution**:
   - Last write wins (default)
   - Automatic merge of changes
   - No manual intervention needed

3. **Optimistic Updates**:
   - UI updates immediately
   - Syncs in background
   - Rolls back on error

### Sync Behavior

| Scenario | Behavior |
|----------|----------|
| **Online → Offline** | Continue using cached data |
| **Offline → Online** | Auto-sync queued changes |
| **Multiple Devices** | Real-time sync across all |
| **Slow Connection** | Queue changes, sync when stable |
| **Network Error** | Retry automatically |

---

## 🔐 Security Rules

Current rules in `firestore.rules`:

- ✅ **Public read/write** (no authentication required)
- ✅ **Input validation** (voltage ranges, percentages)
- ✅ **Type checking** (numbers, strings)

### To Add Authentication (Optional):

1. Enable Firebase Authentication
2. Update rules to require auth:
   ```javascript
   allow read, write: if request.auth != null;
   ```

---

## 💰 Cost Estimation

### Firebase Free Tier (Spark Plan):

| Service | Free Quota | Your Usage (Est.) |
|---------|------------|-------------------|
| **Firestore Reads** | 50,000/day | ~1,000/day |
| **Firestore Writes** | 20,000/day | ~500/day |
| **Firestore Deletes** | 20,000/day | ~100/day |
| **Firestore Storage** | 1 GB | <10 MB |
| **Hosting Storage** | 10 GB | ~5 MB |
| **Hosting Transfer** | 360 MB/day | ~50 MB/day |

**Verdict**: Your app will stay **FREE** on Spark plan! 🎉

### Tips to Stay Free:

1. ✅ Use React Query caching (already implemented)
2. ✅ Limit query results (already using `.limit()`)
3. ✅ Use offline persistence (already enabled)
4. ✅ Optimize images and assets

---

## 🔄 Continuous Deployment

### Option 1: Manual Deployment

```bash
npm run build
firebase deploy
```

### Option 2: GitHub Actions (Automated)

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: your-project-id
```

**Setup**:
1. Add Firebase secrets to GitHub repository settings
2. Generate Firebase service account key
3. Push to `main` branch → auto-deploy! 🚀

---

## 🧪 Testing Before Deployment

### Local Testing with Firebase

```bash
# Build the app
npm run build

# Serve locally with Firebase
firebase serve

# Open: http://localhost:5000
```

### Preview Deployment

```bash
# Deploy to preview channel
firebase hosting:channel:deploy preview

# Get preview URL
# Share with team for testing
```

---

## 📊 Monitoring & Analytics

### Enable Firebase Analytics

1. Go to Firebase Console → Analytics
2. Enable Google Analytics
3. Data will appear in 24 hours

### Monitor Performance

```bash
# View hosting metrics
firebase hosting:stats

# View Firestore usage
# Go to Firebase Console → Firestore → Usage tab
```

---

## 🆘 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deployment Errors

```bash
# Check Firebase login
firebase login --reauth

# Check project
firebase projects:list
firebase use your-project-id

# Redeploy
firebase deploy --debug
```

### Offline Not Working

1. Check browser support (Chrome, Firefox, Safari)
2. Check console for errors
3. Clear browser cache
4. Verify `enableIndexedDbPersistence` is called

---

## 🎯 Next Steps

1. ✅ Push code to GitHub (DONE)
2. ⏳ Get Firebase credentials (PENDING - you'll provide)
3. ⏳ Update `.env.local` with credentials
4. ⏳ Deploy to Firebase Hosting
5. ⏳ Test offline functionality
6. ⏳ Share live URL!

---

## 📞 Support

- **Firebase Docs**: https://firebase.google.com/docs
- **Firestore Guide**: https://firebase.google.com/docs/firestore
- **Hosting Guide**: https://firebase.google.com/docs/hosting
- **GitHub Repo**: https://github.com/Hessk-Linn/My_ToolBox

---

**Ready to deploy when you provide Firebase credentials! 🚀**
