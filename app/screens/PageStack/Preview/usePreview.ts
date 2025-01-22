import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  SocketContext,
  SocketContextType,
} from "screens/Socket/SocketProvider";
import { useGetPageByIdQuery } from "shared/apis/page/pageApi";
import { useGetAllPagesIncludingDraftByStreamQuery } from "shared/apis/page/pageEditorApi";
import {
  PageStackNavigatorProps,
  PreviewRouteProp,
} from "shared/navigators/PageStackNavigator";
import { IGetPageById } from "shared/types/page/PageResponse.type";
import { apiHandler } from "shared/util/handler";

const usePreview = () => {
  const {
    params: { id: streamId, shortCode, title, coverImageUrl },
  } = useRoute<PreviewRouteProp>();
  const { navigate, goBack } = useNavigation<PageStackNavigatorProps>();
  const { liveBookSocket, updatedContent, liveBookRooms, newPage, viewers } =
    useContext(SocketContext) as SocketContextType;
  const [page, setPage] = useState<IGetPageById>();
  const uniqueViewers = new Set(viewers?.liveBook?.joinedFollowers);
  let bookLive = liveBookRooms.includes(streamId);
  const { data, error, isLoading } = useGetAllPagesIncludingDraftByStreamQuery({
    id: streamId,
    page: 1,
  });


  useEffect(() => {
    apiHandler({
      data,
      error,
      onSuccess(response) { 
        setPage(response.data.results[0]);
      },
    });
  }, [data, error]);

  useEffect(() => {
    return () => {
      liveBookSocket?.emit("leave_live_book");
    };
  }, []);

  useEffect(() => {
    if (!bookLive) {
      liveBookSocket?.emit("leave_live_book");
      liveBookSocket?.emit("author_leave_live_book", {
        bookId: streamId,
      });
      Alert.alert(
        "Author Left",
        `Author has disconnected`,
        [{ text: "ok", onPress: () => goBack() }],
        { cancelable: false }
      );
    }
  }, [bookLive]);

  function gotoDiscussion() {
    if (!page?._id && !page?.commentsCount) return;
    navigate("Discussion", {
      bookId: streamId,
      pageId: page?._id,
      pageShortCode: shortCode,
      totalComments: page?.commentsCount,
    });
  }

  return {
    gotoDiscussion,
    goBack,
    shortCode,
    title,
    bookLive,
    updatedContent,
    page,
    coverImageUrl,
    uniqueViewers,
  };
};

export default usePreview;


