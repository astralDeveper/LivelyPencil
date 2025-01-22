import { View, Text, SafeAreaView, StatusBar } from "react-native";
import { CategoryList } from "components";

export default function Category() {
  return (
    <SafeAreaView
      className="bg-transparent"
      // style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}
      style={{ flex: 1 }}
    >
      <View className="mt-2 ml-4 space-y-2">
        <Text className="text-xl font-Inter-bold  text-textColor1">
          Subscribe Categories
        </Text>
        <Text className="text-sm font-Inter-Black text-textColor2">
          Kindly choose at least one category.
        </Text>
      </View>
      <View className="flex-1 mt-4">
        <CategoryList />
      </View>
    </SafeAreaView>
  );
}
