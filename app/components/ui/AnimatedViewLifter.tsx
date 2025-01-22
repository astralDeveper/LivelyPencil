import { useEffect, useRef } from "react";
import { Animated, Keyboard, Platform, ViewProps } from "react-native";

interface AnimatedButtonProps extends ViewProps {
  children?: JSX.Element;
  onKeyboardShow?: () => void;
  onKeyboardHide?: () => void;
  fullHeight?: boolean;
  value?: number;
  heightOffset?: number;
  shouldMove?: boolean;
  applyOnHeight?: boolean;
}

const AnimatedViewLifter = (props: AnimatedButtonProps): JSX.Element => {
  const {
    children,
    onKeyboardHide,
    onKeyboardShow,
    fullHeight = false,
    value,
    heightOffset = 0,
    shouldMove = true,
    applyOnHeight,
  } = props;
  const bottomHeight = useRef(new Animated.Value(value || 0)).current;

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
    if (!shouldMove) return;
    Animated.timing(bottomHeight, {
      toValue: value || 0,
      useNativeDriver: false,
    }).start();
    if (onKeyboardHide) onKeyboardHide();
  }

  function _keyboardShow(e: any) {
    console.log(e.endCoordinates.height + heightOffset);
    if (!shouldMove) return;
    Animated.timing(bottomHeight, {
      toValue: fullHeight
        ? e.endCoordinates.height + heightOffset
        : e.endCoordinates.height - 120 + heightOffset,
      useNativeDriver: false,
    }).start();
    if (onKeyboardShow) onKeyboardShow();
  }

  return (
    <Animated.View
      style={[
        props.style,
        {
          bottom: !applyOnHeight ? bottomHeight : 0,
          height: applyOnHeight ? bottomHeight : 0,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedViewLifter;
