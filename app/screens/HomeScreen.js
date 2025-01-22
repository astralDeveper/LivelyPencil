// $&
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { LiveBroadCasters } from "../components/LiveBroadCasters";
import { PopularPages } from "components";
import Ionicons from "@expo/vector-icons/Ionicons";
import HomeMenu from "../components/HomeMenu";
// import store from "store";
// import { store2 } from "store";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen(props) {
  const navigation = useNavigation();
  // const { currentUser, expoPushToken } = store();
  // const { notification } = store2();
  // const [redDot, setRedDot] = useState(false);

  // useEffect(() => {
  //   if (notification?.request?.content?.data) {
  //     setRedDot(true);
  //   }
  // }, [notification]);

  return (
    // <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
    <SafeAreaView style={{ flex: 1 }}>
      {/* <StatusBar backgroundColor="white" barStyle="dark-content" /> */}
      <View className=" border-gray-300 border-b-2 bg-white  flex-row justify-between">
        {/* <Text
          onPress={() => console.log(expoPushToken)}
          className="text-Primary font-Inter-bold text-2xl  ml-4"
        >
          LivelyPencil
        </Text> */}

        {/* <View className="flex-row  justify-between w-20 mr-4 items-center relative">
          {redDot && (
            <View className="bg-red p-1 text-xs font-Inter-extrabold text-red rounded-full -right-5 -top-1 z-20"></View>
          )}
          <Ionicons
            onPress={() => {
              navigation.navigate("Notification");
              setRedDot(false);
            }}
            name="notifications-outline"
            size={24}
            color="black"
          />
          <HomeMenu />
        </View> */}
      </View>
      <View className="bg-white">
        <ScrollView
          horizontal
          className="flex-row "
          showsHorizontalScrollIndicator={false}
        >
          {/* <LiveBroadCasters /> */}
        </ScrollView>
      </View>

      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <PopularPages />
      </View>
    </SafeAreaView>
  );
}
