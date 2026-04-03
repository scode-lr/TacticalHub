# TacticalHub

Angular + Ionic monorepo containing the **TacticalHub** and **VoltregaCF** applications.

---

## Prerequisites

### 1. Install Node.js

Download and install Node.js (v18 or later) from https://nodejs.org

Verify the installation:

```bash
node --version
npm --version
```

---

## Getting Started

### 2. Clone the repository

```bash
git clone <repository-url>
cd TacticalHub
```

### 3. Install dependencies

```bash
npm install
```

This installs all Angular, Ionic, PrimeNG, and Capacitor dependencies listed in `package.json`.

---

## Running the apps

### VoltregaCF (port 4201)

```bash
npm run start:voltregacf
```

Opens the dev server at http://localhost:4201

### TacticalHub (port 4200)

```bash
npm start
```

Opens the dev server at http://localhost:4200

---

## Building

```bash
# Build VoltregaCF (development)
npm run build:voltregacf

# Build VoltregaCF (production)
npm run build:voltregacf:prod

# Build TacticalHub
npm run build
```

---

## Mobile (Capacitor)

Capacitor is used to package the apps for iOS and Android.

### Sync

```bash
npm run cap:voltrega:sync      # VoltregaCF — all platforms
npm run cap:tactical:sync      # TacticalHub — all platforms
```

### Open in Xcode / Android Studio

```bash
npm run cap:voltrega:open:ios
npm run cap:voltrega:open:android

npm run cap:tactical:open:ios
npm run cap:tactical:open:android
```

### Full build + sync + open (shortcut)

```bash
npm run ios:voltrega           # build prod → sync iOS → open Xcode
npm run android:voltrega       # build prod → sync Android → open Android Studio

npm run ios:tactical
npm run android:tactical
```

> **Note:** iOS builds require macOS with Xcode installed. Android builds require Android Studio.
