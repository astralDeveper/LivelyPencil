import React, { useState, useEffect } from "react";
import { Button, View, Platform, Pressable, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import clsx from "clsx";
// $&
// import store from "store";
import { Image } from "expo-image";

export default function ProfileImage() {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    });
    // console.log(result.assets[0].uri);

    if (result.assets?.length > 0) {
      setSourceCamera(false);
      // setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View className=" items-center    rounded-full w-28 h-28    overflow-hidden">
      <Pressable
        // onPress={() => pickImage()}
        onPress={() =>
          Alert.alert(
            "Set Profile Photo",
            "Please Select Camera or Gallery",
            [
              {
                text: "Camera",
                // onPress: () => router.push("components/CameraImage"),
              },
              {
                text: "Gallery",
                onPress: () => pickImage(),
              },
            ],
            { cancelable: true }
          )
        }
        style={{ backgroundColor: profileImage ? "white" : "#e7f2fa" }}
        // style={{ backgroundColor: "#e7f2fa" }}
        className="flex-1 bg-Primary w-full h-full items-center justify-center   rounded-full  overflow-hidden"
      >
        <View className="  justify-center mt-4 rounded-full  items-center ">
          <Feather name="upload" size={32} color="#0076FC" />

          {/* <Text className=" font-Inter-bold text-white text-md text-center ">
              Writer{"\n"}Pro
            </Text> */}
        </View>
        {/* {profileImage && (
          <Image
            className="w-[100] h-[100] rounded-full self-center justify-center"
            source={{ uri: profileImage }}
            style={{
              transform: sourceCamera ? "scaleX(-1)" : "none",
            }}
            contentFit="cover"
            cachePolicy="none"
          />
        )} */}
      </Pressable>
    </View>
  );
}
