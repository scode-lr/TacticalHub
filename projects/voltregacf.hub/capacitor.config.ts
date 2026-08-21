/// <reference types="@capawesome/capacitor-android-edge-to-edge-support" />
/// <reference types="@capacitor/splash-screen" />
/// <reference types="@capacitor/status-bar" />

import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'es.tacticalhub.voltrega',
  appName: 'Voltregà CF',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  includePlugins: [
    '@capawesome/capacitor-android-edge-to-edge-support',
    '@capacitor/app',
    '@capacitor/device',
    '@capacitor/filesystem',
    '@capacitor/push-notifications',
    '@capacitor/share',
    '@capacitor/splash-screen',
    '@capacitor/status-bar'
  ],
  plugins: {
    EdgeToEdge: {
      backgroundColor: '#000000'
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 200,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      useDialog: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
