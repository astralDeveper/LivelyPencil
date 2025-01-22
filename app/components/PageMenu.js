import { useState } from "react";
import { Pressable } from "react-native";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
// $&
import { useWindowDimensions } from "react-native";

export default function PageMenu({ item, lastpage, handleNavigation }) {
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);
  const { width, height } = useWindowDimensions("screen");

  return (
    <Menu
      className="mt-32 ml-[5%]"
      visible={visible}
      anchor={
        <Pressable
          onPress={showMenu}
          style={{
            width: width / 2,
            height,
          }}
        ></Pressable>
      }
      onRequestClose={hideMenu}
    >
      <MenuItem
        className="items-center "
        onPress={() => {
          handleNavigation(0);
          hideMenu();
        }}
      >
        First Page
      </MenuItem>
      <MenuDivider />
      <MenuItem
        className="items-center"
        onPress={() => {
          handleNavigation();
          hideMenu();
        }}
      >
        Last Page
      </MenuItem>
    </Menu>
  );
}
