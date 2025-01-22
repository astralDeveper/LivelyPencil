// components
import {
  View,
  FlatList,
  Text,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import useSWR, { mutate } from "swr";
import PageMenu from "../../../../components/PageMenu";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "shared/hooks/useRedux";
import { ProfileStackNavigatorProps } from "shared/navigators/ProfileStackNavigator";

const UserBooks = () => {
  const token = useAppSelector((state) => state.auth.token);

  const [limit, setLimit] = useState(10);
  const { navigate } = useNavigation<ProfileStackNavigatorProps>();

  function handlePress(item) {
    const lengthOfPageIds = item.listOfPageIds.length;
    if (lengthOfPageIds === 0)
      return Alert.alert(
        "No Pages Created Yet",
        "We are sorry to inform you that author of this stream has not created a page yet"
      );

    navigate("PageStack", {
      screen: "Details",
      params: { pageId: item.listOfPageIds[0].pageId },
    });
  }

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => handlePress(item)}
      className="w-[46%] h-72  bg-gray-50 radius-lg m-2 relative"
    >
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-10" />

      <ImageBackground
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

        <View className="flex-1 flex-col items-center space-y-2 absolute bottom-2 right-0 left-0">
          <Text className="  text-center font-Inter-bold text-white text-md bg-black/20 rounded-lg py-2 px-6 ">
            {item.title}
          </Text>
        </View>
      </View>

      {/* {item.numberOfPages >= 1 && (
        <View className="absolute z-50">
          <PageMenu item={item} lastpage={item.numberOfPages} />
        </View>
      )} */}
    </Pressable>
  );

  return (
    <FlatList
      ListEmptyComponent={
        <Text className="mx-auto text-gray-500 mt-20 font-Inter-bold">
          No streams created yet
        </Text>
      }
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      data={data?.results}
      renderItem={renderItem}
      numColumns={2}
      onEndReached={() => {
        setTimeout(() => {
          setLimit(limit + 10);
          mutate("/booksbyAuthor");
        }, 0);
      }}
      contentContainerStyle={{ marginHorizontal: 20, overflow: "hidden" }}
    />
  );
};

export default UserBooks;
