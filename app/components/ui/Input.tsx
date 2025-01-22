import { View, TextInput, TextInputProps, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import Eye from "assets/svg/Eye";
import EyeClose from "assets/svg/EyeClose";
import Text from "./Text";

interface InputProps extends TextInputProps {
  imageSource?: keyof typeof MaterialIcons.glyphMap;
  error?: string;
}

export default function Input(props: InputProps) {
  const { textContentType, error } = props;

  const [isFocused, setFocus] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onFocus = () => setFocus(true);

  const onBlur = () => setFocus(false);

  const handlePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const isPasswordField = textContentType?.toLowerCase().includes("password");
  const showPassword = passwordVisible || !isPasswordField;

  const EyeIcon = () => {
    if (showPassword)
      return <Eye stroke={isFocused ? "#0076FC" : "lightgray"} />;
    return <EyeClose stroke={isFocused ? "#0076FC" : "lightgray"} />;
  };

  return (
    <>
      <View
        className="
        shadow-slate-400 shadow-sm bg-white mt-6
        overflow-hidden flex-row items-center spaced-between rounded-lg p-3"
        style={{
          borderColor: isFocused ? "#0076FC" : error ? "red" : "lightgray",
          borderWidth: 1,
        }}
      >
        <TextInput
          {...props}
          className="text-sm font-Inter-Black font-normal flex-1"
          onFocus={onFocus}
          onBlur={onBlur}
          style={[
            { color: isFocused ? "#0076FC" : "#000", height: 28 },
            props.style,
          ]}
          secureTextEntry={!showPassword}
        />
        {isPasswordField ? (
          <Pressable onPress={handlePasswordVisibility}>
            <EyeIcon />
          </Pressable>
        ) : props.imageSource ? (
          <View>
            <MaterialIcons
              name={props.imageSource}
              size={20}
              color={isFocused ? "#0076FC" : "lightgray"}
            />
          </View>
        ) : null}
      </View>
      {error && (
        <Text className="mt-1 text-xs text-red font-Inter-medium ml-1">
          {error}
        </Text>
      )}
    </>
  );
}
