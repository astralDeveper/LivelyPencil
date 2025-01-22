// components
import { Image } from "expo-image";

import { View, FlatList, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import UserListItemButton from "app/components/User/UsersListItemButton";
import { setCurrentUser } from "store/slices/auth/authSlice";

type OtherFollowingsProps = {
  otherUserId: string;
  navigateToOtherProfile: (id: string) => void;
};

const OtherFollowings = ({
  otherUserId,
  navigateToOtherProfile,
}: OtherFollowingsProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  // const {
  //   currentUser,
  //   setCurrentUser,
  // } = store();

  const [users, setUsers] = useState([]);

  const follow = async (id: string) => {
    if (currentUser?.listofFollowing.includes(id)) {
      const newListofFollowing = currentUser?.listofFollowing.filter(
        (obj) => obj != id
      );

      const updateUser = {
        ...currentUser,

        user: {
          ...currentUser,
          listofFollowing: newListofFollowing,
        },
      };
      //SET STATE
      dispatch(setCurrentUser(updateUser));

      // API Call
      await axios
        .request({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          url: `${process.env.EXPO_PUBLIC_API_URL}/users/unfollow/${id}`,
        })
        .catch((e) => console.log(e.response.data.message));
    } else {
      // API Call
      await axios
        .request({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          url: `${process.env.EXPO_PUBLIC_API_URL}/users/follow/${id}`,
        })
        .catch((e) => console.log(e.response.data.message));
    }
  };

  const renderItem = ({ item, index }) => (
    <Pressable
      key={item._id}
      onPress={() => {
        navigateToOtherProfile(item._id);
      }}
      className=" h-[180px] w-[180] relative bg-white mx-1 rounded-xl"
    >
      <View className="absolute top-0 left-0 right-0 bottom-0 z-20 ">
        <View className=" flex-1 flex-col items-center space-y-1 mt-2">
          <Image
            cachePolicy="memory-disk"
            // source={`${process.env.EXPO_PUBLIC_API_URL}/s3/getMedia/${item.profilePicture}`}
            source={`${process.env.S3}/${item.profilePicture}`}
            className="h-16 w-16 border-4 border-gray-300 rounded-full"
            contentFit="cover"
          />
          {/* Note: Hide Menu until we get reporting system */}

          {/* <View className="absolute top-0 right-0 ">
            <UserMenu />
          </View> */}
          <Text className="font-Inter-medium text-Primary text-sm">
            {item.fullName}
          </Text>
          <Text className="font-Inter-Black text-black text-xs">
            @{item.nickName == null ? item.email.split("@")[0] : item.nickName}
          </Text>
          <UserListItemButton
            isFollowed={
              currentUser?.listofFollowing.includes(item._id) ?? false
            }
            follow={() => follow(item._id)}
          />
        </View>
      </View>
    </Pressable>
  );
  // );

  async function getFollowers() {
    await axios
      .get(
        `${process.env.EXPO_PUBLIC_API_URL}/users/getFollowingByUserId/${otherUserId}?sortBy=createdAt`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((e) => console.log(e.message));
  }
  useEffect(() => {
    getFollowers();
  }, [otherUserId]);

  return (
    <FlatList
      ListEmptyComponent={
        users?.length == 0 && (
          <Text className="mx-auto text-gray-500 mt-20 font-Inter-bold">
            No Followings
          </Text>
        )
      }
      scrollEnabled={false}
      data={
        users.length !== 0 ? users.filter((u) => u._id != currentUser?._id) : []
      }
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={{
        marginVertical: 4,
        marginHorizontal: 4,
      }}
    />
  );
};

export default OtherFollowings;
