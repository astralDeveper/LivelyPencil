import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { NavigatorScreenParams, useNavigation } from "@react-navigation/native";
import BottomTabs from "./BottomTabNavigator";
import {
  PageStackNavigator,
  PageStackNavigatorParams,
} from "./PageStackNavigator";
import { NotificationStackNavigator } from "./NotificationStackNavigator";

type HomeStackNavigatorParams = {
  BottomTabs: undefined;
  PageStack: NavigatorScreenParams<PageStackNavigatorParams>;
  NotificationStack: undefined;
};

export type HomeStackNavigatorProps =
  NativeStackNavigationProp<HomeStackNavigatorParams>;

const HomeStack = createNativeStackNavigator<HomeStackNavigatorParams>();

export default function HomeStackNavigator() {
  const { goBack } = useNavigation();

  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false, headerShadowVisible: false }}
    >
      <HomeStack.Screen name="BottomTabs" component={BottomTabs} />
      <HomeStack.Screen name="PageStack" component={PageStackNavigator} />
      <HomeStack.Screen
        name="NotificationStack"
        component={NotificationStackNavigator}
      />
    </HomeStack.Navigator>
  );
}
