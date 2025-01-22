// Live blinking small round , with color props

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Text } from "react-native";

export default function Live({ color }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Text>
        <Animated.View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: color || "red",
            opacity: fadeAnim,
          }}
          // style={[
          //   styles.circle,
          //   {
          //     opacity: fadeAnim,
          //   },
          // ]}
        />
      </Text>
      {/* <Text style={styles.liveText}>Live</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  liveText: {
    fontSize: 10,
    marginLeft: 5,
    color: "black",
  },
  // circle: {
  //   width: 10,
  //   height: 10,
  //   borderRadius: 5,
  //   backgroundColor: color || "red",
  // },
});
