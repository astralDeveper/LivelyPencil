import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./Home/Home";
import AboutUs from "./AboutUs";
import Notification from "./Notification";
import Logout from "./Logout";
import { View, Text, Pressable } from "react-native";
import ContactUs from "./ContactUs";
import UserUpdate from "./UserUpdate";
import {
  MaterialCommunityIcons,
  Fontisto,
  Ionicons,
  MaterialIcons,
  Octicons,
  Entypo,
} from "@expo/vector-icons";
import CustomDrawerContent from "./CustomDrawerContent";
// $&
import { useState } from "react";
import { useEffect } from "react";
import { store2 } from "store";
import TOS from "./Auth/TOS";
import { FAQ } from "./FAQ";
import { Donate } from "./Donate";

export function HomeScreenWithDrawer() {
  const Drawer = createDrawerNavigator();
  const [redDot, setRedDot] = useState(false);
  // const { notification, setNotification } = store2();

  const CustomHeader = ({ title }) => {
    // const navigation = useNavigation();

    // useEffect(() => {
    //   if (notification?.request?.content?.data) {
    //     // Set redDot true otherwise else keep it false
    //     setRedDot(true);
    //   } else {
    //     setRedDot(false);
    //   }
    // }, [notification]);

    return (
      <View className="flex-row bg-white justify-between mx-2">
        <View className="flex-row space-x-4">
          <Ionicons
            onPress={() => navigation.openDrawer()}
            name="menu-outline"
            size={32}
            color="gray"
          />
          <Text className="text-Primary font-Inter-bold text-2xl">{title}</Text>
        </View>
        <Pressable
          onPress={() => {
            // setNotification(null); // instead of setRedDot false we should make setNotification null. Good Idea :)
            navigation.navigate("Notification");
          }}
          className="relative"
        >
          {redDot ? (
            <Text className="absolute text-6xl z-20 -top-2/4 left-2 text-red">
              •
            </Text>
          ) : (
            <></>
          )}
          <Ionicons
            // onPress={() => navigation.navigate("Notification")}
            style={{ marginRight: 10 }}
            name="notifications-outline"
            size={24}
            color="black"
          />
        </Pressable>
        {/* Optional space for other items */}
      </View>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          // width: "70%",
        },
        drawerType: "slide",
        unmountOnBlur: true,
        swipeEdgeWidth: 100,

        // overlayColor: "rgba(102, 135, 196, 0.5)",
        // NOTE: Disabling useNativeAnimations
        useNativeAnimations: false,
      }}
    >
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Home", // This will be the drawer item label
          headerTitle: "LivelyPencil",
          headerShown: true,
          headerTitleContainerStyle: { color: "blue" },
          header: () => <CustomHeader title="LivelyPencil" />,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={24} color="gray" />
          ),
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "#6687c4",
            fontSize: 24, // Adjust the font size
            fontWeight: "bold", // Add font weight if needed

            // Change the text color
          },
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={UserUpdate}
        options={{
          title: "Settings",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={24} color="gray" />
          ),
        }}
      />

      <Drawer.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          title: "About Us",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Entypo name="open-book" size={24} color="gray" />
          ),
        }}
      />

      <Drawer.Screen
        name="Contact Us"
        component={ContactUs}
        options={{
          title: "Contact Us",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Fontisto name="email" size={24} color="gray" />
          ),
        }}
      />
      <Drawer.Screen
        name="FAQ"
        component={FAQ}
        options={{
          title: "FAQ",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="comment-question-outline"
              size={24}
              color="gray"
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Donate"
        component={Donate}
        options={{
          title: "Donate",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="hand-coin-outline"
              size={24}
              color="gray"
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notification}
        options={{
          title: "Notifications",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={24} color="gray" />
          ),
        }}
      />
      <Drawer.Screen
        name="Terms & Conditions"
        component={TOS}
        options={{
          title: "Terms & Conditions",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Octicons name="law" size={24} color="gray" />
          ),
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{
          title: "Logout",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="logout" size={24} color="gray" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
