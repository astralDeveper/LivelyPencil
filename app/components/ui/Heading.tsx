import { Text as NativeText, TextProps } from "react-native";

const Heading = (props: TextProps) => {
  return (
    <NativeText
      {...props}
      style={props.style}
      className={`text-Black text-lg font-Inter-bold ${props.className}`}
    >
      {props.children}
    </NativeText>
  );
};

export default Heading;
