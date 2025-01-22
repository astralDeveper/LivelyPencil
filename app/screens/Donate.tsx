import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
// $&

export const Donate = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <WebView
        source={{
          uri: "https://www.paypal.com/donate/?hosted_button_id=LX2SK9MXRSH2Y",
        }}
      />
    </SafeAreaView>
  );
};
