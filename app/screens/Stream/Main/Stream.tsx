// // components
import {
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import useStream from "./useStream";
import { IStream } from "shared/types/stream/streamResponse.type";
import { Loading } from "app/components";
import PencilIcon from "assets/svg/Stream/Pencil";
import Separator from "app/components/ui/HorizontalSectionSeparator";
import EyeOpenIcon from "assets/svg/Stream/Eye";
import SettingsIcon from "assets/svg/Stream/Setting";
import { useCallback, useEffect } from "react";
import { HandleRefresh } from "app/components/ui";

type StreamListItemProps = {
  navigateToPages: ({ id, title }: { id: string; title: string }) => void;
  displayStreamStatistics: (item: IStream) => void;
  navigateToEditStream: (item: IStream) => void;
  item: IStream;
};

const StreamListItem = ({
  item,
  displayStreamStatistics,
  navigateToEditStream,
  navigateToPages,
}: StreamListItemProps) => {
  return (
    <View className="bg-textField rounded-2xl my-4" style={{ padding: 8 }}>
      <Pressable
        onPress={() => navigateToPages({ id: item._id, title: item.title })}
      >
        <View className=" justify-between  flex-row items-center ">
          <View className="rounded-full  justify-center items-center">
            <Image
              source={{
                uri: `${process.env.S3}/${
                  item.coverImageUrl + "?" + new Date()
                }`,
              }}
              className="w-20 h-20 rounded-3xl"
            />
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-Black font-Inter-bold text-lg">
              {item.title}
            </Text>
            <Text className="text-sm text-textColor2">{item?.description}</Text>
          </View>
        </View>
      </Pressable>
      <View className="flex-row justify-between mx-2 mt-2">
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => navigateToPages({ id: item._id, title: item.title })}
        >
          <PencilIcon width={23} height={23} />
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => displayStreamStatistics(item)}
        >
          <EyeOpenIcon width={23} height={23} />
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => navigateToEditStream(item)}
        >
          <SettingsIcon width={23} height={23} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Stream = () => {
  const {
    isLoading,
    onResultsEnd,
    streams,
    navigateToCreateStreams,
    displayStreamStatistics,
    navigateToEditStream,
    navigateToPages,
    handleRefetch,
  } = useStream();
  const renderItem = ({ item }: { item: IStream }) => {
    if (item.isEnabled)
      return (
        <StreamListItem
          item={item}
          key={item._id}
          displayStreamStatistics={displayStreamStatistics}
          navigateToEditStream={navigateToEditStream}
          navigateToPages={navigateToPages}
        />
      );
    else return <></>;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View className=" flex-row justify-between mt-2 mx-5 border-b border-gray-300 pb-3 ">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="bookshelf" size={24} color="gray" />
          <Text className="font-Inter-medium text-lg text-gray-500">
            Streams
          </Text>
        </View>
        <Pressable
          onPress={navigateToCreateStreams}
          className="flex-row items-center"
        >
          <Ionicons name="add-circle" size={24} color="#087FFF" />
          <Text className=" text-md text-gray-500 font-Inter-bold">
            Create Stream
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={streams}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text className="mx-auto text-gray-500 mt-20 font-Inter-bold">
            No Stream created yet
          </Text>
        )}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        onEndReached={onResultsEnd}
        extraData={true}
        refreshControl={<HandleRefresh refetch={handleRefetch} />}
      />
    </SafeAreaView>
  );
};

export default Stream;
