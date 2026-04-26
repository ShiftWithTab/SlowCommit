import 'dotenv/config';

export default {
  expo: {
    name: "Focus Pixel",
    slug: "focus-pixel",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    assetBundlePatterns: ["**/*"],

    plugins: [
      "expo-asset",
      "expo-font"
    ],

    extra: {
      eas: {
        projectId: process.env.EXPO_PROJECT_ID,
      },
    },
  },
};