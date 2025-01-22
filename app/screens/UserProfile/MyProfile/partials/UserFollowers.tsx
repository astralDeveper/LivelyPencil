import { Image } from "expo-image";
import { View, FlatList, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import { setCurrentUser } from "store/slices/auth/authSlice";
import UserListItemButton from "app/components/User/UsersListItemButton";
import UsersList from "app/components/User/UsersList";

type UserFollowersProps = {
  onPressNavigate: (id: string) => void;
};

const UserFollowers = ({ onPressNavigate }: UserFollowersProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);

  async function getFollowers() {
    let config = {
      method: "GET",
      url: `${process.env.EXPO_PUBLIC_API_URL}/users/getFollowersByUserId/${currentUser?.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      axios.request(config).then((response) => {
        setUsers(response.data.data);
      });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const handleFocus = () => {
      getFollowers();
    };
    const unsubscribe = navigation.addListener("focus", handleFocus);
    return unsubscribe;
  }, [navigation]);

  return <UsersList data={users} onPressNavigate={onPressNavigate} />;
};

export default UserFollowers;
