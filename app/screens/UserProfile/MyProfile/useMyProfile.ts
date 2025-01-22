import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useGetPagesByAuthorQuery } from "shared/apis/page/pageApi";
import { useGetStreamsByAuthorIdQuery } from "shared/apis/streams/streamsApi";
import {
  usePaginatedPagesList,
  usePaginatedStreamList,
} from "shared/hooks/usePaginatedList";
import { useAppSelector } from "shared/hooks/useRedux";
import { ProfileStackNavigatorProps } from "shared/navigators/ProfileStackNavigator";
import { SelectedStream } from "shared/types/stream/streamList.type";
import { apiHandler } from "shared/util/handler";

let count = 0;
const pageIds: string[] = [];
let streamPages: string[] = [];

const useMyProfile = () => {
  const { navigate } = useNavigation<ProfileStackNavigatorProps>();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [selectedStream, setStream] = useState<SelectedStream>({
    streamId: undefined,
    title: undefined,
    lastIndex: undefined,
  });

  const [isSelectPageModalVisible, toggleSelectPageModal] =
    useState<boolean>(false);
  const { onResultsReceived, pages, pageNumber, incrementPageNumber } =
    usePaginatedPagesList(count);

  const {
    onResultsReceived: onResultsReceivedStreams,
    streams,
    pageNumber: streamsPageNumber,
    incrementPageNumber: incrementStreamsPage,
  } = usePaginatedStreamList();

  const { data, isLoading, error } = useGetPagesByAuthorQuery({
    id: currentUser!._id,
    page: pageNumber,
  });
  const {
    data: streamsData,
    isLoading: streamsLoading,
    error: streamsError,
  } = useGetStreamsByAuthorIdQuery({
    id: currentUser!._id,
    page: streamsPageNumber,
  });

  useEffect(() => {
    apiHandler({
      data,
      error,
      onSuccess(response) {
        count = onResultsReceived(response);
        response.data.results.map((item) => {
          if (item.isEnabled) pageIds.push(item._id);
        });
      },
    });
  }, [data, error]);

  useEffect(() => {
    apiHandler({
      data: streamsData,
      error: streamsError,
      onSuccess(response) {
        onResultsReceivedStreams(response);
      },
    });
  }, [streamsData, streamsError]);

  let userUrl = currentUser?.link
    ? currentUser.link
    : "https://www.livelypencil.com";
  if (!userUrl.includes("https://")) userUrl = "https://" + userUrl;

  function navigateToOtherProfile(id: string) {
    navigate("PageStack", { screen: "OtherProfile", params: { id } });
  }
  function navigateToOtherPageFromPages(pageId: string) {
    const initialIndex = pageIds.findIndex((id) => id === pageId);
    if (pageIds && pageIds !== undefined && pageIds.length === 0)
      return Alert.alert("Error", "No pages to view");
    else
      navigate("PageStack", {
        screen: "Details",
        params: { pageIds, initialIndex },
      });
  }

  function handleNavigationFromStream(isLast: boolean) {
    navigate("PageStack", {
      screen: "Details",
      params: {
        pageIds: streamPages,
        initialIndex: isLast ? selectedStream.lastIndex : 0,
      },
    });
  }

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

  function navigateToSettings() {
    navigate("Settings");
  }

  function closeSelectPageModal() {
    toggleSelectPageModal(false);
  }

  return {
    navigateToOtherProfile,
    userUrl,
    currentUser,
    pages,
    streams,
    onPagesEndReached: incrementPageNumber,
    onStreamsEndReached: incrementStreamsPage,
    navigateToOtherPageFromPages,
    setSelectedStream,
    handleNavigationFromStream,
    selectedStream,
    navigateToSettings,
    isSelectPageModalVisible,
    closeSelectPageModal,
  };
};

export default useMyProfile;
