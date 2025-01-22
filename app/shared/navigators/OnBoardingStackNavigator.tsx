import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import SelectCategory from "screens/OnBoarding/SelectCategory";
import FollowUsers from "screens/OnBoarding/FollowUsers";
import { RouteProp } from "@react-navigation/native";
import SelectLanguage from "screens/OnBoarding/For_Language/SelectLanguage";

type OnBoardingStackNavigatorParams = {
  SelectCategory: undefined;
  FollowUsers: {
    selectedCategories: string[];
  };
};

export type FollowUsersRouteProp = RouteProp<
  OnBoardingStackNavigatorParams,
  "FollowUsers"
>;

export type OnBoardingStackNavigatorProps =
  NativeStackNavigationProp<OnBoardingStackNavigatorParams>;

const OnBoardingStack =
  createNativeStackNavigator<OnBoardingStackNavigatorParams>();

export const OnBoardingStackNavigator = (): JSX.Element => {
  return (
    <OnBoardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnBoardingStack.Screen
        name="SelectLanguage"
        component={SelectLanguage}
      />
      <OnBoardingStack.Screen
        name="SelectCategory"
        component={SelectCategory}
      />
      <OnBoardingStack.Screen name="FollowUsers" component={FollowUsers} />
    </OnBoardingStack.Navigator>
  );
};
