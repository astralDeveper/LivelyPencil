import { View } from "react-native";
import Text from "./Text";

const ListEmptyComponent = ({ text }: { text: string }): JSX.Element => {
  return (
    <View className="align-center items-center flex-1 h-72 mt-20">
      <Text className="font-Inter-bold text-xl color-grey">{text}</Text>
    </View>
  );
};

export default ListEmptyComponent;
