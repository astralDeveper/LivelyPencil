import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Alert } from "react-native";
import {
  SocketContext,
  SocketContextType,
} from "screens/Socket/SocketProvider";
import { useGetStreamsByCategoryQuery } from "shared/apis/streams/streamsApi";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import {
  LibraryStackNavigatorProps,
  StreamsRouteProp,
} from "shared/navigators/LibraryStackNavigator";
import { SelectedStream } from "shared/types/stream/streamList.type";
import { ListOfPageId } from "shared/types/stream/streamResponse.type";
import { apiHandler } from "shared/util/handler";
import { setShowSelectPageModal } from "store/slices/stream/streamSlice";

let streamPages: string[] = [];

const useStreams = () => {
  const {
    params: { categoryId, categoryName,lib },
  } = useRoute<StreamsRouteProp>();
  const userId = useAppSelector((state) => state.auth.user?._id);
  const userLanguage = useAppSelector((state) => state.util.languageSelected);

  const { navigate, setOptions } = useNavigation<LibraryStackNavigatorProps>();
  const { liveBookSocket, liveBookRooms } = useContext(
    SocketContext
  ) as SocketContextType;
  const { data, isLoading, error } = useGetStreamsByCategoryQuery({
    id: categoryId,
    language: userLanguage,
  });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isSelectPageModalVisible, toggleSelectPageModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState<SelectedStream>({
    streamId: undefined,
    title: undefined,
    lastIndex: undefined,
    bookShortCode: undefined,
    coverImageUrl: undefined,
  });
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    setOptions({
      headerTitle: categoryName.toLocaleUpperCase(),
    });
  }, []);

  useEffect(() => {

    apiHandler({
      data,
      error,
    });
  }, [data, error]);
const Libssss = lib

  function handleJoin(book) {
    liveBookSocket.emit("join_live_book", {
      bookId: book._id,
      userId,
    });
    navigate("PageStack", {
      screen: "Preview",
      params: {
        shortCode: book.bookShortCode,
        coverImageUrl: book.coverImageUrl,
        id: book._id,
        title: book.title,
      },
    });
  }

// console.log(props)

  function handleNavigation(isLast: boolean) {
    navigate("PageStack", {
      screen: "Details",
      params: {
        pageIds: streamPages,
        initialIndex: isLast ? selectedStream.lastIndex : 0,
      },
    });
  }

  function handlePress(streamId: string, initialIndex?: number) {
    streamPages = []; //Updating for every press
    const streamIndex = data.results.findIndex(
      (item: { _id: string }) => item._id === streamId
    );
    if (streamIndex >= 0) {
      data.results[streamIndex].listOfPageIds.map((item: ListOfPageId) => {
        if (item.isEnabled) streamPages.push(item.pageId);
      });

      if (streamPages.length === 0)
        return Alert.alert("Error", "No pages to view in this stream");
      setSelectedStream({
        title: data.results[streamIndex].title,
        lastIndex: streamPages.length - 1,
        bookShortCode: data.results[streamIndex].bookShortCode,
        coverImageUrl: data.results[streamIndex].coverImageUrl,
        streamId,
      });
      if (streamPages.length > 1) {
        toggleSelectPageModal(true);
      } else handleNavigation(false);
    } else return Alert.alert("Error", "No pages to view in this stream");
  }

  function closeSelectPageModal() {
    toggleSelectPageModal(false);
  }

  return {
    data: data ?? [],
    isLoading,
    handlePress,
    handleJoin,
    liveBookRooms,
    selectedStream,
    handleNavigation,
    closeSelectPageModal,
    isSelectPageModalVisible,
    Libssss
  };
};

export default useStreams;
