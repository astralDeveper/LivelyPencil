import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";

import { View, Text } from "react-native";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";

export default function UserMenu() {
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  return (
    <View
      style={{ height: "100%", alignItems: "center", justifyContent: "center" }}
    >
      <Menu
        visible={visible}
        anchor={
          <Entypo
            onPress={showMenu}
            name="dots-three-vertical"
            size={24}
            color="gray"
          />
        }
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={hideMenu}>Report</MenuItem>
        <MenuDivider />
        <MenuItem onPress={hideMenu}>Block</MenuItem>
      </Menu>
    </View>
  );
}
