import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function UploadPhotoIcon(props: SvgProps) {

  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M1.667 10c0-3.928 0-5.892 1.22-7.113 1.22-1.22 3.185-1.22 7.113-1.22 3.929 0 5.893 0 7.113 1.22 1.22 1.22 1.22 3.185 1.22 7.113 0 3.928 0 5.893-1.22 7.113-1.22 1.22-3.184 1.22-7.113 1.22-3.928 0-5.892 0-7.113-1.22-1.22-1.22-1.22-3.185-1.22-7.113z"
        stroke="#434343"
        strokeWidth={1.5}
      />
      <Path
        d="M13.334 8.333a1.667 1.667 0 100-3.333 1.667 1.667 0 000 3.333z"
        stroke="#434343"
      />
      <Path
        d="M4.167 11.09l.675-.628a1.917 1.917 0 012.7.09l2.206 2.342c.449.476 1.183.54 1.707.149a1.931 1.931 0 012.489.151L15.834 15"
        stroke="#434343"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default UploadPhotoIcon;
