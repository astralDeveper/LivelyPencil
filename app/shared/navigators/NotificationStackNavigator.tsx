import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { NavigatorScreenParams, useNavigation } from "@react-navigation/native";
import {
  PageStackNavigator,
  PageStackNavigatorParams,
} from "./PageStackNavigator";
import Notification from "screens/Notification";
import HeaderBackButton from "app/components/ui/HeaderBackButton";

type NotificationStackNavigatorParams = {
  Notification: undefined;
  PageStack: NavigatorScreenParams<PageStackNavigatorParams>;
};

export type NotificationStackNavigatorProps =
  NativeStackNavigationProp<NotificationStackNavigatorParams>;

const NotificationStack =
  createNativeStackNavigator<NotificationStackNavigatorParams>();

export const NotificationStackNavigator = (): JSX.Element => {
  const { goBack } = useNavigation();
  return (
    <NotificationStack.Navigator screenOptions={{ headerShown: false }}>
      <NotificationStack.Screen
        name="Notification"
        component={Notification}
        options={{
          headerTitle: "Notification",
          title: "Notification",
          headerTitleAlign: "left",
          headerShown: true,
          headerShadowVisible: false,
          headerBackVisible: true,
        }}
      />
      <NotificationStack.Screen
        name="PageStack"
        component={PageStackNavigator}
      />
    </NotificationStack.Navigator>
  );
};
