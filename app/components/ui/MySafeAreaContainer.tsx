import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MySafeAreaContainer(props: ViewProps): JSX.Element {
  const { top } = useSafeAreaInsets();
  return (
    <View
      {...props}
      style={[
        { paddingTop: top > 20 ? top : 10, backgroundColor: "#fff", flex: 1 },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
}
