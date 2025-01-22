import Svg, { Path, SvgProps } from "react-native-svg";

function NotificationIcon(props: SvgProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        d="M14.062 7.282v-.528C14.062 3.852 11.796 1.5 9 1.5c-2.796 0-5.062 2.352-5.062 5.254v.528a3.3 3.3 0 01-.52 1.782l-.83 1.293c-.759 1.181-.18 2.787 1.14 3.16 3.452.977 7.092.977 10.544 0 1.32-.373 1.899-1.979 1.14-3.16l-.83-1.293a3.3 3.3 0 01-.52-1.782z"
        stroke={props.stroke ?? "#434343"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.625 14.25C6.116 15.56 7.442 16.5 9 16.5s2.884-.94 3.375-2.25M9 4.5v3"
        stroke={props.stroke ?? "#434343"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default NotificationIcon;
