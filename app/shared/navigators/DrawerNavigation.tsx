import {
  DrawerHeaderProps,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import HomeScreen from "screens/Home/Home";
import AboutUs from "screens/AboutUs";
import Logout from "screens/Logout";
import { View, Text, TouchableOpacity } from "react-native";
import ContactUs from "screens/ContactUs";
import CustomDrawerContent from "screens/CustomDrawerContent";
import { useState } from "react";
import TOS from "screens/Auth/TOS";
import { FAQ } from "screens/FAQ";
import { Donate } from "screens/Donate";
import { HomeOutline } from "assets/svg/Drawer/Home";
import DonateIcon from "assets/svg/Drawer/Donate.svg";
import AboutUsIcon from "assets/svg/Drawer/AboutUs.svg";
import ContactUsIcon from "assets/svg/Drawer/ContactUs.svg";
import FAQIcon from "assets/svg/Drawer/FAQ.svg";
import TermsOfUse from "assets/svg/Drawer/TermsOfUse.svg";
import NotificationIcon from "assets/svg/Drawer/Notification";
import LogoutIcon from "assets/svg/Drawer/Logout.svg";
import DrawerIcon from "assets/svg/Drawer/DrawerIcon.svg";
import SettingsIcon from "assets/svg/Stream/Setting";
import EditProfile from "app/components/User/EditProfile";
import { useNavigation } from "@react-navigation/native";
import { HomeStackNavigatorProps } from "./HomeStackNavigator";
import useSafeAreaInset from "shared/hooks/useSafeArea";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomHeaderProps extends DrawerHeaderProps {
  title: string;
}

export function DrawerNavigation() {
  const Drawer = createDrawerNavigator();
  const [redDot, setRedDot] = useState(false);
  const { navigate } = useNavigation<HomeStackNavigatorProps>();
  const { top } = useSafeAreaInset();
  const insets = useSafeAreaInsets();
  // const { notification, setNotification } = store2();

  const CustomHeader = (props: CustomHeaderProps) => {
    // useEffect(() => {
    //   if (notification?.request?.content?.data) {
    //     // Set redDot true otherwise else keep it false
    //     setRedDot(true);
    //   } else {
    //     setRedDot(false);
    //   }
    // }, [notification]);

    return (
      <View
        className="flex-row bg-white justify-between px-2"
        style={{ paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right, paddingBottom: insets.bottom }}
      >
        <View className="flex-row space-x-2 items-center">
          <TouchableOpacity
            onPress={props.navigation.openDrawer}
            style={{
              borderRadius: 12,
              padding: 16,
              backgroundColor: "#F7F8F8",
            }}
          >
            <DrawerIcon />
          </TouchableOpacity>
          <Text
            className="font-Inter-bold text-2xl"
            style={{ color: "#0076FC" }}
          >
            {props.title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigate("NotificationStack");
          }}
          className="relative"
          style={{
            borderRadius: 12,
            padding: 8,
            backgroundColor: "#F7F8F8",
          }}
        >
          {redDot ? (
            <Text className="absolute text-6xl z-20 -top-2/4 left-2 text-red">
              •
            </Text>
          ) : (
            <></>
          )}
          <NotificationIcon width={26} height={26} />
        </TouchableOpacity>
        {/* Optional space for other items */}
      </View>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "slide",
        unmountOnBlur: true,
        swipeEdgeWidth: 100,
      }}
    >
      <Drawer.Group
        screenOptions={{
          drawerContentContainerStyle: {
            borderRadius: 1,
            borderColor: "#000",
          },
          drawerContentStyle: {
            borderRadius: 1,
            borderColor: "#000",
          },
          drawerStyle: {
            borderRadius: 1,
            borderColor: "#000",
          },
        }}
      >
        <Drawer.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: "Home",
            header: (props) => <CustomHeader title="LivelyPencil" {...props} />,
            drawerIcon: ({ color, size }) => <HomeOutline />,
          }}
        />
        <Drawer.Screen
          name="Donate"
          component={Donate}
          options={{
            title: "Donate",
            header: (props) => <CustomHeader title="LivelyPencil" {...props} />,
            drawerIcon: ({ color, size }) => <DonateIcon width={20} />,
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={EditProfile}
          options={{
            title: "Settings",
            header: (props) => <CustomHeader title="LivelyPencil" {...props} />,
            drawerIcon: ({ color, size }) => <SettingsIcon />,
          }}
        />
        {/* <Drawer.Screen
          name="Notifications"
          component={Notification}
          options={{
            title: "Notifications",
            header: (props) => <CustomHeader title="LivelyPencil" {...props} />,
            drawerIcon: ({ color, size }) => <NotificationIcon />,
          }}
        /> */}
      </Drawer.Group>

      <Drawer.Group>
        <Drawer.Screen
          name="AboutUs"
          component={AboutUs}
          options={{
            title: "About Us",
            header: (props) => <CustomHeader title="LivelyPencil" {...props} />,
            drawerIcon: ({ color, size }) => <AboutUsIcon />,
            drawerItemStyle: {
              backgroundColor: "#fff",
            },
          }}
        />

        <Drawer.Screen
          name="Contact Us"
          component={ContactUs}
          options={{
            title: "Feedback",
            header: (props) => <CustomHeader title="LivelyPencil" {...props} />,
            drawerIcon: ({ color, size }) => <ContactUsIcon />,
          }}
        />
        <Drawer.Screen
          name="FAQ"
          component={FAQ}
          options={{
            title: "FAQ",
            header: (props) => <CustomHeader title="LivelyPencil" {...props} />,
            drawerIcon: ({ color, size }) => <FAQIcon />,
          }}
        />

        <Drawer.Screen
          name="Terms & Conditions"
          component={TOS}
          options={{
            title: "Terms & Conditions",
            header: (props) => <CustomHeader title="LivelyPencil" {...props} />,
            drawerIcon: ({ color, size }) => <TermsOfUse />,
          }}
        />
      </Drawer.Group>
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{
          title: "Logout",
          headerShown: false,
          drawerIcon: ({ color, size }) => <LogoutIcon />,
        }}
      />
    </Drawer.Navigator>
  );
}
