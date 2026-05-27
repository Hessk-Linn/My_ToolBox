# 🚀 Firebase Quick Start Guide

## Prerequisites Checklist

- [ ] Firebase account created
- [ ] Firebase project created
- [ ] Firebase config copied
- [ ] `.env.local` file created
- [ ] Firebase CLI installed globally

---

## 5-Minute Setup

### 1️⃣ Install Firebase

```bash
npm install firebase
npm install -g firebase-tools
```

### 2️⃣ Create `.env.local`

Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_DATABASE_MODE=firebase
```

### 3️⃣ Initialize Firebase

```bash
firebase login
firebase init
```

Select:
- ✅ Firestore
- ✅ Hosting

Use existing files:
- `firestore.rules`
- `firestore.indexes.json`
- Public directory: `dist`

### 4️⃣ Deploy

```bash
npm run firebase:deploy
```

**Done!** Your app is live at `https://your-project-id.web.app` 🎉

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run firebase:deploy` | Build & deploy everything |
| `npm run firebase:deploy:hosting` | Deploy hosting only |
| `npm run firebase:deploy:rules` | Deploy Firestore rules only |
| `npm run firebase:serve` | Test locally with Firebase |
| `firebase open hosting:site` | Open live site |

---

## Where to Get Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click ⚙️ (Settings) → Project settings
4. Scroll to "Your apps"
5. Click "Web" icon (</>) if no app exists
6. Copy the config object

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project",
  storageBucket: "my-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## Testing Offline Mode

### Desktop (Chrome):
1. Open DevTools (F12)
2. Network tab → Check "Offline"
3. Use app normally
4. Uncheck "Offline" → Watch sync!

### Mobile:
1. Use app online
2. Enable airplane mode
3. Add/edit data
4. Disable airplane mode
5. Watch changes sync automatically

---

## Troubleshooting

### "Firebase not initialized"
→ Check `.env.local` exists and has correct values

### "Permission denied"
→ Deploy Firestore rules: `npm run firebase:deploy:rules`

### "Build failed"
→ Run `npm install` first

### "Offline not working"
→ Clear browser cache and reload

---

## Next Steps After Deployment

1. ✅ Test on mobile device
2. ✅ Test offline functionality
3. ✅ Share URL with team
4. ✅ Monitor usage in Firebase Console
5. ✅ Set up custom domain (optional)

---

## Support

- **Full Guide**: See `DEPLOYMENT.md`
- **Firebase Setup**: See `FIREBASE_SETUP.md`
- **GitHub**: https://github.com/Hessk-Linn/My_ToolBox

---

**Ready to deploy! Just provide your Firebase credentials and run the commands above.** 🚀
