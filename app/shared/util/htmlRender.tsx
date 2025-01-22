import { Dimensions, View, ViewProps, useWindowDimensions } from "react-native";
import { Heading, Text } from "app/components/ui";
import { parseDocument, ElementType } from "htmlparser2";
import React, { PureComponent } from "react";
import { Image } from "expo-image";
import { Document, Node } from "react-native-render-html";

let currentNode;

export default class RenderHtml extends PureComponent {
  ignoredTags = ["head"];
  textTags = ["span", "br", "img", "div", "b"];

  renderTextNode(textNode, _: number) {
    if (textNode.parent.name === "b") {
      return (
        <Heading
          key={Math.floor(Math.random() * 100000000)}
          style={{ marginHorizontal: 20 }}
        >
          {textNode.data}
        </Heading>
      );
    } else
      return (
        <Text
          key={Math.floor(Math.random() * 100000000)}
          style={{ paddingHorizontal: 20, }}
        >
          {textNode.data}
        </Text>
      );
  }

  renderElement(element: Node, index: number) {
    if (this.ignoredTags.indexOf(element.name) > -1) {
      return null;
    }

    console.log("element====>",element);
    
    // Cater img, br, b, span and div
    currentNode = this.textTags[index];
    if (
      "attribs" in element &&
      typeof element.attribs === "object" &&
      element.attribs &&
      "src" in element.attribs &&
      "src" in element.attribs &&
      typeof element.attribs.src === "string"
    ) {
      return (
        <Image
          key={element.attribs.src}
          source={{ uri: element.attribs.src }}
          style={{
            width: Dimensions.get("screen").width*0.9,
            height: element.attribs.class === "full" ? "100%" : null,
            aspectRatio: element.attribs.class !== "full" ? 1 : 2 / 3,
            marginVertical:10,alignSelf:"center"
          }}
          contentFit="cover"
        />
      );
    } else if (currentNode?.includes("div")) {
      if (
        element.children.length > 0 &&
        "data" in element.children[0] &&
        typeof element.children[0].data === "string" &&
        element.children[0].data.trim() !== ""
      ) {
        return (
          <Text
            key={Math.floor(Math.random() * 100000000)}
            style={{ paddingHorizontal: 20 }}
          >
            {element.children[0].data}
          </Text>
        );
      }
    }
    return (
      <View key={Math.floor(Math.random() * 100000000)}>
        {/* <Text>jhghghjghg</Text> */}
        {element.children.map((c, index: number) => this.renderNode(c, index))}
      </View>
    );
  }

  renderNode(node, index: number) {
    switch (node.type) {
      case ElementType.Text:
        return this.renderTextNode(node, index);
      case ElementType.Tag:
        return this.renderElement(node, index);
    }
    return null;
  }

  render() {
    const document: Document = parseDocument(this.props.html);
    return document.children.map((c, index) => this.renderNode(c, index));
  }
}
