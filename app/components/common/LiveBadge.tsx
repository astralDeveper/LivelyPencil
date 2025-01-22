import { Text, View } from "react-native";

export const LiveBadge = () => {
  return (
    <>
      <View className="bg-red  px-4 rounded-md absolute top-1 left-1">
        <Text className="text-white text-center text-base">Live</Text>
      </View>
    </>
  );
};
