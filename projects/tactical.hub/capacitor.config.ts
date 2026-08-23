/// <reference types="@capawesome/capacitor-android-edge-to-edge-support" />
/// <reference types="@capacitor/status-bar" />

import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.tactical.hub',
  appName: 'Tactical Hub',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  includePlugins: [
    '@capawesome/capacitor-android-edge-to-edge-support',
    '@capacitor/app',
    '@capacitor/device',
    '@capacitor/file-viewer',
    '@capacitor/filesystem',
    '@capacitor/push-notifications',
    '@capacitor/share',
    '@capacitor/status-bar'
  ],
  plugins: {
    EdgeToEdge: {
      backgroundColor: '#000000'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
