import { useNavigation } from "@react-navigation/native";
import EditProfile from "app/components/User/EditProfile";
import { View } from "react-native";
import { ProfileStackNavigatorProps } from "shared/navigators/ProfileStackNavigator";

export default function Settings(): JSX.Element {
  const { goBack } = useNavigation<ProfileStackNavigatorProps>();
  return (
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
        position: "relative",
      }}
    >
      <EditProfile goBack={goBack} />
    </View>
  );
}
