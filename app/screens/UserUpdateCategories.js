import { View, Text, StyleSheet } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

export function UserUpdateCategories({ selected, setSelected, categories }) {
  return (
    <View className="   ml-5 mt-5 z-30 bg-white pb-16">
      <Text className="py-2 text-sm font-Inter-Black">Change Categories</Text>

      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        search
        data={categories}
        labelField="label"
        valueField="value"
        placeholder="Select Categories"
        searchPlaceholder="Search Category"
        value={selected}
        activeColor="#EAEDED"
        onChange={(item) => {
          setSelected(item);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={selected.length == 0 ? "black" : "green"}
            name="Safety"
            size={20}
          />
        )}
        selectedStyle={styles.selectedStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // container: { padding: 16 },
  dropdown: {
    width: 300,
    height: 50,
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    color: "#BDBDBD",
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    fontSize: 14,
    padding: 2,
    marginHorizontal: 2,
    borderRadius: 24,
    borderColor: "#BDBDBD",
    borderWidth: 1,
  },
});
