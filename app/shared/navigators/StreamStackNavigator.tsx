import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import {
  NavigatorScreenParams,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import Main from "screens/Stream/Main";
import Pages from "screens/Stream/Pages";
import CreateStream from "screens/Stream/CreateStream";
import HeaderBackButton from "app/components/ui/HeaderBackButton";
import EditStream from "screens/Stream/EditStream";
import { IGetPage, IGetPageById } from "shared/types/page/PageResponse.type";
import PageEditor from "screens/Stream/PageEditor";
import {
  PageStackNavigator,
  PageStackNavigatorParams,
} from "./PageStackNavigator";
import { LanguageList } from "shared/util/constants";

type StreamStackNavigatorParams = {
  Main: undefined;
  Pages: {
    id: string;
    title: string;
  };
  EditStream: {
    description: string;
    id: string;
    title: string;
    categoryId: string;
    coverImageUrl: string;
    language: (typeof LanguageList)[keyof typeof LanguageList];
  };
  CreateStream: undefined;
  PageEditor: {
    pageId: string;
    pageNumber?: string;
  };
  PageStack: NavigatorScreenParams<PageStackNavigatorParams>;
};

export type PagesRouteProp = RouteProp<StreamStackNavigatorParams, "Pages">;
export type PageEditorRouteProp = RouteProp<
  StreamStackNavigatorParams,
  "PageEditor"
>;
export type EditStreamRouteProp = RouteProp<
  StreamStackNavigatorParams,
  "EditStream"
>;

export type StreamStackNavigatorProps =
  NativeStackNavigationProp<StreamStackNavigatorParams>;

const StreamStack = createNativeStackNavigator<StreamStackNavigatorParams>();

export const StreamStackNavigator = (): JSX.Element => {
  const { goBack, navigate } = useNavigation<StreamStackNavigatorProps>();

  return (
    <StreamStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Main"
    >
      <StreamStack.Screen name="Main" component={Main} />
      <StreamStack.Screen
        name="Pages"
        component={Pages}
        options={{
          headerShown: true,
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigate("Main")} />
          ),
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <StreamStack.Screen
        name="CreateStream"
        component={CreateStream}
        options={{
          headerShown: true,
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigate("Main")} />
          ),
          headerTitle: "",
          headerShadowVisible: false,
          headerTitleAlign: "left",
        }}
      />
      <StreamStack.Screen
        name="EditStream"
        component={EditStream}
        options={{
          headerShown: true,
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigate("Main")} />
          ),
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <StreamStack.Screen name="PageEditor" component={PageEditor} />
      <StreamStack.Screen name="PageStack" component={PageStackNavigator} />
    </StreamStack.Navigator>
  );
};
