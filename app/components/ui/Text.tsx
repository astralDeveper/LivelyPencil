import { Text as NativeText, TextProps } from "react-native";

const Text = (props: TextProps) => {
  return (
    <NativeText
      {...props}
      style={props.style}
      className={`text-textColor2 text-sm font-Inter-black ${props.className}`}
    >
      {props.children}
    </NativeText>
  );
};

export default Text;
