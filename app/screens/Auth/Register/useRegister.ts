import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useRegisterMutation } from "app/shared/apis/auth/authApi";
import { AuthStackNavigatorProps } from "app/shared/navigators/AuthStackNavigator";
import { apiHandler } from "app/shared/util/handler";
import * as Yup from "yup";
import { registerForPushNotificationsAsync } from "app/components/NotificationsManager";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import { setUnverifiedEmail } from "store/slices/auth/authSlice";
import { IRegisterPayload } from "shared/types/auth/authApi.type";
import { Alert, Keyboard } from "react-native";
import axios from "axios";

type IRegisterUser = {
  email: string;
  password: string;
  full_name: string;
};

const useRegister = () => {
  const { navigate } = useNavigation<AuthStackNavigatorProps>();
  const [registerUser, { data, isLoading, error }] = useRegisterMutation();
  const [expoPushToken, setExpoPushToken] = useState("");
  const profileImageUrl = useAppSelector((state) => state.auth.profileImageUrl);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
    
    useEffect(() => {
       

    apiHandler({
      data,
      error,
      onError(response) {
        if ("message" in response && typeof response.message === "string") {
          setErrorMessage(response.message);
        }
      },
    });
  }, [data, error]);



  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must contain at least 8 characters")
      .matches(/[0-9]/, "Password must contain at least 1 number")
      .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter"),
    confirm: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmitForm = async(data: IRegisterUser) => {
    // setErrorMessage(null);
  if(!profileImageUrl){
// Toast.show({
//   type:"error",
//   text1:"Please provide a picture"
// })
Alert.alert("Info","Please Provide Image")
  }


    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', {
        uri: profileImageUrl, // The local URI of the file
        name: 'profileImage.jpg', // Replace with the actual file name
        type: 'image/jpeg', // Replace with the MIME type of the file
      });
    
      const response = await axios.post(
        "https://api.livelypencil.com/dev/v1/s3/addMedia",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Required for FormData
          },
        }
      );
    
      if (response?.data) { 
        
    dispatch(setUnverifiedEmail(data.email));
   
    const formData: IRegisterPayload = {
      fullName: data.full_name,
      email: data.email,
      password: data.password,
      profilePicture: response?.data,
      
    }; 
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
    if (profileImageUrl) {
      let localUri = profileImageUrl;
      let filename = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename ?? "");
      let type = match ? `image/${match[1]}` : `image`;

      if (filename && type)
        formData.file = { uri: localUri, name: filename, type };
    }
    if (expoPushToken) formData.pushNotificationTokens = [expoPushToken];

    registerUser(formData);
    Keyboard.dismiss();
        // setPreconditionSuccess(true);
      } 
    } catch (err) {
      console.log("Failed to verify precondition", err);
      // setErrorMessage("Failed to verify precondition");
    }
    

    
  };

  const navigateToSignin = () => navigate("SignIn");

  const navigateToTOS = () => navigate("TOS");

  const navigateToCameraImage = () => navigate("CameraImage");

  return {
    validationSchema,
    handleSubmitForm,
    navigateToSignin,
    navigateToTOS,
    navigateToCameraImage,
    isLoading,
    errorMessage,
  };
};

export default useRegister;













// import { useNavigation } from "@react-navigation/native";
// import { useEffect, useState } from "react";
// import { useRegisterMutation } from "app/shared/apis/auth/authApi";
// import { AuthStackNavigatorProps } from "app/shared/navigators/AuthStackNavigator";
// import { apiHandler } from "app/shared/util/handler";
// import * as Yup from "yup";
// import { registerForPushNotificationsAsync } from "app/components/NotificationsManager";
// import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
// import { setUnverifiedEmail } from "store/slices/auth/authSlice";
// import { IRegisterPayload } from "shared/types/auth/authApi.type";
// import { Keyboard } from "react-native";
// import axios from "axios";

// type IRegisterUser = {
//   email: string;
//   password: string;
//   full_name: string;
// };

// const useRegister = () => {
//   const { navigate } = useNavigation<AuthStackNavigatorProps>();
//   const [registerUser, { data, isLoading, error }] = useRegisterMutation();
//   const [expoPushToken, setExpoPushToken] = useState("");
//   const profileImageUrl = useAppSelector((state) => state.auth.profileImageUrl);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [preconditionSuccess, setPreconditionSuccess] = useState(false);
//   const [isPreconditionLoading, setPreconditionLoading] = useState(true);
//   const dispatch = useAppDispatch();


//    // API handler for registering the user
//   useEffect(() => {
//     checkPrecondition()

//     // apiHandler({
//     //   data,
//     //   error,
//     //   onError(response) {
//     //     if ("message" in response && typeof response.message === "string") {
//     //       setErrorMessage(response.message);
//     //     }
//     //   },
//     // });
//   }, [data, error,profileImageUrl]);

//     const checkPrecondition = async () => {
//       try {
//         // setPreconditionLoading(true);
//         const response = await axios.post(
//           "https://api.livelypencil.com/dev/v1/s3/addMedia",
//           {
//             // Replace this payload with actual required fields
//             file: profileImageUrl,
//           }
//         );
//         if (response) {
//           // setPreconditionSuccess(true);
//           console.log("FOrpic",response)
//         } else {
//           // setErrorMessage(response.data?.message || "Precondition failed");
//         }
//       } catch (err) {
//         // setErrorMessage("Failed to verify precondition");
//       } 
//     };



 

//   // Validation schema for registration form
//   const validationSchema = Yup.object().shape({
//     full_name: Yup.string().required("Full name is required"),
//     email: Yup.string().email("Invalid Email").required("Email is required"),
//     password: Yup.string()
//       .required("Password is required")
//       .min(8, "Password must contain at least 8 characters")
//       .matches(/[0-9]/, "Password must contain at least 1 number")
//       .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
//       .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter"),
//     confirm: Yup.string()
//       .oneOf([Yup.ref("password")], "Passwords must match")
//       .required("Confirm password is required"),
//   });

//   // Handle form submission
//   const handleSubmitForm = (data: IRegisterUser) => {
//     // if (!preconditionSuccess) {
//     //   setErrorMessage("Precondition not met. Cannot submit form.");
//     //   return;
//     // }

//     dispatch(setUnverifiedEmail(data.email));

//     const formData: IRegisterPayload = {
//       fullName: data.full_name,
//       email: data.email,
//       password: data.password,
//       profilePicture: profileImageUrl,
//     };

//     registerForPushNotificationsAsync().then((token) =>
//       setExpoPushToken(token)
//     );

//     if (profileImageUrl) {
//       let localUri = profileImageUrl;
//       let filename = localUri.split("/").pop();
//       let match = /\.(\w+)$/.exec(filename ?? "");
//       let type = match ? `image/${match[1]}` : `image`;

//       if (filename && type)
//         formData.file = { uri: localUri, name: filename, type };
//     }
//     if (expoPushToken) formData.pushNotificationTokens = [expoPushToken];

//     registerUser(formData);
//     Keyboard.dismiss();
//   };

//   // Navigation functions
//   const navigateToSignin = () => navigate("SignIn");
//   const navigateToTOS = () => navigate("TOS");
//   const navigateToCameraImage = () => navigate("CameraImage");

//   return {
//     validationSchema,
//     handleSubmitForm,
//     navigateToSignin,
//     navigateToTOS,
//     navigateToCameraImage,
//     isLoading: isLoading ,
//     errorMessage,
//   };
// };

// export default useRegister;
