import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { NavigatorScreenParams, useNavigation } from "@react-navigation/native";
import Main from "screens/Search/Main";
import {
  PageStackNavigator,
  PageStackNavigatorParams,
} from "./PageStackNavigator";

type SearchStackNavigatorParams = {
  Main: undefined;
  PageStack: NavigatorScreenParams<PageStackNavigatorParams>;
};

export type SearchStackNavigatorProps =
  NativeStackNavigationProp<SearchStackNavigatorParams>;

const SearchStack = createNativeStackNavigator<SearchStackNavigatorParams>();

export const SearchStackNavigator = (): JSX.Element => {
  const { goBack } = useNavigation();

  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="Main" component={Main} />
      <SearchStack.Screen name="PageStack" component={PageStackNavigator} />
    </SearchStack.Navigator>
  );
};
