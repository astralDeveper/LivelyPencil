import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function ForTest() {
  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={30} // Reduced diameter of the circular progress
        width={6} // Reduced thickness of the circular progress
        fill={85} // Percentage to fill
        tintColor="#00e0ff" // Color of the progress bar
        // tintColor="#FF0000" // Fail
        // tintColor="#009846" // Success
        backgroundColor="#909098" // Background color of the progress bar
        duration={800} // Animation duration
      >
      </AnimatedCircularProgress>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12, // Reduced font size for smaller progress
    color: '#333',
  },
});
