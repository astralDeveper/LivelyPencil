// Round Button with "+" sign in center as percentage increases the round button get fill
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

const CircularProgressButton = ({ percentage, size = 80, color = "blue" }) => {
  const strokeWidth = 3;
  const radius = size / 2 - strokeWidth;
  const viewBox = `0 0 ${size} ${size}`;

  // Calculate the circumference
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <View>
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg width={size} height={size} viewBox={viewBox}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#FFFFFF"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </Svg>
        <Text
          style={{
            position: "absolute",
            fontSize: size / 2,
            color,
            fontWeight: "bold",
          }}
        >
          +
        </Text>
      </View>
    </View>
  );
};

export default CircularProgressButton;
