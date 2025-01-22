import { useEffect, useRef } from "react";
import { Animated, Keyboard, Platform, ScrollViewProps } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CustomKeyboardScrollView(props: ScrollViewProps) {
  const bottomHeight = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      _keyboardShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      _keyboardHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function _keyboardHide() {
    Animated.timing(bottomHeight, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }

  function _keyboardShow(e: any) {
    Animated.timing(bottomHeight, {
      toValue: e.endCoordinates.height - 100,
      useNativeDriver: false,
    }).start();
  }

  if (Platform.OS === "android")
    return (
      <ScrollView
        {...props}
        ref={scrollRef}
        contentContainerStyle={[props.contentContainerStyle]}
      >
        {props.children}
        <Animated.View style={{ height: bottomHeight }} />
      </ScrollView>
    );
  else
    return (
      <KeyboardAwareScrollView {...props}>
        {props.children}
      </KeyboardAwareScrollView>
    );
}
