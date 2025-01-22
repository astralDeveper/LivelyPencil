import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import OTPTextInput from "react-native-otp-textinput";
import { MaterialIcons } from "@expo/vector-icons";
import useOtpModal from "./useOtpModal";
import { ErrorText } from "app/components/ui";

const OtpModal = () => {
  const {
    getClipboardContent,
    setOtp,
    verifyOtp,
    resendOtp,
    closeOtpModal,
    otp,
    otpInputRef,
    email,
    isVisible,
    loading,
    errorMessage,
  } = useOtpModal();

  const { width, height } = useWindowDimensions();

  return (
    <>
      <View
        style={{
          position: "absolute",
          width: isVisible ? width : 0,
          height,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      />
      <Modal animationType="slide" transparent={true} visible={isVisible}>
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
              {errorMessage && (
                <ErrorText className="ml-4">{errorMessage}</ErrorText>
              )}
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
              onPress={getClipboardContent}
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
                  onPress={resendOtp}
                  className="text-base font-Inter-medium text-brand"
                >
                  Resend Code
                </Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={verifyOtp}
              className=" bg-brand  rounded-full px-28 py-4"
            >
              {loading ? (
                <ActivityIndicator color="white" className=" px-4 py-0.5" />
              ) : (
                <Text className="text-base font-Inter-Black text-white ">
                  Submit
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={closeOtpModal}
            >
              <Text className="text-brand text-base my-2 font-Inter-medium">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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

export default OtpModal;
