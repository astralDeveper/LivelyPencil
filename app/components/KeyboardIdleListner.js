/* USAGE:
      <KeyboardIdleListener onIdle={handleOffline} />

*/

import React, { useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";

const KeyboardIdleListener = ({ onIdle, timeout = 20000 }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = () => {
      // Clear the existing timer, if there is one
      clearTimeout(timerRef.current);

      // Set a new timer
      timerRef.current = setTimeout(() => {
        onIdle();
      }, timeout);
    };

    // Add event listeners
    const keyboardDidShowSubscription = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyPress
    );
    const keyboardDidChangeFrameSubscription = Keyboard.addListener(
      "keyboardDidChangeFrame",
      handleKeyPress
    );
    const keyboardDidHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyPress
    );

    // Cleanup on unmount
    return () => {
      // Remove event listeners and clear any existing timers
      clearTimeout(timerRef.current);
      keyboardDidShowSubscription.remove();
      keyboardDidChangeFrameSubscription.remove();
      keyboardDidHideSubscription.remove();
    };
  }, [onIdle, timeout]);

  return null;
};

export default KeyboardIdleListener;
