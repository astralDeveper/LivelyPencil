import { View } from "react-native";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
export default function Loading() {
  return (
    <View className="flex-1 my-[80%]  items-center">
      <View className=" w-10 h-4 items-center mt-1">
        <LottieView resizeMode="cover" source={Load} autoPlay loop />
      </View>
    </View>
  );
}
