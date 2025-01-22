import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import LottieView from "lottie-react-native";
import Offline from "assets/svg/Offline.json";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";
import { AuthStackNavigator } from "./shared/navigators/AuthStackNavigator";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import OnboardingScreen from "screens/OnboardingScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "shared/util/toastConfig";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import HomeSocket from "screens/HomeSocket";
import {
  useGetMyLikesListQuery,
  // useUpdateMyProfileQuery,
} from "shared/apis/auth/authApi";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { OnBoardingStackNavigator } from "shared/navigators/OnBoardingStackNavigator";
import { registerForPushNotificationsAsync } from "shared/util/notification";
import { HomeStackNavigatorProps } from "shared/navigators/HomeStackNavigator";
import { NotificationStackNavigator } from "shared/navigators/NotificationStackNavigator";

SplashScreen.preventAutoHideAsync().catch((e) => {
  console.warn("SplashScreen.preventAutoHideAsync() error:", e);
});

function AuthApp() {
  const auth = useAppSelector((state) => state.auth);
  const { isLoggedIn, showOnBoarding } = auth;
  const { navigate } = useNavigation<HomeStackNavigatorProps>();

  // Move all hooks to the top level, ensuring consistent order
  const myLikesQuery = useGetMyLikesListQuery(auth.user?._id, {
    // Only call this query if the user is logged in and other conditions are met
    skip:
      !isLoggedIn ||
      !auth.user?._id ||
      !auth.user.isEmailVerified ||
      auth.user.listofCategoryIds.length === 0,
  });

  // Listening for notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: isLoggedIn,
      shouldPlaySound: isLoggedIn,
      shouldSetBadge: true,
    }),
  });
  if (showOnBoarding) {
    return <OnboardingScreen />;
  }

  // Conditional rendering without altering hook call order
  if (!isLoggedIn || !auth.user?._id || !auth.user.isEmailVerified) {
    return <AuthStackNavigator />;
  }

  if (isLoggedIn && auth.user.listofCategoryIds.length === 0) {
    return <OnBoardingStackNavigator />;
  }

  // Set up a listener for incoming notifications
  Notifications.addNotificationReceivedListener((notification) => {
    console.log("Notification received: ", notification);
  });

  // Set up a listener for when a notification is clicked/tapped
  Notifications.addNotificationResponseReceivedListener((response) => {
    isLoggedIn && navigate("NotificationStack");
  });

  // If the user is logged in and has completed the onboarding process
  return <HomeSocket />;
}

export default function Initialize() {
  // const [isAuthenticated, setisAuthenticated] = useState(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  // const [isDataLoaded, setIsDataLoaded] = useState(false);
  // const { setCurrentUser, setExpoPushToken } = store();
  // const [showOnboarding, setShowOnboarding] = useState(false);

  const [fontsLoaded] = useFonts({
    "Inter-Black": require("assets/fonts/Inter-Black.ttf"),
    "Inter-Medium": require("assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("assets/fonts/Inter-ExtraBold.ttf"),
  });

  useEffect(() => {
    enableScreens(false);
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // // Set up a listener for incoming notifications
    // Notifications.addNotificationReceivedListener((notification) => {
    //   console.log("Notification received: ", notification);
    // });

    // // Set up a listener for when a notification is clicked/tapped
    // Notifications.addNotificationResponseReceivedListener((response) => {
    //   console.log("Notification tapped: ", response);
    // });
    const setupNotifications = async () => {
      await registerForPushNotificationsAsync();
      // Notification Listener
    };

    setupNotifications();
    return () => {
      unsubscribe();
    };
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  //Note: Connectivity Check
  if (!isConnected) {
    return (
      <View className="flex-1  items-center justify-center">
        <View className=" w-20 h-20 items-center">
          <LottieView resizeMode="cover" source={Offline} autoPlay loop />
        </View>

        <View className="items-center">
          <Text className="font-Inter-Black">
            No Internet Connection available
          </Text>
          <Text className="font-Inter-Black">
            Make sure internet connection is available.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
      onLayout={onLayoutRootView}
    >
      <BottomSheetModalProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider>
              <NavigationContainer>
                <AuthApp />
                <Toast
                  position="bottom"
                  bottomOffset={20}
                  config={toastConfig}
                />
              </NavigationContainer>
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
