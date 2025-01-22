import clsx from "clsx";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Text } from "../ui";
import { useEffect, useState } from "react";
import { useAppSelector } from "shared/hooks/useRedux";
import { useUserActionMutation } from "shared/apis/user/userApi";
import { apiHandler } from "shared/util/handler";
import { showIfNotCurrentUser } from "shared/util/commom";

type UserListItemButtonProps = {
  id: string;
};

const useUsersListButton = () => {
  const [performAction, { data, isLoading, error }] = useUserActionMutation();
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    apiHandler({
      data,
      error,
      showSuccess: true,
    });
  }, [data, error]);

  function userAction(data: { id: string; action: "follow" | "unfollow" }) {
    performAction(data);
  }

  return {
    userAction,
    isLoading,
    currentUser,
  };
};

const UserListItemButton = ({ id }: UserListItemButtonProps): JSX.Element => {
  const { currentUser, isLoading, userAction } = useUsersListButton();
  const [showFollowButton, toggleFollowButton] = useState<boolean>(
    !currentUser?.listofFollowing.includes(id) ?? false
  );

  function handlePress() {
    userAction({
      id,
      action: currentUser?.listofFollowing.includes(id) ? "unfollow" : "follow",
    });
    toggleFollowButton(!showFollowButton);
  }

  return (
    <>
      {showIfNotCurrentUser(id) ? (
        <TouchableOpacity
          onPress={handlePress}
          className={clsx(
            "px-4 py-1 bg-white rounded-full border-2 border-Primary justify-center items-center",
            {
              "bg-brand": !showFollowButton,
            }
          )}
          style={{ alignSelf: "center", minWidth: 80, minHeight: 30 }}
        >
          {isLoading ? (
            <ActivityIndicator color={showFollowButton ? "#0076FC" : "white"} />
          ) : (
            <Text
              className={clsx("text-sm  font-Inter-bold", {
                "text-white": !showFollowButton,
              })}
            >
              {showFollowButton ? "Follow" : "Unfollow"}
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </>
  );
};

export default UserListItemButton;
