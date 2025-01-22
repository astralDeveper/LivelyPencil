import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

let errorMessage = "";

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      // console.warn("We got a rejected action!");
      errorMessage =
        "data" in action.error
          ? (action.error.data as { message: string }).message
          : action.error.message ?? "";
      if (
        typeof action.payload === "object" &&
        action.payload &&
        "data" in action.payload &&
        typeof action.payload.data === "string"
      ) {
        errorMessage = JSON.parse(action.payload.data).message;
      }
      // Alert.alert("Error", errorMessage);
      Alert.alert("ERROR MIDDLEWARE", JSON.stringify(action.payload));
      // console.warn(action);
      // Alert.alert("Error ACTION ERROR", JSON.stringify(action.error));
      // Alert.alert("Error error message", errorMessage);
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    }

    return next(action);
  };
