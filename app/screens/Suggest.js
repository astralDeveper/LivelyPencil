import { View, Text, Pressable, SafeAreaView, StatusBar } from "react-native";
import { PopularUsers } from "components";
// $&
export default function Suggest() {
  const router = useRouter();
  return (
    <SafeAreaView
      className="pb-[50%]"
      style={{ marginTop: StatusBar.currentHeight || 0 }}
    >
      <View className=" mt-10 ml-4">
        <Text className="text-2xl font-Inter-Black text-Primary ">
          Popular Writers
        </Text>
        <Text className="font-Inter-Black text-slate-500">
          Popular accounts that people love
        </Text>
      </View>
      <View className="">
        <PopularUsers />
      </View>
    </SafeAreaView>
  );
}
