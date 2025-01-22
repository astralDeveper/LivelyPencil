import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import InAppLogo from "assets/svg/InAppLogo";
import { useState } from "react";
import { Formik } from "formik";

import useSignIn from "./useSignIn";
import { Button, ErrorText, Input, Text } from "app/components/ui";
import { Image } from "expo-image";
import OtpModal from "../OtpModal/OtpModal";
import useSafeAreaInsets from "shared/hooks/useSafeArea";

export default function SignIn() {
  const {
    handleSubmitForm,
    validationSchema,
    isLoading,
    navigateToForgotPassword,
    navigateToRegister,
    navigateToTOS,
    errorMessage,
  } = useSignIn();
  const { top } = useSafeAreaInsets();

  // const onSubmit = async (data) => {
  //   setEmail(data?.email);
  //   // await delay();
  //   await axios
  //     .post(`${API_URL}/auth/login`, {
  //       email: data.email,
  //       password: data.password,
  //       pushNotificationTokens: [expoPushToken],
  //     })
  //     .then(function (response) {
  //       setCurrentUser(response.data);
  //       setIsAuth(true);
  //       router.replace("screens/Home");
  //     })
  //     .catch((e) => {
  //       // if user not verified statusCode = 449

  //       if (e.response.data.code === 449) {
  //         setVerifyVisible(true);
  //         // router.push({
  //         //   pathname: "screens/Otp",
  //         //   params: { email: data.email },
  //         // });
  //         // } else Alert.alert("Login Failed", "Incorrect Email or Password");
  //       } else toggleAlert();
  //     });
  // };

  // useEffect(() => {
  //   const checkOnboarding = async () => {
  //     const onboardingCompleted = await AsyncStorage.getItem(
  //       "onboardingCompleted"
  //     );
  //     if (onboardingCompleted !== "true") {
  //       setShowOnboarding(true);
  //     }
  //   };

  //   checkOnboarding();
  // }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: top,
      }}
    >
      {/* <OtpModel isVisible={verifyVisible} onClose={toggleOtp} email={email} /> */}

      {/* <AlertBox
        title="Login Failed"
        body1="Incorrect Email or Password"
        button1Text="OK"
        visible={alertVisible}
        onClose={toggleAlert}
        // optionalImage={require("assets/images/sad.png")}
      /> */}
      <View className="items-center">
        <Image
          source={require("assets/images/icon.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>
      <View className="mt-8 items-center mx-auto ">
        <Text className="text-[#376ccd]  text-3xl font-Inter-extrabold text-center">
          Welcome Back!
        </Text>
      </View>
      <Text className="text-grey font-Inter-Black mx-auto text-sm mt-2 mb-2">
        Log in to your LivelyPencil account
      </Text>
      {/* <View className="mx-auto"></View> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, paddingHorizontal: 20 }}
      >
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => handleSubmitForm(values)}
          validationSchema={validationSchema}
          validateOnChange={false}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <View>
              {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
              <Input
                value={values.email}
                onChangeText={(text) => handleChange("email")(text)}
                imageSource="email"
                error={errors.email}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                value={values.password}
                onChangeText={(text) => handleChange("password")(text)}
                error={errors.password}
                placeholder="********"
                textContentType="password"
              />
              <Text
                onPress={navigateToForgotPassword}
                className="self-end text-brand text-sm mb-6 text-center mt-4"
              >
                Forgot Password?
              </Text>
              <Button
                label="Log In"
                onPress={() => handleSubmit()}
                loading={isLoading}
              />
            </View>
          )}
        </Formik>
        <Text className="text-grey mx-auto text-lg mt-2 my-4">
          Create an account
        </Text>
        <Button label="Register" outlined onPress={navigateToRegister} />
      </KeyboardAvoidingView>
      <View className=" ">
        <Text
          className="mx-auto text-brand text-sm text-center font-Inter-Black mt-6"
          onPress={navigateToTOS}
        >
          Terms & Conditions | Privacy Policy
        </Text>
      </View>
      <OtpModal />
    </ScrollView>
  );
}
