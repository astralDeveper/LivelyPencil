// import { Button, ErrorText, Input, Text } from "app/components/ui";
// import LockSvg from "assets/svg/Lock";
// import { View } from "react-native";
// import useForgotPassword from "./useForgotPassword";
// import { Formik } from "formik";
// import { SafeAreaView } from "react-native-safe-area-context";
// import useRegister from "../Register/useRegister";

// const ForgotPassword = (): JSX.Element => {
//   const {
//     handleSubmitForm,
//     validationSchema,
//     isLoading,
//     errorMessage,
//     otpSent,
//   } = useForgotPassword();

//   const { navigateToTOS } = useRegister();


//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         position: "relative",
//         backgroundColor: "#fff",
//         paddingHorizontal: 20,
//         // marginTop: StatusBar.currentHeight || 0,
//       }}
//     >
//       <View className="  items-center ">
//         <LockSvg />
//       </View>
//       <View className="flex-1">
//         <View className=" items-center my-4">
//           <Text className="text-brand text-2xl font-Inter-bold ">
//             Forgot Password
//           </Text>
//           <Text className="text-textColor2 font-Inter-Black text-sm text-center mx-5">
//             {otpSent
//               ? "An otp has been sent to your provided email"
//               : "Please provide your registered email address to receive the verification email"}
//           </Text>
//         </View>
//         <Formik
//           initialValues={{ email: "" }}
//           onSubmit={(values) => handleSubmitForm(values)}
//           validationSchema={validationSchema}
//           validateOnChange={false}
//         >
//           {({ handleChange, handleSubmit, values, errors }) => (
//             <View>
//               {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            
//               <Input
//                 value={values.email}
//                 onChangeText={(text) => handleChange("email")(text)}
//                 imageSource="email"
//                 error={errors.email}
//                 placeholder="Email"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//               <Button
//                 label="Send Mail"
//                 className="mt-8"
//                 loading={isLoading}
//                 onPress={() => handleSubmit()}
//               />
//             </View>
//           )}
//         </Formik>
//         {/* <Text className="ml-5 text-red text-xs font-Inter-Black">
//             {emailError}
//           </Text> */}
//         {/* <View
//             style={{
//               borderColor: emailFocus ? "#0076FC" : "transparent",
//             }}
//             className="flex-row  rounded-lg 
//        border-2 overflow-hidden items-center bg-textField justify-between mx-4"
//           >
//             <TextInput
//               autoComplete="off"
//               underlineColorAndroid="transparent"
//               onFocus={() => setEmailFocus(true)}
//               onBlur={() => setEmailFocus(false)}
//               className="text-sm font-Inter-Black  w-[80%] p-3"
//               onChangeText={handleEmail}
//               value={email}
//               placeholder="Enter your Email-Address"
//             />

//             <View className="flex-grow items-center">
//               <Email stroke={emailFocus ? "#0076FC" : "lightgray"} />
//             </View>
//           </View> */}

//         {/* <Pressable
//             onPress={() => forgotPass()}
//             className=" bg-brand -bottom-5 rounded-full mx-auto items-center py-3 w-[60%]"
//           >
//             {loading ? (
//               <ActivityIndicator color="white" />
//             ) : (
//               <Text className="text-white text-sm font-Inter-medium ">
//                 Send Mail
//               </Text>
//             )}
//           </Pressable> */}
//       </View>

//       <Text
//         className="mx-auto text-brand text-sm text-center font-Inter-Black my-4"
//         onPress={navigateToTOS}
//       >
//         Terms & Conditions | Privacy Policy
//       </Text>
//     </SafeAreaView>
//   );
// };

// export default ForgotPassword;



import { Button, ErrorText, Input, Text } from "app/components/ui";
import LockSvg from "assets/svg/Lock";
import { View } from "react-native";
import useForgotPassword from "./useForgotPassword";
import { Formik } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";
import useRegister from "../Register/useRegister";

