import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Formik } from "formik";
import useRegister from "./useRegister";
import {
  Button,
  CustomKeyboardScrollView,
  ErrorText,
  Input,
} from "app/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileImageSelector from "app/components/ui/ProfileImageSelector";
import OtpModal from "../OtpModal/OtpModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
export default function Register() {
  const {
    handleSubmitForm,
    validationSchema,
    navigateToSignin,
    navigateToTOS,
    navigateToCameraImage,
    isLoading,
    errorMessage,
  } = useRegister();

  // const [selectedImage, setSelectedImage] = useState(null);

  // const pickImage = async () => {
  //   // Request permissions for accessing media library
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== 'granted') {
  //     alert('Sorry, we need camera roll permissions to make this work!');
  //     return;
  //   }

  //   // Launch the image picker
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only images
  //     allowsEditing: true, // Enable basic cropping
  //     aspect: [4, 3], // Crop aspect ratio
  //     quality: 1, // Maximum quality
  //   });

  //   if (!result.canceled) {
  //     setSelectedImage(result.assets[0].uri); // Save the selected image URI
  //   }
  // };


// console.log("Picture",selectedImage)
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        position: "relative",
        backgroundColor: "#fff",
      }}
    >
      <CustomKeyboardScrollView showsVerticalScrollIndicator={false}>
        {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
        style={{ flex: 1, paddingBottom: 0 }}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        <ScrollView
          className="flex-1 mt-5  relative"
          showsVerticalScrollIndicator={false}
        > */}
        <View className="mx-auto">
          <ProfileImageSelector onNavigate={navigateToCameraImage} />
        </View>
        <Text className="text-brand text-center text-sm">
          Upload Profile Photo
        </Text>
        <View className="mt-4 items-center">
          <Text className="text-brand text-2xl font-Inter-extrabold">
            Create Account
          </Text>
          <Text className="text-base text-textColor2">
            Create a free account to proceed further!
          </Text>
          {/* <Text className="text-Black text-base  font-Inter-Black">
            We Only accepts real information
          </Text> */}
        </View>
        {/* <View className="bg-white  items-center relative rounded-lg  mx-[10%] mt-24 pt-16 pb-8 border-2 border-slate-100 "> */}
        <Formik
          initialValues={{
            email: "",
            password: "",
            full_name: "",
            confirm: "",
          }}
          onSubmit={(values) => handleSubmitForm(values)}
          validationSchema={validationSchema}
          validateOnChange={false}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View>
              {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
              <Input
                value={values.full_name}
                placeholder="Enter Full Name"
                onChangeText={(text) => handleChange("full_name")(text)}
                imageSource="person"
                error={errors.full_name}
              />
              <Input
                value={values.email}
                placeholder="Email"
                onChangeText={(text) => handleChange("email")(text)}
                imageSource="email"
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                value={values.password}
                onChangeText={(text) => handleChange("password")(text)}
                error={errors.password}
                placeholder="Enter Password"
                textContentType="password"
              />
              <Input
                value={values.confirm}
                onChangeText={(text) => handleChange("confirm")(text)}
                error={errors.confirm}
                placeholder="Confirm Password"
                textContentType="password"
              />
              <Button
                label="Register"
                onPress={() => handleSubmit()}
                style={{ marginTop: 24 }}
                loading={isLoading}
              />
            </View>
          )}
        </Formik>
        <View>
          <Text
            style={{ marginVertical: 12 }}
            className="text-base text-center text-textColor2"
          >
            Already have an account?
          </Text>
          <Button
            label="Login"
            onPress={navigateToSignin}
            outlined
            // loading={isLoading}
          />

          <Text
            className="mx-auto text-brand text-sm text-center font-Inter-Black mt-4"
            onPress={navigateToTOS}
          >
            Terms & Conditions | Privacy Policy
          </Text>
        </View>
      </CustomKeyboardScrollView>
      {/* </ScrollView> */}
      {/* </KeyboardAvoidingView> */}
      <OtpModal />
    </SafeAreaView>
  );
}
