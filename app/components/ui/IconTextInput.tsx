import {
  Pressable,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

interface IconTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  eraseText?: () => void;
  Icon: JSX.Element;
}

const IconTextInput = (props: IconTextInputProps): JSX.Element => {
  return (
    <View
      className="flex-row items-center border border-gray-300 space-x-2 pl-2 rounded-lg py-2"
      style={props.containerStyle}
    >
      {props.Icon}
      <TextInput
        placeholder="Search Keyword"
        className=" font-Inter-Black flex-1 "
        autoCapitalize="none"
        {...props}
        style={[{ fontFamily: "Inter-Medium", flex: 1 }, props.style]}
      />
      {props.eraseText && (
        <Pressable onPress={props.eraseText} className="rotate-180 mr-2">
          <Entypo name="circle-with-cross" size={28} color="lightgray" />
        </Pressable>
      )}
    </View>
  );
};

export default IconTextInput;
