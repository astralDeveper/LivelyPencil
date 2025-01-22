import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { RouteProp, useNavigation } from "@react-navigation/native";
import Details from "screens/PageStack/Details";
import Discussion from "screens/PageStack/Discussion/Discussion";
import OtherProfile from "screens/PageStack/OtherProfile";
import {
  IPageDetails,
  IPageDiscussion,
} from "shared/types/page/PageRouteProps.type";
import Preview from "screens/PageStack/Preview";

export type PageStackNavigatorParams = {
  Details: IPageDetails;
  Discussion: IPageDiscussion;
  OtherProfile: {
    id: string;
  };
  Preview: {
    id: string;
    shortCode: string;
    title: string;
    coverImageUrl: string;
  };
};

export type DetailsRouteProp = RouteProp<PageStackNavigatorParams, "Details">;

export type PreviewRouteProp = RouteProp<PageStackNavigatorParams, "Preview">;

export type DiscussionRouteProp = RouteProp<
  PageStackNavigatorParams,
  "Discussion"
>;
export type OtherProfileRouteProp = RouteProp<
  PageStackNavigatorParams,
  "OtherProfile"
>;

export type PageStackNavigatorProps =
  NativeStackNavigationProp<PageStackNavigatorParams>;

const PageStack = createNativeStackNavigator<PageStackNavigatorParams>();

export const PageStackNavigator = (): JSX.Element => {
  const { goBack, navigate } = useNavigation<PageStackNavigatorProps>();

  return (
    <PageStack.Navigator screenOptions={{ headerShown: false }}>
      <PageStack.Screen name="Details" component={Details} />
      <PageStack.Screen name="Discussion" component={Discussion} />
      <PageStack.Screen name="OtherProfile" component={OtherProfile} />
      <PageStack.Screen name="Preview" component={Preview} />
    </PageStack.Navigator>
  );
};
