import { View, Text, Pressable } from "react-native";
import NoPages from "../assets/svg/NoPages";
import { Feather } from "@expo/vector-icons";
// $&
import axios from "axios";
import store from "store";
import { useState } from "react";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import { ActivityIndicator } from "react-native-paper";

export const CustomEndPage = ({ authorId }) => {
  const { currentUser, setOtherUser } = store();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const visitProfile = async () => {
    setLoading(true);
    await axios
      .get(`${process.env.EXPO_PUBLIC_API_URL}/users/getUserById/${authorId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })
      .then((res) => {
        setOtherUser(res.data);
        navigation.push("OtherProfile");
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  };

  return (
    <View className="items-center">
      <NoPages height={180} width={180} style={{ alignSelf: "center" }} />
      <Text className="font-Inter-Black text-red text-xl">
        No more pages to show
      </Text>
      <Text className="text-2xl mt-[20%]">Swipe Left for Previous Page</Text>
      <Feather name="arrow-left-circle" size={80} color="#6699ff" />
      <Pressable
        onPress={() => visitProfile()}
        className="bg-[#6699ff] rounded-full mt-[20%] px-4 py-2 flex-row items-center"
      >
        <Text className="text-white text-lg font-Inter-Black">
          {loading ? (
            <View className="px-14">
              <ActivityIndicator color="white" />
            </View>
          ) : (
            "Author's Profile"
          )}
        </Text>
        <Feather name="arrow-right" size={24} color="white" />
      </Pressable>
      <Pressable
        onPress={() => navigation.replace("Main")}
        className="bg-[#6699ff] rounded-full mt-5 px-4 py-2 flex-row items-center"
      >
        <Text className="text-white text-lg font-Inter-Black">
          Return to Home
        </Text>
        <Feather name="arrow-right" size={24} color="white" />
      </Pressable>
    </View>
  );
};
