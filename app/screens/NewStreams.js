// components
import { Foundation } from "@expo/vector-icons";
import { View, FlatList, Text, SafeAreaView, StatusBar } from "react-native";
import axios from "axios";
import { Image } from "expo-image";
import { API_URL } from "@env";
import store from "store";
import { Pressable } from "react-native";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// $&
import { useEffect } from "react";
import PageMenu from "../components/PageMenu";
import { SocketContext } from "./Socket/SocketProvider";
import { useContext } from "react";
import LiveButton from "../components/LiveButton";

// Params -> book.results
const NewStreams = () => {
  const { currentUser } = store();
  // const navigation = useNavigation();
  // const params = useLocalSearchParams();
  const { connectedUsers, liveBookSocket, liveBookRooms } =
    useContext(SocketContext);
  console.log("From Library Screen", params.book);

  function handleJoin(book) {
    liveBookSocket.emit("join_live_book", {
      bookId: book._id,
      userId: currentUser.user.id,
    });
    navigation.navigate("Preview", { book });
  }

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => Alert.alert("", "No Pages Created yet")}
      className="w-1/2  h-[270px] relative mx-[0.5]"
    >
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-10" />

      <Image
        placeholder={require("assets/images/bookLoad.gif")}
        placeholderContentFit="cover"
        priority="high"
        cachePolicy="memory-disk"
        contentFit="cover"
        source={{ uri: `${process.env.S3}/${item.coverImageUrl}` }}
        className="flex-1 bg-cover"
      />

      <View className="absolute top-0 left-0 right-0 bottom-0 z-50 flex-1 flex-col ">
        <View className="flex-col ml-auto  items-center    justify-center -rotate-90 pt-1 pr-3 rounded-full">
          <Text className=" text-white font-Inter-Black text-xs ">
            {item.numberOfPages}
          </Text>
        </View>

        {!liveBookRooms.includes(item._id) && (
          <View className=" flex-1 flex-col items-center space-y-2 absolute bottom-2 right-0 left-0">
            <Text className=" text-center font-Inter-bold text-white text-md bg-black/20 rounded-lg py-2 px-6 ">
              {item.title}
            </Text>
          </View>
        )}
      </View>
      {item.numberOfPages >= 1 && (
        <View className="absolute z-50 ">
          <PageMenu item={item} lastpage={item.numberOfPages} />
        </View>
      )}
      <LiveButton
        item={item}
        liveBookRooms={liveBookRooms}
        handleJoin={handleJoin}
      />
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <SafeAreaView style={{ marginTop: StatusBar.currentHeight || 0, flex: 1 }}> */}
      <View className="px-5  flex-row border-b-2 border-gray-300 w-full  bg-white">
        <Ionicons
          name="chevron-back-sharp"
          size={28}
          color="#3B70B7"
          onPress={() => navigation.goBack()}
        />
        <Text className="text-xl font-Inter-medium text-Primary mr-auto ml-2">
          New Streams
        </Text>
        {/* <Ionicons name="globe-outline" size={24} color="#7A97CC" /> */}
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={params.book.results}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{
          marginVertical: 0,
          marginHorizontal: 0,
        }}
      />
    </SafeAreaView>
  );
};

export default NewStreams;
