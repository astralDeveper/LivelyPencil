// import { useEffect, useState } from "react";
// import { Keyboard } from "react-native";
// import { useForgotPasswordMutation } from "shared/apis/auth/authApi";
// import { apiHandler } from "shared/util/handler";
// import * as Yup from "yup";

// const useForgotPassword = () => {
//   const [sendMail, { data, isLoading, error }] = useForgotPasswordMutation();
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [otpSent, setOtpSent] = useState<boolean>(false);

//   useEffect(() => {
//     apiHandler({
//       data,
//       error,
//       showSuccess: true,
//       onError(response) {
//         if (
//           response &&
//           typeof response === "object" &&
//           "message" in response &&
//           typeof response.message === "string"
//         )
//           setErrorMessage(response.message);
//       },
//       onSuccess(_) {
//         Keyboard.dismiss();
//         setOtpSent(true);
//       },
//     });
//   }, [data, error]);

//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email("Invalid Email").required("Email is required"),
//   });

//   const handleSubmitForm = (data: { email: string }) => {
//     sendMail({ ...data, email: data.email.toLowerCase() });
//   };

//   return {
//     validationSchema,
//     handleSubmitForm,
//     isLoading,
//     errorMessage,
//     otpSent,
//   };
// };

// export default useForgotPassword;


import { useState, useEffect } from "react";
import * as Yup from "yup";
import { Keyboard } from "react-native";
import { useForgotPasswordMutation } from "shared/apis/auth/authApi";
import { apiHandler } from "shared/util/handler";
const useForgotPassword = () => {
  const [sendMail, { data, isLoading, error }] = useForgotPasswordMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);

  useEffect(() => {
    // Handle API responses using the custom apiHandler
    apiHandler({
      data,
      error,
      showSuccess: true,
      onError(response) {
        if (
          response &&
          typeof response === "object" &&
          "message" in response &&
          typeof response.message === "string"
        ) {
          setErrorMessage(response.message);
        }
      },
      onSuccess(_) {
        Keyboard.dismiss();
        setOtpSent(true);
      },
    });
  }, [data, error]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null); // Clear error message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [errorMessage]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email is required"),
  });

  const handleSubmitForm = (data: { email: string }) => {
    sendMail({ ...data, email: data.email.toLowerCase() });
  };

  return {
    validationSchema,
    handleSubmitForm,
    isLoading,
    errorMessage,
    otpSent,
  };
};

export default useForgotPassword;
