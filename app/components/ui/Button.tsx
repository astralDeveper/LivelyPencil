import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import Text from "./Text";
import { ElementType } from "react";
import { Svg, SvgProps } from "react-native-svg";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  outlined?: boolean;
  loading?: boolean;
  className?: string;
  Icon?: ElementType<SvgProps>;
  short?: boolean;
}

const Button = (props: ButtonProps): JSX.Element => {
  const { label, outlined, loading, Icon, short } = props;
  return (
    <TouchableOpacity
      disabled={loading}
      {...props}
      className={`flex-row items-center justify-center bg-brand rounded-full m-screen items-center py-4 shadow-slate-400 shadow-sm border-brand border-2
    ${outlined && "bg-white"} ${short && "w-[70%] mx-auto py-3"} ${
        props.className
      }`}
      style={props.style}
    >
      {props.loading ? (
        <ActivityIndicator color={props.outlined ? "#0076FC" : "#fff"} />
      ) : (
        <>
          <Text
            className={`text-white text-base font-Inter-bold ${
              outlined && "text-brand"
            }`}
          >
            {label}
          </Text>
          {Icon && <Icon color="#fff" style={{ marginLeft: 12 }} />}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
