import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

const ScrollableText = ({ text, speed = 30, style = {} }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -textWidth,
          duration: textWidth * speed,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: containerWidth,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (textWidth > 0 && containerWidth > 0) {
      startAnimation();
    }
  }, [textWidth, containerWidth]);

  return (
    <View
      style={{ flex: 1, overflow: "hidden" }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      <Animated.Text
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setTextWidth(width);
        }}
        // style={[style, { transform: [{ translateX }] }]}
        style={[{ marginLeft: 50, transform: [{ translateX }] }]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

export default ScrollableText;
