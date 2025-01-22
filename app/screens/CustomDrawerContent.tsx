import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { ChevronLeft } from "react-native-feather";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props}>
      <View className="flex-row items-start">
        <TouchableOpacity
          className="flex-row justify-between items-center mb-2 ml-2 mr-2"
          style={{ padding: 4, borderRadius: 12, backgroundColor: "#F7F8F8" }}
          onPress={props.navigation.closeDrawer}
        >
          <ChevronLeft color="#4B4B4B" width={18} />
        </TouchableOpacity>
        <Text
          className="text-Primary font-Inter-bold text-xl mt-1"
          style={{ color: "#0076FC" }}
        >
          LivelyPencil
        </Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
