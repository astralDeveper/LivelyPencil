import Svg, { Rect, Path, SvgProps } from "react-native-svg";

function AddStreamIcon(props: SvgProps) {
  return (
    <Svg width={43} height={43} viewBox="0 0 43 43" fill="none" {...props}>
      <Rect width={43} height={43} rx={21.5} fill="#0076FC" />
      <Path
        d="M21.395 13.03l.105-.005c.536 0 .976.407 1.029.928l.005.106v6.408h6.409c.535 0 .975.407 1.028.928l.005.106c0 .535-.406.975-.928 1.028l-.105.006h-6.409v6.408c0 .535-.407.976-.928 1.028l-.106.006c-.535 0-.975-.407-1.028-.928l-.005-.106v-6.409h-6.409c-.535 0-.975-.406-1.028-.927l-.006-.106c0-.535.407-.976.928-1.029l.106-.005h6.409V14.06c0-.536.407-.976.928-1.029l.105-.005-.105.005z"
        fill="#fff"
      />
    </Svg>
  );
}

export default AddStreamIcon;
