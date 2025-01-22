import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Pressable,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
// $&
import { Image } from "expo-image";
import useSWR, { mutate } from "swr";
import axios from "axios";
import store from "store";
import { API_URL } from "@env";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Alert } from "react-native";
import { useState } from "react";

export default function Library() {
  const { currentUser } = store();
  const navigation = useNavigation();

  async function update() {
    const res = await axios.get(
      `${API_URL}/categories/getAllCategoriesWithAnalytics`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      }
    );
    return res.data;
  }

  const { data, isValidating } = useSWR("/categories", () => update());
  console.log("🧡 Library Screen 🧡");
  async function selectedCategory(id) {
    const res = await axios.get(
      `${API_URL}/books/getBooksByCategoryId?page=1&limit=300&sortBy=createdAt:desc&categoryId=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      }
    );

    navigation.navigate("NewStreams", { book: res.data });
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // marginTop: StatusBar.currentHeight || 0,
        position: "relative",
      }}
    >
      <View className="px-2  flex-row border-b bg-white border-gray-300 w-full pb-2 ">
        <Ionicons
          name="chevron-back-sharp"
          size={28}
          color="#3B70B7"
          onPress={() => navigation.goBack()}
        />
        <Text className="text-xl font-Inter-medium text-Primary mr-auto ml-2">
          Library
        </Text>
        {/* <Ionicons name="globe-outline" size={24} color="#7A97CC" /> */}
      </View>

      <ScrollView
        // refreshes list on pull down
        onEnded={() => mutate("/categories")}
        showsVerticalScrollIndicator={false}
        className="flex-1 pt-2 bg-white "
        refreshControl={<RefreshControl refreshing={isValidating} />}
      >
        {data
          ?.sort((a, b) => b.numberOfBooks - a.numberOfBooks)
          .map((item, i) => (
            <Pressable
              onPress={() =>
                item.numberOfBooks
                  ? selectedCategory(item._id)
                  : Alert.alert("", "No book is created yet in this category")
              }
              key={i}
            >
              <View className=" flex-row  w-[95%] mx-auto mb-2 justify-between items-center  border-b border-gray-200 ">
                <View className="flex-row items-center space-x-4">
                  <View className=" w-16 rounded-full">
                    <Image
                      cachePolicy="memory-disk"
                      source={{ uri: item.categoryImage }}
                      className="rounded-full  h-16"
                      contentFit="cover"
                    />
                  </View>
                  <Text className="text-Primary  font-Inter-Black text-xl first-letter:capitalize">
                    {item.categoryName}
                  </Text>
                </View>

                <View className="  px-2 ">
                  <View className="flex-row justify-between">
                    <MaterialCommunityIcons
                      name="bookshelf"
                      size={16}
                      color="#B8B8B8"
                    />
                    <Text className="text-Primary ml-1">
                      {item.numberOfBooks}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Foundation
                      name="page-multiple"
                      size={16}
                      color="#B8B8B8"
                    />
                    <Text className="text-Primary/80 ml-1">
                      {item.numberOfPages}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Ionicons
                      name="ios-person-outline"
                      size={16}
                      color="#B8B8B8"
                    />
                    <Text className="text-Primary ml-1">
                      {item.numberOfAuthors}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
