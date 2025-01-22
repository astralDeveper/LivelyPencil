import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { AuthStackNavigatorProps } from "shared/navigators/AuthStackNavigator";
import { setProfileImage } from "store/slices/auth/authSlice";
import { useAppDispatch } from "shared/hooks/useRedux";
// $&
// import store from "store";

export default function CameraImage() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [cameraRef, setCameraRef] = useState(null);
  const { goBack } = useNavigation<AuthStackNavigatorProps>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const _takePhoto = async () => {
    // setSourceCamera(true);
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      dispatch(setProfileImage(photo.uri));

      goBack();
    }
  };
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        // marginTop: StatusBar.currentHeight || 0,
      }}
    >
      <View
        className="w-52 h-52  relative
       overflow-hidden border-Primary/20 border-4 rounded-full "
      >
        <Camera
          className="w-52 h-52 rounded-full "
          type={type}
          ref={(ref) => setCameraRef(ref)}
        ></Camera>
      </View>
      <View className="flex-row space-x-2 ml-4  justify-evenly  ">
        <TouchableOpacity
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
          className="bg-white   rounded-lg mt-5 border-2 border-Primary"
        >
          <Text className="text-black p-2 text-xs">Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_takePhoto}
          className="bg-white border-2 border-Primary   rounded-lg mt-5"
        >
          <Text className="text-black p-2 text-xs">Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goBack}
          className="bg-white border-2 border-Primary   rounded-lg mt-5"
        >
          <Text className="text-black p-2 text-xs">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
