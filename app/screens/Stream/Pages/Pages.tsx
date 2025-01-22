import {
  View,
  Pressable,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import { MasonryFlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { parseStringByDiv } from "shared/util/htmlParsers";
import usePages from "./usePages";
import {
  Button,
  HandleRefresh,
  ListEmptyComponent,
  Text,
} from "app/components/ui";
import { PlusCircle } from "react-native-feather";

export default function StreamPages() {
  const { width } = useWindowDimensions();

  const {
    deletePage,
    incrementPageNumber,
    isLoading,
    pages,
    title,
    addPage,
    navigateToEditPage,
    buttonLoading,
    handleRefetch,
  } = usePages();

  const renderItem = ({ item }) => {

    const displayIndex = item?.indexOfPage + 1;
  
    return (
      <TouchableOpacity
        onPress={() => {
        
          navigateToEditPage(item.id);
        }}
        className={`rounded-md relative`}
        style={{
          overflow: "hidden",
          width: "auto",
          height: width * 0.7,
          backgroundColor: "#F8F8F8",
          marginTop: 8,
          marginHorizontal: 4,
        }}
      >
        <Pressable
          onPress={() =>
            Alert.alert(
              "Confirm Delete",
              `Do you want to permanently delete Page # ${item.indexOfPage} of book "${title}" ?`,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                { text: "Confirm", onPress: () => deletePage(item.id) },
              ]
            )
          }
          className=" absolute right-0 bottom-0 z-20 rounded-tl-full pl-5 pt-5 pr-2 pb-2"
          style={{ backgroundColor: "rgba(225,52,52,0.2)" }}
        >
          {item.isEnabled && (
            <AntDesign name="delete" size={20} color="#e13434" />
          )}
        </Pressable>
        <Text
          className="
      pl-0.5 text-xs  text-white rounded-sm absolute z-10 top-0 right-0 px-2 py-1"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          Page {"  "}
          {displayIndex}
        </Text>
        {item?.isEnabled && (
          <View>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <View
                style={{
                  padding: 12,
                }}
              >
                {item.html &&
                  parseStringByDiv(item.html).map((item, index) => (
                    <Text key={index} style={{ marginBottom: 16 }}>
                      {item}
                    </Text>
                  ))}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white px-2">
      {isLoading ? (
        <View className=" w-10 h-4 items-center m-auto">
          <LottieView resizeMode="cover" source={Load} autoPlay loop />
        </View>
      ) : (
        <MasonryFlashList
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={268}
          // {...props}
          data={pages}
          extraData={true}
          onEndReached={() => {
            if (pages.length > 12) incrementPageNumber();
          }}
          ListEmptyComponent={() => (
            <ListEmptyComponent text="No pages added yet..." />
          )}
          refreshControl={<HandleRefresh refetch={handleRefetch} />}
        />
      )}
      {/* <TouchableOpacity
        disabled={buttonLoading}
        onPress={addPage}
        className="flex-row py-2 justify-center bg-brand  items-center rounded-full mx-2"
      >
        <Text
          className={clsx("font-Inter-bold text-white", {
            "text-gray-500": buttonLoading,
          })}
        >
          {buttonLoading ? "Loading  " : "Add Page  "}
        </Text>
        <Ionicons
          name="ios-add-circle-outline"
          size={32}
          color={buttonLoading ? "gray" : "#fff"}
        /> 
      </TouchableOpacity> */}
      <Button
        label="Add Page"
        Icon={PlusCircle}
        short
        onPress={addPage}
        loading={buttonLoading}
      />
    </View>
  );
}
