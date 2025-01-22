// NOTE: Instead of onEndReached we use onScroll to extend limit and get more results.
import { View, FlatList, Text, Pressable, Alert } from "react-native";
import { useContext, useState } from "react";
import axios from "axios";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import useSWR, { mutate } from "swr";
// $&
import { SocketContext } from "./Socket/SocketProvider";

import PageMenu from "../components/PageMenu";
import LiveButton from "../components/LiveButton";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "shared/hooks/useRedux";
import { SearchStackNavigatorProps } from "shared/navigators/SearchStackNavigator";

const Books = ({ id }) => {
  if (!id === 2) {
    //NOTE: There was toch issue, If Id is not 2(Means not in USERS screen) then don't render anything
    return null;
  }
  const { navigate } = useNavigation<SearchStackNavigatorProps>();
  const currentUser = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const { userSearchInput, bookSearchFetchData } = useAppSelector(
    (state) => state.search
  );
  const [limit, setLimit] = useState(10);
  const { liveBookSocket, liveBookRooms } = useContext(SocketContext);

  function handleJoin(book) {
    liveBookSocket.emit("join_live_book", {
      bookId: book._id,
      userId: currentUser?.id,
    });
    navigate("PageStack", {
      screen: "Preview",
      params: {
        shortCode: book.bookShortCode,
        coverImageUrl: book.coverImageUrl,
        id: book._id,
        title: book.title,
      },
    });
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
        // If its url then use url else use fileKey
        source={{
          uri: item.coverImageUrl.includes("http")
            ? item.coverImageUrl
            : `${process.env.S3}/${item.coverImageUrl}`,
        }}
        className="flex-1 bg-cover"
      />

      <View className="absolute top-0 left-0 right-0 bottom-0 z-50 flex-1 flex-col ">
        <View className="flex-col ml-auto  items-center    justify-center -rotate-90 pt-1 pr-3 rounded-full">
          <Text className=" text-white font-Inter-Black text-xs ">
            {item.numberOfPages}
          </Text>
        </View>

        {/* {!liveBookRooms.includes(item._id) && ( */}
        <View className=" flex-col items-center space-y-2 absolute bottom-2 right-0 left-0">
          <Text className=" text-center font-Inter-bold text-white text-md bg-black/20 rounded-lg py-2 px-6 ">
            {item.title}
          </Text>
        </View>
        {/* )} */}
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

  async function fetchData(limit) {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/books/getAllBooks?page=1&limit=${limit}&sortBy=createdAt:desc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
  const { data, isLoading, isValidating } = useSWR("books", () =>
    fetchData(limit)
  );
  return (
    <View className="">
      <FlatList
        refreshing={isValidating}
        onRefresh={() => {
          setLimit((prev) => prev + 5);
          mutate("books");
        }}
        showsVerticalScrollIndicator={false}
        data={
          userSearchInput === ""
            ? data?.results?.filter((page) => page.isEnabled)
            : bookSearchFetchData?.results?.filter((book) => book.isEnabled)
        }
        renderItem={renderItem}
        numColumns={2}
        onScroll={({ nativeEvent }) => {
          const offset = nativeEvent.contentOffset.y;
          const contentHeight = nativeEvent.contentSize.height;
          const layoutHeight = nativeEvent.layoutMeasurement.height;

          if (offset / (contentHeight - layoutHeight) > 0.3) {
            setLimit((prev) => prev + 5);
            mutate("books");
          }
        }}
        ListFooterComponent={
          isLoading && (
            <View className="flex-1 w-10 h-4 items-center m-auto z-20">
              <LottieView resizeMode="cover" source={Load} autoPlay loop />
            </View>
          )
        }
        ListEmptyComponent={
          bookSearchFetchData?.results?.filter((book) => book.isEnabled)
            .length == 0 && (
            <View className=" h-screen  items-center">
              <Text className="text-gray-400 ">No book found </Text>
            </View>
          )
        }
        columnWrapperStyle={{
          marginVertical: 0,
          marginHorizontal: 0,
        }}
      />
    </View>
  );
};

export default Books;
