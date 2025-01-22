import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  View,
  useAnimatedValue,
} from "react-native";
import Text from "./Text";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type DataItem = {
  label: string;
  value: string;
};

type AnimatedSectionSelectorProps = {
  data: DataItem[];
  activeItem: DataItem;
  setActiveItem: Dispatch<SetStateAction<DataItem>>;
};

const MAX_WIDTH = Dimensions.get("screen").width * 0.2;
const ITEM_WIDTH = MAX_WIDTH > 140 ? 140 : MAX_WIDTH;

export default function AnimatedSectionSelector({
  data,
  activeItem,
  setActiveItem,
}: AnimatedSectionSelectorProps): JSX.Element {
  //   const translateX = useSharedValue(0);
  const translateX = useAnimatedValue(0);

  function animateOnSelect(index: number) {
    const animation = Animated.timing(translateX, {
      toValue: index * ITEM_WIDTH,
      duration: 200,
      useNativeDriver: true,
    });

    animation.start();
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<DataItem>) => (
    <TouchableOpacity
      className={`rounded-full p-2 items-center`}
      style={{ width: ITEM_WIDTH, height: 40 }}
      onPress={() => {
        // setActiveIndex(i);
        animateOnSelect(index);
        setActiveItem(item);
      }}
    >
      <Text
        className={`${
          activeItem.value === item.value ? "text-white" : "text-black"
        }`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ position: "relative", marginLeft: 20, marginTop: 10 }}>
      <Animated.View
        className="bg-brand rounded-full"
        style={{
          width: ITEM_WIDTH,
          height: 40,
          position: "absolute",
          transform: [{ translateX }],
        }}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.value}
        contentContainerStyle={{ marginBottom: 20 }}
      />
    </View>
  );
}
