import Svg, { Path, SvgProps } from "react-native-svg";

export function SearchFilled(props: SvgProps) {
  return (
    <Svg width={25} height={25} viewBox="0 0 25 25" fill="none" {...props}>
      <Path
        d="M12.25 21.5a9.5 9.5 0 100-19 9.5 9.5 0 000 19zm9.8.999c-.18 0-.36-.07-.49-.2l-1.86-1.86a.706.706 0 010-.99c.27-.27.71-.27.99 0l1.86 1.86c.27.27.27.71 0 .99-.14.13-.32.2-.5.2z"
        fill={props.fill ?? "#0076FC"}
      />
    </Svg>
  );
}

export function Search(props: SvgProps) {
  return (
    <Svg width={25} height={25} viewBox="0 0 25 25" fill="none" {...props}>
      <Path
        d="M22.75 22.5l-2-2m-8.5 1a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
        stroke={props.color ?? "#949494"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
