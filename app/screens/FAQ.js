import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
// $&

export const FAQ = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <WebView source={{ uri: "https://help.livelypencil.com" }} />
    </SafeAreaView>
  );
};
