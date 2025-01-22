import { View } from "react-native";
import useStreams from "./useStreams";
import StreamsList from "app/components/Streams/StreamsList";
import { Loading } from "app/components";
import SelectPageModal from "app/components/Streams/SelectPageModal";
import { useIsFocused } from "@react-navigation/native";
import { useState } from "react";
import useSearch from "screens/Search/Main/useSearch";

const Streams = () => {
  const {
    data,
    isLoading,
    handleJoin,
    handlePress,
    liveBookRooms,
    handleNavigation,
    selectedStream,
    closeSelectPageModal,
    isSelectPageModalVisible,
    Libssss
  } = useStreams();
  // const {

  //   selectedStream,

  // } = useSearch();

  if (isLoading) return <Loading />;
  // const isFocused = useIsFocused();
// console.log("first=====>",selectedStream)
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* <FlashList
        showsVerticalScrollIndicator={false}
        data={data.results}
        renderItem={renderItem}
        numColumns={2}
        estimatedItemSize={100}
      /> */}
      <StreamsList data={data.results} navigateToPageDetails={handlePress}  lib={Libssss}  />
      <SelectPageModal
        onPressNavigate={handleNavigation}
        selectedStream={selectedStream}
        title={selectedStream.title}
        visible={isSelectPageModalVisible}
        closeModal={closeSelectPageModal}
      />
    </View>
  );
};

export default Streams;
