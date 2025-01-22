import React, { useContext } from "react";
import { Modal, Pressable, View, useWindowDimensions } from "react-native";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import { Button, Text } from "../ui";
import { setShowSelectPageModal } from "store/slices/stream/streamSlice";
import { SocketContext, SocketContextType } from "screens/Socket/SocketProvider";
import { HomeStackNavigatorProps } from "shared/navigators/HomeStackNavigator";
import { useNavigation } from "@react-navigation/native";
import { SelectedStream } from "shared/types/stream/streamList.type";

interface LiveModalProps {
  selectedStream: SelectedStream;
}

const LiveModal = ({ selectedStream }: LiveModalProps): JSX.Element => {
  const { liveBookSocket } = useContext(SocketContext) as SocketContextType;
  const navigation = useNavigation<HomeStackNavigatorProps>();
  const userId = useAppSelector((state) => state.auth.user?._id);
  const isVisible = useAppSelector((state) => state.stream.showSelectPageModal);
  const { width, height } = useWindowDimensions();
  const dispatch = useAppDispatch();

  function closeModal() {
    dispatch(setShowSelectPageModal(false));
  }

  function handleJoinLive() {
    liveBookSocket.emit("join_live_book", {
      bookId: selectedStream.streamId,
      userId,
    });
    navigation.navigate("PageStack", {
      screen: "Preview",
      params: {
        shortCode: selectedStream.bookShortCode,
        coverImageUrl: selectedStream.coverImageUrl,
        id: selectedStream.streamId,
        title: selectedStream.title,
      },
    });
    closeModal();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <Pressable
        style={{
          position: "absolute",
          width: width,
          height: height,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={closeModal}
      >
        <View
          style={{
            width: width * 0.85,
            maxWidth: 400,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <Text className="text-Black font-Inter-bold text-lg text-center">
            Join the live stream?
          </Text>
          <Button
            label="Watch Live"
            className="bg-red border-white mt-4"
            onPress={handleJoinLive}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

export default LiveModal;
