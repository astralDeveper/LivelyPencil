import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useContext } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { SocketContext } from "screens/Socket/SocketProvider";

export interface APIResponse {
  status: "Success" | "Error" | "ValidationError";
  code: number;
  error: ValidationErrorSchemaInterface[] | string;
  message: string;
  data: any;
}

export interface ValidationErrorSchemaInterface {
  [key: string]: string | string[];
}

export interface APIError {
  data: APIResponse | string;
  error: string;
  originalStatus: number;
  status: string;
}

interface HandlersInterface {
  error?: FetchBaseQueryError | SerializedError | undefined;
  setError?: (data: any) => void;
  onError?: (response: any) => void;
  onSuccess?: (response: any) => void;
  data?: APIResponse;
  showSuccess?: boolean;
}

export const apiHandler = (options: HandlersInterface) => {
  const {
    error,
    data: successData,
    setError,
    onSuccess,
    onError,
    showSuccess,
  } = options;

  if (error) {
    const { data } = error as any;
    const { status } = error as any;

    // Alert.alert("ERROR", JSON.stringify(error));
    // console.log(JSON.parse(error.error));

    try {
      const response = JSON.parse(data) as APIResponse;
      // Alert.alert("ERROR TRY STRINGIFY RESPONSE", JSON.stringify(response));
      const { code, message } = response;
      // Alert.alert("error", error);

      if ([500, 502].includes(code)) {
        Toast.show({ type: "error", text1: response.message });
      } else {
        if (status) {
          if (
            status === "ValidationError" &&
            setError &&
            typeof message === "object"
          ) {
            setError(message);

            onError && onError(response);
          } else if (status === "Error") {
            if (typeof message === "string") {
              Alert.alert("Error", message);
              onError && onError(response);
            } else if (typeof message === "object") {
              Object.keys(message).forEach((key) => {
                let errorMessage = message[key as keyof typeof message];
                Alert.alert(
                  "Error",
                  typeof errorMessage === "string"
                    ? message
                    : message[0 as keyof typeof message]
                );
                return;
              });
              onError && onError(response);
            }
          } else {
            Toast.show({ type: "error", text1: response.message });
            onError && onError(response);
          }
        } else {
          Toast.show({ type: "error", text1: response.message });
          onError && onError(response);
        }
      }
    } catch (e) {
      Alert.alert("Error CATCH HANDLER", JSON.stringify(e));
      // Toast.show({
      // type: "error",
      // text1: "ERROR LOGIN FROM CATCH BLOCK ",
      // });
      return;
    }
  }

  if (successData) {
    showSuccess && Toast.show({ type: "success", text1: successData.message });
    onSuccess && onSuccess(successData);
  }
};
