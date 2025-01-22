import Svg, { Path, SvgProps } from "react-native-svg";

function EyeOpenIcon(props: SvgProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        d="M2.537 11.441c-.63-.818-.944-1.227-.944-2.44 0-1.215.315-1.624.944-2.442C3.794 4.926 5.902 3.074 9 3.074s5.206 1.852 6.463 3.485c.63.818.945 1.227.945 2.441 0 1.214-.315 1.623-.945 2.441-1.257 1.633-3.365 3.485-6.463 3.485s-5.206-1.851-6.463-3.485z"
        stroke="#393A44"
        strokeWidth={1.06667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.223 9a2.222 2.222 0 11-4.445 0 2.222 2.222 0 014.445 0z"
        stroke="#393A44"
        strokeWidth={1.06667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default EyeOpenIcon;