const ForgotPassword = (): JSX.Element => {
  const {
    handleSubmitForm,
    validationSchema,
    isLoading,
    errorMessage,
    otpSent,
  } = useForgotPassword();

  const { navigateToTOS } = useRegister();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
      }}
    >
      <View className="items-center">
        <LockSvg />
      </View>
      <View className="flex-1">
        <View className="items-center my-4">
        {!otpSent &&
          <Text className="text-brand text-2xl font-Inter-bold">
            Forgot Password
          </Text>
}
          <Text className="text-textColor2 font-Inter-Black text-sm text-center mx-5">
            {otpSent
              ? 
              <Text className="text-brand text-2xl font-Inter-bold">
              "An OTP has been sent to your provided email."
              </Text>
              : "Please provide your registered email address to receive the verification email."}
          </Text>
        </View>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={(values) => handleSubmitForm(values)}
          validationSchema={validationSchema}
          validateOnChange={false}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <View>
              {/* Show error message */}
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
              <Button
                label="Send Mail"
                className="mt-8"
                loading={isLoading}
                onPress={() => handleSubmit()}
              />
            </View>
          )}
        </Formik>
      </View>

      <Text
        className="mx-auto text-brand text-sm text-center font-Inter-Black my-4"
        onPress={navigateToTOS}
      >
        Terms & Conditions | Privacy Policy
      </Text>
    </SafeAreaView>
  );
};

export default ForgotPassword;
















// import React, { useEffect } from "react";
// import { Button, ErrorText, Input, Text } from "app/components/ui";
// import LockSvg from "assets/svg/Lock";
// import { View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Formik } from "formik";
// import useForgotPassword from "./useForgotPassword";
// import useRegister from "../Register/useRegister";

// const ForgotPassword = (): JSX.Element => {
//   const {
//     handleSubmitForm,
//     validationSchema,
//     isLoading,
//     errorMessage,
//     setErrorMessage, // Ensure this function is available
//     otpSent,
//   } = useForgotPassword();

//   const { navigateToTOS } = useRegister();

//   // Automatically clear the error message after 3 seconds
//   useEffect(() => {
//     if (errorMessage) {
//       const timer = setTimeout(() => {
//         setErrorMessage(""); // Clear the error message
//       }, 3000);

//       return () => clearTimeout(timer); // Cleanup timeout on unmount
//     }
//   }, [errorMessage, setErrorMessage]);

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: "#fff",
//         paddingHorizontal: 20,
//       }}
//     >
//       <View className="items-center">
//         <LockSvg />
//       </View>
//       <View className="flex-1">
//         <View className="items-center my-4">
//           <Text className="text-brand text-2xl font-Inter-bold">
//             Forgot Password
//           </Text>
//           <Text className="text-textColor2 font-Inter-Black text-sm text-center mx-5">
//             {otpSent
//               ? "An OTP has been sent to your provided email."
//               : "Please provide your registered email address to receive the verification email."}
//           </Text>
//         </View>
//         <Formik
//           initialValues={{ email: "" }}
//           onSubmit={(values) => handleSubmitForm(values)}
//           validationSchema={validationSchema}
//           validateOnChange={false}
//         >
//           {({ handleChange, handleSubmit, values, errors }) => (
//             <View>
//               {/* Display the error message */}
//               {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

//               <Input
//                 value={values.email}
//                 onChangeText={(text) => handleChange("email")(text)}
//                 imageSource="email"
//                 error={errors.email}
//                 placeholder="Email"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//               <Button
//                 label="Send Mail"
//                 className="mt-8"
//                 loading={isLoading}
//                 onPress={() => handleSubmit()}
//               />
//             </View>
//           )}
//         </Formik>
//       </View>
//       <Text
//         className="mx-auto text-brand text-sm text-center font-Inter-Black my-4"
//         onPress={navigateToTOS}
//       >
//         Terms & Conditions | Privacy Policy
//       </Text>
//     </SafeAreaView>
//   );
// };

// export default ForgotPassword;
