import { Text, TextProps } from "react-native";

const ErrorText = (props: TextProps): JSX.Element => {
  return (
    <Text
      {...props}
      className={`mt-1 text-sm text-red font-Inter-medium ${props.className}`}
    >
      {props.children}
    </Text>
  );
};

export default ErrorText;
