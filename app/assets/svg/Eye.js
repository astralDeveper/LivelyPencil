import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Eye = (props) => (
  <Svg width={23} height={23} fill="none" {...props}>
    <Path
      stroke={props.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.0}
      d="M3.532 14.75c-.787-1.023-1.18-1.534-1.18-3.052s.393-2.03 1.18-3.052c1.571-2.041 4.207-4.355 8.079-4.355 3.872 0 6.507 2.314 8.079 4.355.787 1.023 1.18 1.534 1.18 3.052s-.393 2.03-1.18 3.051c-1.572 2.042-4.207 4.356-8.08 4.356-3.871 0-6.507-2.314-8.078-4.356Z"
    />
    <Path
      stroke={props.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.0}
      d="M14.389 11.698a2.778 2.778 0 1 1-5.556 0 2.778 2.778 0 0 1 5.556 0Z"
    />
  </Svg>
);
export default Eye;
