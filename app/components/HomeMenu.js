import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, Alert } from "react-native";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
// $&
import axios from "axios";
import store from "store";
import { API_URL } from "@env";

export default function HomeMenu() {
  const navigation = useNavigation();
  const { currentUser } = store();
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  // On Logout we remove all expoTokens from pushNotificationList , so there is no misunderstanding of sending token to wrong person from same device
  const Logout = async () => {
    let data = JSON.stringify({
      pushNotificationtokensList: [],
    });
    await axios
      .put(`${API_URL}/users/updateUserById/${currentUser.user.id}`, data, {
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        AsyncStorage.removeItem("user");
        navigation.replace("screens/Login");
      })
      .catch((e) => console.log(e));
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Menu
        visible={visible}
        anchor={
          <Ionicons onPress={showMenu} name="menu" size={32} color="black" />
        }
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={() => navigation.navigate("ContactUs")}>
          Contact Us
        </MenuItem>

        <MenuDivider />
        <MenuItem onPress={() => navigation.navigate("AboutUs")}>
          About Us
        </MenuItem>

        <MenuDivider />

        <MenuItem onPress={() => Logout()}>Logout</MenuItem>
        <MenuDivider />
      </Menu>
    </View>
  );
}
