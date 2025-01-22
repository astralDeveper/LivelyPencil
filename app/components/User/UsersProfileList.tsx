import { useEffect, useState } from "react";
import UsersList from "app/components/User/UsersList";
import {
  useGetFollowersQuery,
  useGetFollowingsQuery,
} from "shared/apis/user/userApi";
import { apiHandler } from "shared/util/handler";
import { Loading } from "app/components";
import { FlatListProps, View } from "react-native";
import { IUserListDisplay } from "shared/types/user/user.type";

interface UsersProfileListProps
  extends Omit<FlatListProps<IUserListDisplay>, "data" | "renderItem"> {
  onPressNavigate: (id: string) => void;
  userId: string;
  isFollowersList?: boolean;
  isTab?: boolean;
}

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
        if (!isFollowersList) setUsers(response.data);
      },
    });
  }, [data, error]);

  useEffect(() => {
    apiHandler({
      data: followersData,
      error: followersError,
      onSuccess(response) {
        if (isFollowersList) setUsers(response.data);
      },
    });
  }, [followersData, followersError]);

  return {
    users,
    isLoading: isLoading || followersLoading,
  };
};

const UsersProfileList = (props: UsersProfileListProps) => {
  const { userId, isFollowersList = false, isTab = false } = props;
  const { users, isLoading } = useUserFollowings(userId, isFollowersList);

  if (isLoading) return <Loading />;

  return (
    <View style={{ flex: 1 }}>
      <UsersList data={users} {...props} />
    </View>
  );
};

export default UsersProfileList;
