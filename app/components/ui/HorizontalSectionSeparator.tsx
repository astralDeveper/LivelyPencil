import { View, ViewProps } from "react-native";

const Separator = (props: ViewProps): JSX.Element => {
  return (
    <View
      {...props}
      style={[
        {
          width: 2,
          height: 20,
          backgroundColor: "#D2D4DA",
          marginHorizontal: 12,
        },
        props.style,
      ]}
    />
  );
};

export default Separator;
