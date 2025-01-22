/**
 * Usage :
 *       <AppStateListener onBackground={handleOffline} />
 */

import React, { useEffect } from "react";
import { AppState } from "react-native";
// import { flags } from "store";

const AppStateListener = ({ onBackground }) => {
  // const { pickImgFlag } = flags();
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      // if (nextAppState === "background" && !pickImgFlag) {
      if (nextAppState === "inactive") {
        onBackground();
      }
    };

    // Subscribe to AppState changes
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup on unmount
    return () => {
      // Unsubscribe from AppState changes
      appStateSubscription.remove();
    };
    // }, [onBackground, pickImgFlag]);
  }, [onBackground]);

  return null;
};

export default AppStateListener;
