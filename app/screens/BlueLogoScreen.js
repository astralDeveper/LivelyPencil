import { StatusBar, View, Image, SafeAreaView } from "react-native";

const BlueLogoScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#0076FC" }}>
      <StatusBar backgroundColor="#0076FC" translucent={true} />
      <Image
        source={require("assets/images/splash-blue.png")}
        resizeMode="cover"
        style={{ flex: 1, alignSelf: "center", marginBottom: "10%" }}
      />
    </View>
  );
};

export default BlueLogoScreen;
