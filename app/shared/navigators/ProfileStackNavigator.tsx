import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import {
  NavigatorScreenParams,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import Profile from "screens/UserProfile/MyProfile";
import {
  PageStackNavigator,
  PageStackNavigatorParams,
} from "./PageStackNavigator";
import Settings from "screens/UserProfile/Settings";

type ProfileStackNavigatorParams = {
  Profile: undefined;
  PageStack: NavigatorScreenParams<PageStackNavigatorParams>;
  Settings: undefined;
};

export type ProfileStackNavigatorProps =
  NativeStackNavigationProp<ProfileStackNavigatorParams>;

const ProfileStack = createNativeStackNavigator<ProfileStackNavigatorParams>();

export const ProfileStackNavigator = (): JSX.Element => {
  const { goBack, navigate } = useNavigation<ProfileStackNavigatorProps>();

  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="Settings" component={Settings} />
      <ProfileStack.Screen name="PageStack" component={PageStackNavigator} />
    </ProfileStack.Navigator>
  );
};
