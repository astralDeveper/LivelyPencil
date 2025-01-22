import { useEffect, useState } from "react";
import { useLoginMutation } from "app/shared/apis/auth/authApi";
import { apiHandler } from "app/shared/util/handler";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { AuthStackNavigatorProps } from "shared/navigators/AuthStackNavigator";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import { setUnverifiedEmail } from "store/slices/auth/authSlice";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

const useSignIn = () => {
  const auth = useAppSelector((state) => state.auth);
  const { notificationToken } = auth;
  const [doLogin, { error, isLoading, data }] = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const { navigate } = useNavigation<AuthStackNavigatorProps>();

  if (error) {
    Toast.show({
      type: "error",
      text1: "Email or Passwords are not valid",
    });
  }

  useEffect(() => {
    apiHandler({
      data,
      error,
      showSuccess: true,
    });
  }, [data, error]);

  const handleSubmitForm = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    dispatch(setUnverifiedEmail(email.toLowerCase())); // Convert email to lowercase
    doLogin({
      email: email.toLowerCase(),
      password,
      pushNotificationTokens: [notificationToken],
    });
    // Alert.alert("Login server", process.env.EXPO_PUBLIC_API_URL);
    console.log("Notificaton Token [Login Screen]", notificationToken);
  };

  const navigateToRegister = () => navigate("Register");

  const navigateToForgotPassword = () => navigate("ForgotPassword");

  const navigateToTOS = () => navigate("TOS");

  return {
    validationSchema,
    handleSubmitForm,
    isLoading,
    navigateToRegister,
    navigateToForgotPassword,
    navigateToTOS,
    errorMessage,
  };
};

export default useSignIn;
