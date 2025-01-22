import React, { useRef, useCallback } from "react";
import { FlatList, Text } from "react-native";

const InfiniteScrollList = ({ data, renderItem, onEndReached, ...rest }) => {
  const lastScrollPosition = useRef(0);

  const handleScroll = useCallback(
    (event) => {
      const { contentOffset, layoutMeasurement, contentSize } =
        event.nativeEvent;
      const currentScrollPosition = contentOffset.y;

      // Check if we're scrolling downwards and close to the bottom
      if (
        currentScrollPosition > lastScrollPosition.current &&
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 5
      ) {
        if (typeof onEndReached === "function") {
          onEndReached();
        }
      }

      // Update the last scroll position to the current one
      lastScrollPosition.current = currentScrollPosition;
    },
    [onEndReached]
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      onScroll={handleScroll}
      scrollEventThrottle={400}
      {...rest} // Spread the rest of the props
    />
  );
};

export default InfiniteScrollList;
