import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import SignIn from "screens/Auth/SignIn";
import Register from "screens/Auth/Register";
import TOS from "screens/Auth/TOS";
import HeaderBackButton from "app/components/ui/HeaderBackButton";
import { useNavigation } from "@react-navigation/native";
import ForgotPassword from "screens/Auth/ForgotPassword";
import CameraImage from "screens/Auth/CameraImage";

type AuthStackNavigatorParams = {
  SignIn: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  TOS: undefined;
  CameraImage: undefined;
};

export type AuthStackNavigatorProps =
  NativeStackNavigationProp<AuthStackNavigatorParams>;

const AuthStack = createNativeStackNavigator<AuthStackNavigatorParams>();

export const AuthStackNavigator = (): JSX.Element => {
  const { goBack } = useNavigation();

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerShown: true,
          headerLeft: () => <HeaderBackButton onPress={goBack} />,
          headerTitle: "Forgot Password",
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
      />
      <AuthStack.Screen
        name="TOS"
        component={TOS}
        options={{
          headerShown: true,
          // headerLeft: () => <HeaderBackButton onPress={goBack} />,
          headerTitle: "Terms and Conditions",
          headerShadowVisible: false,
          headerTitleAlign: "center",
          animation: "slide_from_right",
          headerBackButtonMenuEnabled: true,
        }}
      />
      <AuthStack.Screen
        name="CameraImage"
        component={CameraImage}
        options={{
          headerShown: true,
          headerLeft: () => (
            <HeaderBackButton onPress={goBack} isCross={true} />
          ),
          headerTitle: "",
          headerShadowVisible: false,
          headerTitleAlign: "center",
          animation: "slide_from_bottom",
        }}
      />
    </AuthStack.Navigator>
  );
};
