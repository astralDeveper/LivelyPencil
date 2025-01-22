import React, { useState, useEffect } from "react";
import { Button, View, Platform, Pressable, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import clsx from "clsx";
// $&
// import store from "store";
import { Image } from "expo-image";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import { setProfileImage } from "store/slices/auth/authSlice";

type ProfileImageSelectorProps = {
  onNavigate: () => void;
};

export default function ProfileImageSelector({
  onNavigate,
}: ProfileImageSelectorProps) {
  const profileImage = useAppSelector((state) => state.auth.profileImageUrl);
  const disaptch = useAppDispatch();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
      });

    if (result && result.assets && result.assets?.length > 0) {
      disaptch(setProfileImage(result.assets[0].uri));
    }
  };

  const removeImage = () => {
    disaptch(setProfileImage(null));
  };

  return (
    <View className=" items-center rounded-full w-28 h-28 overflow-hidden">
      <Pressable
        // onPress={() => pickImage()}
        onPress={() =>
          Alert.alert(
            "Set Profile Photo",
            "Please Select Camera or Gallery",
            [
              {
                text: "Gallery",
                onPress: pickImage,
              },
              {
                text: "Remove Image",
                onPress: removeImage,
              },
            ],
            { cancelable: true }
          )
        }
        style={{ backgroundColor: profileImage ? "white" : "#e7f2fa" }}
        // style={{ backgroundColor: "#e7f2fa" }}
        className="flex-1 bg-Primary w-full h-full items-center justify-center   rounded-full  overflow-hidden"
      >
        <View className="  justify-center rounded-full  items-center ">
          {profileImage ? (
            <Image
              className="w-[100] h-[100] rounded-full self-center justify-center"
              source={{
                uri: profileImage,
              }}
              // style={{
              //   transform: sourceCamera ? "scaleX(-1)" : "none",
              // }}
              contentFit="cover"
              cachePolicy="none"
            />
          ) : (
            <Feather name="upload" size={32} color="#0076FC" />
          )}
        </View>
      </Pressable>
    </View>
  );
}
