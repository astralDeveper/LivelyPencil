import { TouchableOpacity } from "react-native";
import { ToastConfigParams, ToastProps } from "react-native-toast-message";
import { Text } from "app/components/ui";

export const toastConfig = {
  dark: (params: ToastConfigParams<ToastProps>) => (
    <TouchableOpacity
      style={{
        width: "90%",
        backgroundColor: "#3A3A3A",
        alignSelf: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 6,
      }}
    >
      <Text style={{ color: "#DDDDDD" }}>{params.text1}</Text>
    </TouchableOpacity>
  ),
};
