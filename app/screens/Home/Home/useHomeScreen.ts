import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useGetAllPagesOfFollowingUsersQuery } from "shared/apis/home/homeApi";
import { usePaginatedPagesList } from "shared/hooks/usePaginatedList";
import { HomeStackNavigatorProps } from "shared/navigators/HomeStackNavigator";
import { apiHandler } from "shared/util/handler";

let count = 0;
let pageIds: string[] = [];

const useHomeScreen = () => {
  const { onResultsReceived, pages, pageNumber, incrementPageNumber } =
    usePaginatedPagesList(count);
  const { data, isLoading, error, refetch } =
    useGetAllPagesOfFollowingUsersQuery(pageNumber);
  const { navigate } = useNavigation<HomeStackNavigatorProps>();

  const navigateToPageDetails = (pageId: string) => {
    const initialIndex = pageIds.findIndex((item) => item === pageId);
    navigate("PageStack", {
      screen: "Details",
      params: {
        pageIds,
        initialIndex,
      },
    });
  };

  useEffect(() => {
    apiHandler({
      data,
      error,
      onSuccess(response) {
        count = onResultsReceived(response);
        pageIds = [
          ...pageIds,
          ...response.data.results.map((item) => item._id),
        ];
      },
    });
  }, [data, error]);

  async function handleRefetch() {
    await refetch();
  }

  return {
    pages,
    navigateToPageDetails,
    isLoading,
    onResultsEnd: incrementPageNumber,
    handleRefetch,
  };
};

export default useHomeScreen;
