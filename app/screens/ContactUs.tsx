import { View, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  CustomKeyboardScrollView,
  Input,
  Text,
} from "app/components/ui";
import { useContactUsMutation } from "shared/apis/user/userApi";
import { apiHandler } from "shared/util/handler";

export default function ContactUs() {
  const { goBack } = useNavigation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendRequest, { data, isLoading, error }] = useContactUsMutation();

  useEffect(() => {
    apiHandler({
      data,
      error,
      showSuccess: true,
      onSuccess(_) {
        goBack();
      },
    });
  }, [data, error]);

  function sendEmail() {
    if (message === "" || subject === "")
      return Alert.alert("Error", "Please fill all the fields");
    sendRequest({ message, subject });
  }

  return (
    <CustomKeyboardScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 8,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1">
        <Text className="mt-6">Lets share your thoughts...</Text>

        <View className="flex-row subject items-center">
          <Input
            onChangeText={(val) => setSubject(val)}
            placeholder="Subject"
            placeholderTextColor="gray"
            className="text-sm font-Inter-Black "
          />
        </View>
        <View className="flex-row message items-center">
          <Input
            style={{
              height: 300,
              textAlignVertical: "top",
            }}
            onChangeText={(val) => setMessage(val)}
            placeholder="Write your message..."
            placeholderTextColor="gray"
            className="text-sm font-Inter-Black "
            multiline
          />
        </View>
      </View>
      <Button label="Submit" loading={isLoading} short onPress={sendEmail} />
    </CustomKeyboardScrollView>
  );
}
