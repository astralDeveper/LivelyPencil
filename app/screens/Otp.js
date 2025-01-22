import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
// $&
import { useState } from "react";
import axios from "axios";

import { API_URL } from "@env";
import Load from "assets/svg/Load.json";
import LottieView from "lottie-react-native";
import store from "store";
import { Pressable } from "react-native";
import clsx from "clsx";
// $&

export default function Otp() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, setCurrentUser } = store();

  const verify = async () => {
    const email = params.email;
    console.log(email, otp);
    // either get email from registration or login
    try {
      setLoading(true);
      // either get email from registration or login
      const response = await axios.post(
        `${API_URL}/auth/verify-email?token=${otp}&email=${email}`
      );

      if (response.status === 200) {
        setCurrentUser(response.data);
        router.replace("screens/Category");
      }
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "OTP Doesn't Match");
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    // either get email from registration or login
    const email = params.email;
    try {
      setLoading(true);
      const response = await axios(
        `${API_URL}/auth/resend-verification-email?email=${email}`,
        {
          method: "POST",
        }
      );

      if (response.status === 200) {
        Alert.alert("New OTP Sent", "Pleas check your email");
      }
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "Cannot send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center ">
      <Text className="font-Inter-medium opacity-70 text-base pb-2 px-10 text-center">
        We have sent you an OTP code Please Check your Email
      </Text>

      <TextInput
        style={{ letterSpacing: 12 }}
        keyboardType={"numeric"}
        maxLength={6}
        onChangeText={(value) => setOtp(Number(value))}
        placeholder="______"
        caretHidden={true}
        placeholderTextColor="#59595A"
        className=" border w-56 font-Inter-bold  text-Primary/90 text-center overflow-hidden text-2xl rounded-lg p-2"
      />

      <Pressable
        onPress={verify}
        className={clsx(
          " w-44 bg-Primary self-center mt-10   rounded-2xl  items-center p-2 ",
          {
            "bg-white border-Primary border-2": loading,
          }
        )}
      >
        <Text className="text-white text-xl font-Inter-bold ">
          {loading ? (
            <View className="flex-1 w-10 h-5 items-center mt-1">
              <LottieView resizeMode="cover" source={Load} autoPlay loop />
            </View>
          ) : (
            "Submit"
          )}
        </Text>
      </Pressable>
      <TouchableOpacity onPress={() => resendOtp()} className="mt-10">
        <Text className="text-Primary">Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
}
