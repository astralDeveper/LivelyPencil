// components
import { View, FlatList, Text, Pressable, Alert } from "react-native";
import { useState, useContext } from "react";
import axios from "axios";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import useSWR, { mutate } from "swr";
// $&
import PageMenu from "../../../../components/PageMenu";
import { SocketContext } from "../../../Socket/SocketProvider";
// $&
import LiveButton from "../../../../components/LiveButton";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "shared/hooks/useRedux";

const OtherBooks = ({ id }) => {
  const { connectedUsers, liveBookSocket, liveBookRooms } =
    useContext(SocketContext);
  const navigation = useNavigation();
  const token = useAppSelector((state) => state.auth.token);

  function handleJoin(book) {
    // liveBookSocket.emit("join_live_book", {
    //   bookId: book._id,
    //   userId: currentUser.user.id,
    // });
    // navigation.navigate("Preview", { book });
  }
  const [limit, setLimit] = useState(10);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => Alert.alert("", "No Pages Created yet")}
      className="w-1/2  h-[270px] relative mx-[0.5] "
    >
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-10" />

      <Image
        placeholder={require("assets/images/bookLoad.gif")}
        placeholderContentFit="cover"
        priority="high"
        cachePolicy="memory-disk"
        contentFit="cover"
        // source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/s3/getMedia/${item.coverImageUrl}` }}
        source={{ uri: `${process.env.S3}/${item.coverImageUrl}` }}
        className="flex-1 bg-cover"
      />

      <View className="absolute top-0 left-0 right-0 bottom-0 z-50 flex-1 flex-col ">
        <View className="flex-col ml-auto  items-center    justify-center -rotate-90 pt-2 pr-4 rounded-full">
          <Text className=" text-white font-Inter-Black text-xs ">
            {item.numberOfPages}
          </Text>
        </View>
        {item.numberOfPages >= 1 && (
          <View className="absolute z-10">
            <PageMenu item={item} lastpage={item.numberOfPages} />
          </View>
        )}

        {!liveBookRooms.includes(item._id) && (
          <View className="flex-1 flex-col items-center space-y-2 absolute bottom-2 right-0 left-0">
            <Text className="  text-center font-Inter-bold text-white text-md bg-black/20 rounded-lg py-2 px-6 ">
              {item.title}
            </Text>
          </View>
        )}
      </View>
      <LiveButton
        item={item}
        liveBookRooms={liveBookRooms}
        handleJoin={handleJoin}
      />
      {/* {liveBookRooms.includes(item._id) && (
        <Text
          onPress={() => handleJoin(item)}
          className="z-50 text-center font-Inter-bold text-white text-md bg-red px-8 py-2"
        ></Text>
      )} */}
    </Pressable>
  );

  async function update(limit) {
    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/books/getAllBooksByUserId?page=1&limit=10&sortBy=title:desc&userId=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  }
  const { data, isValidating } = useSWR(`/otherBooks`, () => update(limit));

  return (
    // <SafeAreaView
    //   style={{
    //     flex: 1,
    //     // marginTop: StatusBar.currentHeight || 0,
    //     backgroundColor: "white",
    //   }}
    // >
    //   <View className="flex-row items-center ml-2">
    //     <Ionicons
    //       name="chevron-back-sharp"
    //       size={28}
    //       color="#3B70B7"
    //       onPress={() => navigation.goBack()}
    //     />
    //     <Text className="ml-28 font-Inter-bold text-base">Books</Text>
    //   </View>
    <FlatList
      ListEmptyComponent={
        data?.results?.length == 0 && (
          <Text className="mx-auto text-gray-500 mt-20 font-Inter-bold">
            No streams created yet
          </Text>
        )
      }
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      data={data?.results}
      renderItem={renderItem}
      numColumns={2}
      onEndReached={() => {
        setLimit((prev) => prev + 10);
        mutate("/otherBooks");
      }}
      ListFooterComponent={
        (data?.totalResults > 4) & isValidating && (
          <View className=" flex-1 w-10 h-4 items-center m-auto z-20">
            <LottieView resizeMode="cover" source={Load} autoPlay loop />
          </View>
        )
      }
      columnWrapperStyle={{
        marginVertical: 0,
        marginHorizontal: 0,
      }}
    />
    // </SafeAreaView>
  );
};

export default OtherBooks;
