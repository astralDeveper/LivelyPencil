import Svg, { Path, SvgProps } from "react-native-svg";

export default function LibraryIcon(props: SvgProps) {
  return (
    <Svg width={23} height={21} viewBox="0 0 23 21" fill="none" {...props}>
      <Path
        d="M3.915 1.048H2.629a2 2 0 00-2 2v14.905a2 2 0 002 2h1.286a2 2 0 002-2V3.048a2 2 0 00-2-2z"
        stroke={props.color ?? "#909198"}
      />
      <Path
        d="M3.82 17.31a.548.548 0 11-1.096 0 .548.548 0 011.096 0z"
        fill="#4A4A4A"
        stroke={props.color ?? "#909198"}
      />
      <Path
        d="M2.573 6.31H3.97M2.573 9.45H3.97M2.573 3.166H3.97"
        stroke={props.color ?? "#909198"}
        strokeLinecap="round"
      />
      <Path
        d="M11.248 1.048H9.962a2 2 0 00-2 2v14.905a2 2 0 002 2h1.286a2 2 0 002-2V3.048a2 2 0 00-2-2z"
        stroke={props.color ?? "#909198"}
      />
      <Path
        d="M11.153 17.31a.548.548 0 11-1.096 0 .548.548 0 011.096 0z"
        fill="#4A4A4A"
        stroke={props.color ?? "#909198"}
      />
      <Path
        d="M9.907 6.31h1.397M9.907 9.45h1.397M9.907 3.166h1.397"
        stroke={props.color ?? "#909198"}
        strokeLinecap="round"
      />
      <Path
        d="M17.26 1.05l-1.274.179a2 2 0 00-1.702 2.259l2.075 14.76a2 2 0 002.258 1.702l1.274-.179a2 2 0 001.702-2.259L19.52 2.752a2 2 0 00-2.26-1.702z"
        stroke={props.color ?? "#909198"}
      />
      <Path
        d="M19.43 17.167a.548.548 0 11-1.086.153.548.548 0 011.085-.153z"
        fill="#4A4A4A"
        stroke={props.color ?? "#909198"}
      />
      <Path
        d="M16.663 6.447l1.383-.194M17.1 9.56l1.384-.195m-2.258-6.03l1.383-.194"
        stroke={props.color ?? "#909198"}
        strokeLinecap="round"
      />
    </Svg>
  );
}
