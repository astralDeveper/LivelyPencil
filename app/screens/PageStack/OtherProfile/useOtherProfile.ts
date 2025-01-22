import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useGetOtherProfileQuery } from "shared/apis/home/homeApi";
import { useGetPagesByAuthorQuery } from "shared/apis/page/pageApi";
import { useGetStreamsByAuthorIdQuery } from "shared/apis/streams/streamsApi";
import { useUserActionMutation } from "shared/apis/user/userApi";
import {
  usePaginatedPagesList,
  usePaginatedStreamList,
} from "shared/hooks/usePaginatedList";
import { useAppDispatch } from "shared/hooks/useRedux";
import {
  OtherProfileRouteProp,
  PageStackNavigatorProps,
} from "shared/navigators/PageStackNavigator";
import { SelectedStream } from "shared/types/stream/streamList.type";
import { apiHandler } from "shared/util/handler";
import { formatPagesResponseToPagesList } from "shared/util/page";
import { setShowSelectPageModal } from "store/slices/stream/streamSlice";

let count = 0;
const pageIds: string[] = [];
let streamPages: string[] = [];

const useOtherProfile = () => {
  const {
    params: { id },
  } = useRoute<OtherProfileRouteProp>();
  const { navigate, goBack } = useNavigation<PageStackNavigatorProps>();
  const [selectedStream, setStream] = useState<SelectedStream>({
    streamId: undefined,
    title: undefined,
    lastIndex: undefined,
  });
  const [isSelectPageModalVisible, toggleSelectPageModal] =
    useState<boolean>(false);

  const { data, isLoading, error } = useGetOtherProfileQuery(id);

  const { onResultsReceived, pages, pageNumber, incrementPageNumber } =
    usePaginatedPagesList(count);

  const {
    onResultsReceived: onResultsReceivedStreams,
    streams,
    pageNumber: streamsPageNumber,
    incrementPageNumber: incrementStreamsPage,
  } = usePaginatedStreamList();

  const {
    data: pagesData,
    isLoading: pagesLoading,
    error: pagesError,
  } = useGetPagesByAuthorQuery({ id, page: pageNumber });
  const {
    data: streamsData,
    isLoading: streamsLoading,
    error: streamsError,
  } = useGetStreamsByAuthorIdQuery({ id, page: streamsPageNumber });
  const [
    userAction,
    { data: actionData, error: actionError, isLoading: actionLoading },
  ] = useUserActionMutation();

  useEffect(() => {
    apiHandler({
      data,
      error,
    });
  }, [data, error]);

  useEffect(() => {
    apiHandler({
      data: pagesData,
      error: pagesError,
      onSuccess(response) {
        count = onResultsReceived(response);
        response.data.results.map((item) => {
          if (item.isEnabled) pageIds.push(item._id);
        });
      },
    });
  }, [pagesData, pagesError]);

  useEffect(() => {
    apiHandler({
      data: actionData,
      error: actionError,
      showSuccess: true,
    });
  }, [actionData, actionError]);

  useEffect(() => {
    apiHandler({
      data: streamsData,
      error: streamsError,
      onSuccess(response) {
        onResultsReceivedStreams(response);
      },
    });
  }, [streamsData, streamsError]);

  let userUrl = data?.data?.link
    ? data?.data?.link
    : "https://www.livelypencil.com";
  if (!userUrl.includes("https://")) userUrl = "https://" + userUrl;

  function navigateToOtherProfile(id: string) {
    navigate("OtherProfile", { id });
  }

  function navigateToOtherPageFromPages(pageId: string) {
    const initialIndex = pageIds.findIndex((id) => id === pageId);
    if (pageIds && pageIds !== undefined && pageIds.length === 0)
      return Alert.alert("Error", "No pages to view");
    else navigate("Details", { pageIds, initialIndex });
  }

  function handleNavigationFromStream(isLast: boolean) {
    navigate("Details", {
      pageIds: streamPages,
      initialIndex: isLast ? selectedStream.lastIndex : 0,
    });
  }

  // function setSelectedStream(streamId: string) {
  //   console.log("streamId===>",streams)
  //   const streamIndex = streams.findIndex((item) => item._id === streamId);
  //   if (streamIndex >= 0) {
  //     streamPages = [];
  //     streams[streamIndex].listOfPageIds.map((item) => {
  //       if (item.isEnabled) streamPages.push(item.pageId);
  //     });
  //     if (streamPages.length === 0)
  //       return Alert.alert("Error", "No pages to view in this stream");
  //     setStream({
  //       title: streams[streamIndex].title,
  //       lastIndex: streamPages.length - 1,
  //       streamId,
  //     });
  //     if (streamPages.length > 1) toggleSelectPageModal(true);
  //     else handleNavigationFromStream(false);
  //   } else return Alert.alert("Error", "No pages to view in this stream");
  // }
    function setSelectedStream(streamId: string) {
      const streamIndex = streams.findIndex((item) => item._id === streamId);
      if (streamIndex >= 0) {
        streamPages = [];
        streams[streamIndex].listOfPageIds.map((item) => {
          if (item.isEnabled) streamPages.push(item.pageId);
        });
  
        if (streamPages.length === 0)
          return Alert.alert("Error", "No pages to view in this stream");
        setStream({
          // title: streams[streamIndex].title,
          // lastIndex: streamPages.length - 1,
          // streamId,
          title: streams[streamIndex]?.title,
          lastIndex: streamPages.length - 1,
          bookShortCode: streams[streamIndex].bookShortCode,
          coverImageUrl: streams[streamIndex].coverImageUrl,
          streamId,
        });
        if (streamPages.length > 1) toggleSelectPageModal(true);
        else handleNavigationFromStream(false);
      } else return Alert.alert("Error", "No pages to view in this stream");
    }

  function closeSelectPageModal() {
    toggleSelectPageModal(false);
  }

  function handleFollowAction(id: string, action: "follow" | "unfollow") {
    userAction({ id, action });
  }

  return {
    currentUser: data && data.data,
    navigateToOtherPageFromPages,
    navigateToOtherProfile,
    userUrl,
    pages,
    streams: streams,
    isLoading: isLoading || streamsLoading || pagesLoading,
    goBack,
    onPagesEndReached: incrementPageNumber,
    onStreamsEndReached: incrementStreamsPage,
    setSelectedStream,
    handleNavigationFromStream,
    selectedStream,
    isSelectPageModalVisible,
    closeSelectPageModal,
    handleFollowAction,
    actionLoading,
  };
};

export default useOtherProfile;
