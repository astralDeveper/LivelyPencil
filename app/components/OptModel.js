import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import OTPTextInput from "react-native-otp-textinput";
import * as Clipboard from "expo-clipboard";
import { MaterialIcons } from "@expo/vector-icons";
// $&
import axios from "axios";
import store from "store";

const OtpModel = ({
  isVisible,
  onResendPress,
  onSubmitPress,
  onClose,
  email,
}) => {
  const [otp, setOtp] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser, setCurrentUser } = store();

  const router = useRouter();
  const otpInputRef = useRef(null);

  const getClipboardContent = async () => {
    const clipboardContent = await Clipboard.getStringAsync();
    setOtp(clipboardContent);
    setText(clipboardContent); // Assuming setOtp is your state setter for OTP
  };

  const handleOnFocus = () => {
    setIsFocused(true);
    if (otp === "") {
      // Clear the placeholder when input is focused
      otpInputRef.current.setValue("");
    }
  };

  const clearText = () => {
    otpInputRef.current.clear();
  };

  const setText = (val) => {
    otpInputRef.current.setValue(val);
  };

  // Verify OTP
  const verify = async () => {
    // either get email from registration or login
    try {
      setLoading(true);
      // either get email from registration or login
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/verify-email?token=${otp}&email=${email}`
      );

      if (response.status === 200) {
        setCurrentUser(response.data);
        setError(""); // REmove error
        router.replace("screens/Category");
      }
    } catch (e) {
      setLoading(false);
      setError("OTP code did not match");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    // either get email from registration or login
    try {
      setLoading(true);
      const response = await axios(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/resend-verification-email?email=${email}`,
        {
          method: "POST",
        }
      );

      if (response.status === 200) {
        ToastAndroid.show(`OTP sent to ${email}`, ToastAndroid.LONG);
      }
    } catch (e) {
      setLoading(false);
      setError("Cannot Send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text className="self-start text-xl font-Inter-medium p-4">
            Enter OTP
          </Text>
          <Text className="self-start text-grey pl-4 mb-5">
            A verification email will be sent to your{" "}
            <Text className="text-brand font-Inter-medium text-sm">
              {email}
            </Text>
          </Text>
          <View>
            <Text className="text-red text-sm font-Inter-Black">{error}</Text>
          </View>
          <View>
            <OTPTextInput
              ref={otpInputRef}
              defaultValue={otp}
              inputCount={6}
              tintColor="#0076FC"
              textInputStyle={{
                borderWidth: 1.5,
                borderRadius: 10,
                borderBottomWidth: 1.5,
                paddingHorizontal: 1.6,
                marginHorizontal: 1.5,
              }}
              containerStyle={{ marginHorizontal: 10 }}
              handleTextChange={(val) => setOtp(val)}
            />
          </View>
          <TouchableOpacity
            onPress={() => getClipboardContent()}
            className="flex-row border-brand border  rounded-full items-center py-1 px-2 space-x-2 "
          >
            <MaterialIcons name="content-paste" size={14} color="#0076FC" />

            <Text className=" text-brand text-xs">Paste</Text>
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={() => onResendPress()}
            style={styles.resendButton}
          >
            <Text className="text-base font-Inter-Black text-grey py-5">
              Didn't Receive Code?{" "}
              <Text
                onPress={() => resendOtp()}
                className="text-base font-Inter-medium text-brand"
              >
                Resend Code
              </Text>
            </Text>
          </TouchableOpacity>
          <Pressable
            onPress={verify}
            // onPress={() => console.log(otp)}
            className=" bg-brand  rounded-full px-28 py-4"
          >
            {loading ? (
              <ActivityIndicator color="white" className=" px-4 py-0.5" />
            ) : (
              <Text className="text-base font-Inter-Black text-white ">
                Submit
              </Text>
            )}
          </Pressable>
          <TouchableOpacity onPress={onClose} style={styles.goBackButton}>
            <Text className="text-brand text-base my-2 font-Inter-medium">
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    // padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  subText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 25,
    textAlign: "center",
    fontSize: 18,
  },
  resendButton: {
    marginBottom: 10,
  },
  resendButtonText: {
    color: "#0000ff",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#0000ff",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  goBackButton: {
    padding: 10,
  },
  goBackButtonText: {
    color: "#0000ff",
    textDecorationLine: "underline",
  },
});

export default OtpModel;
