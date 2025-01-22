import { View, Text, Pressable, RefreshControl, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Alert } from "react-native";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LibraryStackNavigatorProps } from "shared/navigators/LibraryStackNavigator";
import useLibrary from "./useLibrary";
import Separator from "app/components/ui/HorizontalSectionSeparator";
import { Loading } from "app/components";
import LanguageSelector from "app/components/ui/LanguageSelector";
import { useAppSelector } from "shared/hooks/useRedux";

export default function Library() {
  const { navigate } = useNavigation<LibraryStackNavigatorProps>();
  const { data, isLoading } = useLibrary();
    const userLanguage = useAppSelector((state) => state.util.languageSelected);

// console.log("first",userLanguage)
  async function selectedCategory(id: string, categoryName: string) {
    navigate("Streams", { categoryId: id, categoryName,lib:"Lib" });
  }

  const renderItem = useCallback(

    ({ item }) =>{ 

return(
      <Pressable
        onPress={() =>
          item.numberOfBooks
            ? selectedCategory(item._id, item.categoryName)
            : Alert.alert("", "No book is created yet in this category")}
        key={item._id}>
        <View className="flex-row w-[100%] mx-auto mb-2 justify-between items-center bg-textField p-4 rounded-md">
          {/* <View className="flex-row items-center space-x-4"> */}
          <View className=" w-16 rounded-full">
            <Image
              cachePolicy="memory-disk"
              source={{ uri: item.categoryImage }}
              className="rounded-full  h-16"
              contentFit="cover"
            />
          </View>
          {/* </View> */}

          <View className="flex-1 px-2 ">
            <Text className="text-Black font-Inter-bold text-xl first-letter:capitalize mb-2">
              {item.categoryName}
            </Text>
            <View className="flex-row justify-evenly">
              <View className="flex-row">
                <MaterialCommunityIcons
                  name="bookshelf"
                  size={16}
                  color="#B8B8B8"
                />
                <Text className="text-Black ml-1">{item.numberOfBooks}</Text>
              </View>
              <Separator />
              <View className="flex-row">
                <Foundation name="page-multiple" size={16} color="#B8B8B8" />
                <Text className="text-Black ml-1">{item.numberOfPages}</Text>
              </View>
              <Separator />
              <View className="flex-row">
                <Ionicons name="ios-person-outline" size={16} color="#B8B8B8" />
                <Text className="text-Black ml-1">{item.numberOfAuthors}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
      )
    },
    []
  );

  if (isLoading) return <Loading />;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
      }}
    >
      <View className="flex-row justify-between items-center">
        <Text
          style={{ fontFamily: "Inter-Bold", fontSize: 24, marginBottom: 8 }}
        >
          Library
        </Text>
        <LanguageSelector />
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={isLoading} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
