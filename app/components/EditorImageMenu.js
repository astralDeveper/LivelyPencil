//Note: NOT USING THIS COMPONENT ANYWHERE

import { Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import store from "store";
import { View, Text, StyleSheet } from "react-native";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { API_URL } from "@env";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export function EditorImageMenu({
  richText,
  setCamAspect,
  setShowCamera,
  setImgInserted,
}) {
  const { currentUser, pageText } = store();

  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const croppedImage = async (aspectRatio) => {
    if ((pageText.match(/<img /g) || []).length == "1") {
      Alert.alert("Limit Reached", "Media is taking almost 70% of text space");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: aspectRatio ? true : false,
      // For Full Size we don't need ascpect ration so we need || undefined
      aspect: aspectRatio || undefined,
    });
    if (result.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    if (result.canceled) {
      return;
    }

    let formData = new FormData();
    let localUri = result.assets[0].uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Add the image data to the form data
    formData.append("file", { uri: localUri, name: filename, type });
    axios({
      method: "post",
      url: `${API_URL}/s3/addMedia/`,
      data: formData,
      headers: {
        Authorization: `Bearer ${currentUser.tokens.access.token}`, // assuming it's a Bearer token
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        console.log(response.data.fileKey);
        // richText.current?.insertImage(
        //   `${API_URL}/s3/getMedia/` + response.data.fileKey
        // );
        if (response.data.fileKey.split(".")[1] === "mp4") {
          richText.current?.insertVideo(
            // `${API_URL}/s3/getMedia/` + response.data.fileKey
            `${process.env.S3}/` + response.data.fileKey
          );
          return;
        }
        richText.current?.insertImage(
          // `${API_URL}/s3/getMedia/` + response.data.fileKey
          `${process.env.S3}/` + response.data.fileKey
        );
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };
  // to select either gallery or camera
  // function selectSource(aspectRatio) {
  //   Alert.alert(
  //     "Pick Source",
  //     "You can select Media from Gallery or Select Camera",
  //     [
  //       { text: "Cancel", onPress: () => {} },
  //       { text: "Camera", onPress: () => setShowCamera(true) },
  //       { text: "Gallery", onPress: () => croppedImage(aspectRatio) },
  //     ],
  //     { cancelable: true }
  //   );
  // }

  return (
    <View>
      <Menu
        style={styles.menu}
        className="absolute" //Note: change to absolute if
        animationDuration={300}
        visible={visible}
        anchor={
          <Ionicons
            onPress={showMenu}
            name="images-outline"
            size={28}
            color="black"
          />
        }
        onRequestClose={hideMenu}
      >
        <MenuItem
          style={styles.menuItem}
          textStyle={styles.textStyle}
          onPress={() => {
            croppedImage();
            setCamAspect("16:9");
            setImgInserted("full");
            hideMenu();
          }}
        >
          Full
        </MenuItem>
        <MenuDivider />
        <MenuItem
          style={styles.menuItem}
          textStyle={styles.textStyle}
          onPress={() => {
            setCamAspect("1:1");
            croppedImage([1, 1]);
            setImgInserted("square");
            hideMenu();
          }}
        >
          Square
        </MenuItem>
        <MenuDivider />
        <MenuItem
          style={styles.menuItem}
          textStyle={styles.textStyle}
          onPress={() => {
            setCamAspect("3:4");
            croppedImage([3, 4]);
            setImgInserted("portrait");
            hideMenu();
          }}
        >
          Portrait
        </MenuItem>
      </Menu>
    </View>
  );
}
const styles = StyleSheet.create({
  richTextContainer: {
    display: "flex-1",

    flexDirection: "column-reverse",
    width: "100%",
    marginBottom: 10,
  },
  menu: {
    overflow: "hidden",
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: "white",
  },
  textStyle: {
    backgroundColor: "#33CC99",
    marginHorizontal: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "white",
    fontWeight: "500",
    fontSize: 20,
  },
  menuItem: { backgroundColor: "#E6E6E6", borderColor: "white" },
  //camera
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
