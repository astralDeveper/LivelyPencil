import { Text, View } from "react-native";

// -------------------- Renderers-----------------------
function isNodeOnlyText(node) {
  if (node.type === "text") {
    return true;
  }
  if (node.children && node.children.length) {
    return node.children.every(isNodeOnlyText);
  }
  return false;
}

// NOTE: Then only change i made is the PageSystemRenderer wasn't recognizing <br> so we programmed it
// function extractTextFromNode(node) {
//   if (node.init && node.init.domNode && node.init.domNode.type === "text") {
//     return node.init.domNode.data || "";
//   }

//   if (node.init && node.init.domNode && node.init.domNode.children) {
//     return node.init.domNode.children
//       .map((child) => {
//         if (child.type === "text") {
//           return child.data || "";
//         }
//         return "";
//       })
//       .join("");
//   }

//   if (node.children && node.children.length) {
//     return node.children.map(extractTextFromNode).join("");
//   }

//   return "";
// }

function extractTextFromNode(node) {
  if (node.init && node.init.domNode && node.init.domNode.type === "text") {
    return node.init.domNode.data || "";
  }

  if (node.init && node.init.domNode && node.init.domNode.children) {
    return node.init.domNode.children
      .map((child) => {
        if (child.type === "text") {
          return child.data || "";
        }
        // Handle <br> tags by returning a newline character
        if (child.type === "tag" && child.name === "br") {
          return "\n";
        }
        return "";
      })
      .join("");
  }

  if (node.children && node.children.length) {
    return node.children.map(extractTextFromNode).join("");
  }

  return "";
}
// Just for VerticalPager
export const PageSystemDivRenderer = (props) => {
  const { TDefaultRenderer, tnode } = props;

  const extractedText = extractTextFromNode(tnode);
  // console.log("Extracted Text:", extractedText);

  if (isNodeOnlyText(tnode) && extractedText) {
    return (
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 20,
          paddingStart: 10,
          paddingEnd: 5,
        }}
      >
        {extractedText}
      </Text>
    ); // Adjust the fontSize value as needed
  }

  return <TDefaultRenderer {...props} />;
};

// For All Div except VerticalPager
const DivRenderer = (props) => {
  const { TDefaultRenderer, tnode } = props;

  const extractedText = extractTextFromNode(tnode);
  if (isNodeOnlyText(tnode) && extractedText) {
    return (
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 15,
          paddingStart: 10,
          paddingEnd: 5,
          fontFamily: "Inter-Medium",
        }}
      >
        {extractedText}
      </Text>
    ); // Adjust the fontSize value as needed
  }

  return <TDefaultRenderer {...props} />;
};

export const SpanRenderer = (props) => {
  const { TDefaultRenderer, tnode } = props;

  const extractedText = extractTextFromNode(tnode);

  if (isNodeOnlyText(tnode) && extractedText) {
    return (
      <Text
        allowFontScaling={false}
        style={{
          fontSize: 15,
          paddingStart: 10,
          paddingEnd: 5,
          fontFamily: "Inter-Bold",
        }}
      >
        {extractedText}
      </Text>
    );
  }

  return <TDefaultRenderer {...props} />;
};

export default DivRenderer;
