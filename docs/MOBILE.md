# Building the Mobile App (iOS / Android)

**Gym Tracker** ships in two flavors from the same codebase:

| | **Self-hosted / Cloud** (Default) | **Mobile App** (`VITE_MOBILE=1`) |
|---|---|---|
| Runs | In any browser, against your server / Supabase | Natively on iPhone / Android (Capacitor shell) |
| Accounts | Passkey or Google sign-in | Device-local by default, or Google / Supabase |
| Data | Synced to your database, readable on desktop | Stays on the device (file in private app storage) |
| Reminders | Web Push from server | Native local notifications, no server involved |
| Exercise media | Served from server or CDN | Loaded from fast CDN dataset |

The mobile flavor never requires a backend by default: everything is stored locally on the phone. State is mirrored from `localStorage` into `gymtracker-state.json` in the app's private data directory on every change. Backups go out through the OS share sheet.

---

## Prerequisites

- Node.js 20+
- **Android:** Android Studio (bundles the Android SDK). Java 17 or Java 21 for Gradle.
- **iOS:** A Mac with Xcode 15+ and CocoaPods (`brew install cocoapods`).

---

## Build & Run

```sh
cd frontend
npm install
npm run build:mobile        # VITE_MOBILE build + `cap sync` into android/ and ios/

npx cap open android        # Opens Android Studio → build APK or run on device
npx cap open ios            # Opens Xcode (macOS only)
```

---

## App Icons & Splash Screens

`frontend/resources/icon.svg` is the 1024×1024 source (the Gym Tracker dumbbell glyph on dark background). Generate all platform assets with:

```sh
cd frontend
npx @capacitor/assets generate --iconBackgroundColor '#0c0e12' --splashBackgroundColor '#0c0e12'
```

---

## Distribution

### Android — Sideloading the APK

The ready-to-use APK is `GymTracker.apk`.

To install:
1. Copy `GymTracker.apk` to your phone.
2. Tap the APK file to install.
3. Allow "Install from unknown sources" if prompted.

### Hosting Direct Downloads:
- Put `GymTracker.apk` in your web `public/` directory so users can download it directly from `https://your-domain/GymTracker.apk`.
- Or publish it as a release asset on your GitHub repository.
