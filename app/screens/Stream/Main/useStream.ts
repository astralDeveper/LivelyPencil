import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import {
  useGetMyStreamsQuery,
  useGetStreamsByAuthorIdQuery,
} from "shared/apis/streams/streamsApi";
import { usePaginatedStreamList } from "shared/hooks/usePaginatedList";
import { useAppSelector } from "shared/hooks/useRedux";
import { StreamStackNavigatorProps } from "shared/navigators/StreamStackNavigator";
import { IStream } from "shared/types/stream/streamResponse.type";
import { DateTimeFormatOptions } from "shared/types/util/DateFormat";
import { apiHandler } from "shared/util/handler";

const options: DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
};

const useStream = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const { navigate } = useNavigation<StreamStackNavigatorProps>();
  const { incrementPageNumber, onResultsReceived, pageNumber, streams } =
    usePaginatedStreamList();

  const { data, error, isLoading, refetch } = useGetStreamsByAuthorIdQuery({
    id: userId!,
    page: pageNumber,
  });

  useEffect(() => {
    apiHandler({
      data,
      error,
      onSuccess(response) {
        onResultsReceived(response, response.page === 1);
      },
    });
  }, [data, error]);

  function navigateToCreateStreams() {
    navigate("CreateStream");
  }

  function navigateToPages(pageData: { id: string; title: string }) {
    navigate("Pages", pageData);
  }

  function navigateToEditStream(item: IStream) {
    if (typeof item.categoryId === "string")
      navigate("EditStream", {
        ...item,
        id: item._id,
        categoryId: item.categoryId,
      });
    else
      navigate("EditStream", {
        ...item,
        id: item._id,
        categoryId: item.categoryId._id,
      });
  }

  function displayStreamStatistics(item: IStream) {
    const created = new Date(item?.createdAt);
    const updated = new Date(item?.updatedAt);
    Alert.alert(
      "Stream Statistics",
      `Total Pages : ${
        item?.numberOfPages
      }\nCreated : ${created.toLocaleDateString(
        "en-GB",
        options
      )}\nUpdated : ${updated.toLocaleDateString("en-GB", options)}`
    );
  }

  async function handleRefetch() {
    await refetch();
  }

  return {
    onResultsEnd: incrementPageNumber,
    streams,
    isLoading,
    navigateToCreateStreams,
    navigateToPages,
    displayStreamStatistics,
    navigateToEditStream,
    handleRefetch,
  };
};

export default useStream;
