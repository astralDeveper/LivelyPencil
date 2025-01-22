import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import {
  NavigatorScreenParams,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import Main from "screens/Library/Main";
import Streams from "screens/Library/Streams";
import HeaderBackButton from "app/components/ui/HeaderBackButton";
import {
  PageStackNavigator,
  PageStackNavigatorParams,
} from "./PageStackNavigator";

type LibraryStackNavigatorParams = {
  LibraryHome: undefined;
  Streams: {
    categoryId: string;
    categoryName: string;
  };
  PageStack: NavigatorScreenParams<PageStackNavigatorParams>;
};

export type StreamsRouteProp = RouteProp<
  LibraryStackNavigatorParams,
  "Streams"
>;

export type LibraryStackNavigatorProps =
  NativeStackNavigationProp<LibraryStackNavigatorParams>;

const LibraryStack = createNativeStackNavigator<LibraryStackNavigatorParams>();

export const LibraryStackNavigator = (): JSX.Element => {
  const { goBack, navigate } = useNavigation<LibraryStackNavigatorProps>();

  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="LibraryHome" component={Main} />
      <LibraryStack.Screen
        name="Streams"
        component={Streams}
        options={{
          headerShown: true,
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigate("LibraryHome")} />
          ),
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <LibraryStack.Screen name="PageStack" component={PageStackNavigator} />
    </LibraryStack.Navigator>
  );
};
