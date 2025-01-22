import React, { useEffect, useState } from "react";
import Onboarding from "react-native-onboarding-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useAppDispatch } from "shared/hooks/useRedux";
import { setShowOnBoarding } from "store/slices/auth/authSlice";

const OnboardingScreen = () => {
  const dispatch = useAppDispatch();

  const onDone = async () => {
    dispatch(setShowOnBoarding(false));
  };

  return (
    <Onboarding
      pages={[
        {
          backgroundColor: "#fff",
          image: (
            <Image
              style={{ width: "100%", height: "100%" }}
              source={require("assets/sample/img1.png")}
              contentFit="cover"
            />
          ),
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              style={{ width: "100%", height: "100%" }}
              source={require("assets/sample/img2.png")}
              contentFit="cover"
            />
          ),
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              style={{ width: "100%", height: "100%" }}
              source={require("assets/sample/img3.png")}
              contentFit="cover"
            />
          ),
        },
      ]}
      onDone={onDone}
      onSkip={onDone}
    />
  );
};

export default OnboardingScreen;
