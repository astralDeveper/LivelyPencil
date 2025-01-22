import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { setNotificationToken } from "store/slices/auth/authSlice";
import { store } from "store/index";
import { Alert, Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  let token; // Declare token locally to avoid side effects
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }

    // Get the token (it may or may not have `.data`)
    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.expoConfig?.extra?.eas.projectId,
    });
    console.log("Expo push token object: ", expoPushToken); // Log to check structure

    // Ensure token format is correct
    token = expoPushToken?.data || expoPushToken; // Handle both cases
    console.log("Token", token); // Use token directly, no need for `token.data`

    store.dispatch(setNotificationToken(token.toString()));
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token; // Return the token correctly
}
