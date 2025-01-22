import { useEffect, useRef, useState } from "react";
import OTPTextView from "react-native-otp-textinput";
import * as Clipboard from "expo-clipboard";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "shared/apis/auth/authApi";
import { apiHandler } from "shared/util/handler";
import { setShowOtpModal } from "store/slices/auth/authSlice";
import { Keyboard } from "react-native";

const useOtpModal = () => {
  const otpInputRef = useRef<OTPTextView>(null);
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isVisible = useAppSelector((state) => state.auth.showOtpModal);
  const email = useAppSelector((state) => state.auth.unverifiedEmail);
  const [verify, { data, isLoading, error }] = useVerifyOtpMutation();
  const [
    resend,
    { data: resendData, isLoading: resendLoading, error: resendError },
  ] = useResendOtpMutation();
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

  useEffect(() => {
    apiHandler({
      data: resendData,
      error: resendError,
      showSuccess: true,
    });
  }, [resendData, resendError]);

  async function getClipboardContent() {
    const clipboardContent = await Clipboard.getStringAsync();
    setOtp(clipboardContent);
    setText(clipboardContent);
  }

  const setText = (val: string) => {
    otpInputRef.current?.setValue(val);
  };

  function verifyOtp() {
    if (email) verify({ otp, email });
    Keyboard.dismiss();
    setErrorMessage(null);
  }

  function resendOtp() {
    if (email) resend(email);
  }

  function closeOtpModal() {
    dispatch(setShowOtpModal(false));
  }

  return {
    setOtp,
    getClipboardContent,
    verifyOtp,
    resendOtp,
    closeOtpModal,
    otpInputRef,
    otp,
    isVisible,
    email,
    loading: isLoading || resendLoading,
    errorMessage,
  };
};

export default useOtpModal;
