/*NOTE: This is used in PageSystem , Why we use it? If user insert tiny image then RenderHtml is not able to stretch image because RenderHTML uses HTMLImage not React Image, So this component  will be used as custom renderer for RenderHTML and will get aspect ratio first and then strectch image  to the edges of screen.*/
import { Image, View, useWindowDimensions } from "react-native";
export default function CustomImage({ htmlAttribs, forPages }) {
  // forPages boolean is for pages, this renderer can be used for pages if true.
  const { height } = useWindowDimensions();

  let style;
  switch (htmlAttribs.class) {
    case "square":
      style = { width: "100%", aspectRatio: 1 };
      break;
    case "portrait":
      style = {
        width: "100%",
        aspectRatio: 3 / 4,
      };
      break;
    case "full":
      style = { width: "100%", height: height * 0.9 }; // after scrollview in VerticalPager i had to change height to 90% of height, Full image was showing too small
      break;
    default:
      style = {
        width: "100%",
        height: "100%",
        // marginLeft: 0,
        // paddingLeft: 0,
      };
  }
  if (forPages) {
    // IF ITS FULL IMAGE LETS HAVE 97.5 HEIGHT
    style = { width: "100%", height: "100%" };
  }
  return (
    <Image
      source={{ uri: htmlAttribs.src }}
      style={style}
      resizeMode="stretch"
    />
  );
}
