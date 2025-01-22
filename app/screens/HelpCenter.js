import * as React from "react";
import { WebView } from "react-native-webview";

export default function App() {
  return (
    <>
      <WebView
        className="flex-1 mt-10"
        source={{ uri: "https://help.livelypencil.com/" }}
      />
    </>
  );
}
