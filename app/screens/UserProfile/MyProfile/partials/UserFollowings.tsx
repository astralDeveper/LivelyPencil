import { useEffect, useState } from "react";
import UsersList from "app/components/User/UsersList";
import {
  useGetFollowersQuery,
  useGetFollowingsQuery,
} from "shared/apis/user/userApi";
import { apiHandler } from "shared/util/handler";
import { Loading } from "app/components";

type UserFollowingsProps = {
  onPressNavigate: (id: string) => void;
  userId: string;
  isFollowersList?: boolean;
};

const useUserFollowings = (id: string, isFollowersList: boolean) => {
  const [users, setUsers] = useState([]);
  const { data, isLoading, error } = useGetFollowingsQuery(id);
  const {
    data: followersData,
    error: followersError,
    isLoading: followersLoading,
  } = useGetFollowersQuery(id);

  useEffect(() => {
    apiHandler({
      data,
      error,
      onSuccess(response) {
        setUsers(response.data);
      },
    });
  }, [data, error]);

  useEffect(() => {
    apiHandler({
      data: followersData,
      error: followersError,
      onSuccess(response) {
        setUsers(response.data);
      },
    });
  }, [followersData, followersError]);

  return {
    users,
    isLoading: isLoading || followersLoading,
  };
};

const UserFollowings = ({
  onPressNavigate,
  userId,
  isFollowersList = false,
}: UserFollowingsProps) => {
  const { users, isLoading } = useUserFollowings(userId, isFollowersList);

  if (isLoading) return <Loading />;

  return <UsersList data={users} onPressNavigate={onPressNavigate} />;
};

export default UserFollowings;
