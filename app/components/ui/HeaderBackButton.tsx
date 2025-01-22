import {
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { SvgProps } from "react-native-svg";
import { ChevronLeft, X } from "react-native-feather";

interface HeaderBackButtonProps extends TouchableOpacityProps {
  iconProps?: SvgProps;
  isCross?: boolean;
}

const HeaderBackButton = (props: HeaderBackButtonProps) => {
  return (
    <>
      {Platform.OS === "ios" ? (
        <TouchableOpacity
          {...props}
          style={[
            { justifyContent: "center", alignItems: "center", padding: 8 },
            props.style,
          ]}
        >
          {props.isCross ? (
            <X color="#5E5D5D" {...props?.iconProps} />
          ) : (
            <ChevronLeft color="#5E5D5D" {...props?.iconProps} />
          )}
        </TouchableOpacity>
      ) : null}
    </>
  );
};

export default HeaderBackButton;
