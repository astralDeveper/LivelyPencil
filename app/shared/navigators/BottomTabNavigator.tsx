import { View } from "react-native";
import { Image } from "expo-image";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAppSelector } from "shared/hooks/useRedux";
import { DrawerNavigation } from "./DrawerNavigation";
import { SearchStackNavigator } from "./SearchStackNavigator";
import { StreamStackNavigator } from "./StreamStackNavigator";
import { LibraryStackNavigator } from "./LibraryStackNavigator";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import { HomeFilled, HomeOutline } from "assets/svg/Drawer/Home";
import LibraryIcon from "assets/svg/BottomTab/Library";
import AddStreamIcon from "assets/svg/BottomTab/AddStream";
import { Search, SearchFilled } from "assets/svg/BottomTab/Search";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

export default function BottomTabs() {
  const Tab = createBottomTabNavigator();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#6687C4",
        tabBarInactiveTintColor: "gray",
        headerStatusBarHeight: 0,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DrawerNavigation}
        // options={{
        //   tabBarShowLabel: false,
        //   headerShown: false,
        //   headerShadowVisible: false,
        //   tabBarIcon: ({ focused }) =>
        //     focused ? <HomeFilled /> : <HomeOutline width={24} height={24} />,
        // }}
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (routeName === "PageStack") {
              return { display: "none" };
            }
            return;
          })(route),
          tabBarShowLabel: false,
          headerShown: false,
          headerShadowVisible: false,
          tabBarIcon: ({ focused }) =>
            focused ? <HomeFilled /> : <HomeOutline width={24} height={24} />,
        })}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        // options={{
        //   headerShown: false,

        //   tabBarShowLabel: false,
        //   tabBarIcon: ({ focused }) =>
        //     focused ? <SearchFilled /> : <Search />,
        // }}
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (routeName === "PageStack") {
              return { display: "none" };
            }
            return;
          })(route),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            focused ? <SearchFilled /> : <Search />,
        })}
      />

      <Tab.Screen
        name="Book Manage"
        component={StreamStackNavigator}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: () => <AddStreamIcon />,
        }} // disable header
      />
      <Tab.Screen
        name="Library"
        component={LibraryStackNavigator}
        options={({ route }) => ({
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#6687C4",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <LibraryIcon color={focused ? "#0076FC" : "#909198"} />
          ),
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (routeName === "PageStack") {
              return { display: "none" };
            }
            return;
          })(route),
        })} // disable header
      />

      <Tab.Screen
        name="User Profile"
        component={ProfileStackNavigator}
        options={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <View
              className="border-2 rounded-full"
              style={{ borderColor: color }}
            >
              <Image
                cachePolicy="memory-disk"
                source={{
                  uri: user?.profilePicture?.includes("file")
                    ? user?.profilePicture
                    : // : `${API_URL}/s3/getMedia/${
                      `${process.env.S3}/${
                        user?.profilePicture
                      }?timestamp=${new Date().getTime()}`,
                }}
                className=" h-7 w-7  rounded-full "
                // color={color}
              />
            </View>
          ),
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (routeName === "PageStack") {
              return { display: "none" };
            }
            return { display: "flex" };
          })(route),
        })}
      />
    </Tab.Navigator>
  );
}
