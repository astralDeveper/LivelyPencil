import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { useSearchUsersQuery } from "shared/apis/searchApi/searchApi";
import { useUpdateUserByIdMutation } from "shared/apis/user/userApi";
import { usePaginatedUsersList } from "shared/hooks/usePaginatedList";
import { useAppSelector } from "shared/hooks/useRedux";
import { FollowUsersRouteProp } from "shared/navigators/OnBoardingStackNavigator";
import { apiHandler } from "shared/util/handler";

const useFollowUsers = () => {
  const { incrementPageNumber, onResultsReceived, pageNumber, users } =
    usePaginatedUsersList();
  const {
    params: { selectedCategories },
  } = useRoute<FollowUsersRouteProp>();
  const userId = useAppSelector((state) => state.auth.user?._id);
  const { goBack } = useNavigation();
  const { data, isLoading, error } = useSearchUsersQuery({
    input: "",
    language: "English",
    page: pageNumber,
  });
  const [
    updateUser,
    { data: updateData, error: updateError, isLoading: updateLoading },
  ] = useUpdateUserByIdMutation();

  useEffect(() => {
    apiHandler({
      data,
      error,
      onSuccess(response) {
        onResultsReceived(response);
      },
    });
  }, [data, error]);

  useEffect(() => {
    apiHandler({
      data: updateData,
      error: updateError,
    });
  }, [updateData, updateError]);

  function handleNext() {
    if (userId)
      updateUser({
        id: userId,
        userData: { listofCategoryIds: selectedCategories },
      });
  }

  return {
    users,
    incrementPageNumber,
    isLoading,
    handleNext,
    goBack,
    updateLoading,
  };
};

export default useFollowUsers;
