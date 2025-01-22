// components
import { Image } from "expo-image";
import {
  View,
  FlatList,
  Text,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import clsx from "clsx";
import axios from "axios";
import store from "store";
import { UserMenu } from "components";
// $&
import useSWR from "swr";
import { useEffect, useState } from "react";
// $&
import { Ionicons } from "@expo/vector-icons";

// assets

const PopularUsers = () => {
  const params = useLocalSearchParams();
  // const [data, setData] = useState(null);
  const router = useRouter();
  const { currentUser, setCurrentUser } = store(); // setOther : we set selecter user data to it to be used in Model in OtherProfile
  // State of follow button

  async function follow(item) {
    if (currentUser.user.listofFollowing.includes(item._id)) {
      const newListofFollowing = currentUser.user.listofFollowing.filter(
        (obj) => obj != item._id
      );

      const updateUser = {
        ...currentUser,

        user: {
          ...currentUser.user,
          listofFollowing: newListofFollowing,
        },
      };
      //SET STATE
      setCurrentUser(updateUser);

      // API Call
      await axios
        .request(
          `${process.env.EXPO_PUBLIC_API_URL}/users/unfollow/${item._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser.tokens.access.token}`,
            },
          }
        )
        .then((response) => console.log(response.data))
        .catch((e) => console.log(e.response.data.message));
    } else {
      const newListofFollowing = [
        ...currentUser.user.listofFollowing,
        item._id,
      ];

      const updateUser = {
        ...currentUser,

        user: {
          ...currentUser.user,
          listofFollowing: newListofFollowing,
        },
      };
      //SET STATE
      setCurrentUser(updateUser);

      // API Call
      await axios
        .request(
          `${process.env.EXPO_PUBLIC_API_URL}/users/follow/${item._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser.tokens.access.token}`,
            },
          }
        )
        .then((response) => console.log(response.data))
        .catch((e) => console.log(e.response.data.message));
    }
  }

  const renderItem = ({ item }) => {
    return (
      <View
        key={item._id}
        className="flex-1 h-[180px] relative bg-white mx-1 rounded-xl text-xs border border-gray-100"
      >
        <View className="absolute top-0 left-0 right-0 bottom-0 z-20 ">
          <View className=" flex-1 flex-col items-center space-y-1 mt-2">
            <Image
              cachePolicy="none"
              source={`${process.env.S3}/${item.profilePicture}`}
              className="h-16 w-16 border border-brand rounded-full"
              contentFit="cover"
            />

            <Text className="font-Inter-bold text-textColor1 text-sm">
              {/* If there is no name , use email username , if name is longer than 18 chars split by 18th */}
              {item.fullName == "" || item.fullName == null
                ? item.email.split("@")[0].length > 18
                  ? item.email.split("@")[0].slice(0, 18)
                  : item.email.split("@")[0]
                : item?.fullName}
            </Text>
            <Text className="font-Inter-Black text-textColor2 text-xs">
              @
              {item.nickName == null ? item.email.split("@")[0] : item.nickName}
            </Text>
            <Pressable
              onPress={() => follow(item)}
              className={clsx(
                "px-4 py-1 bg-white rounded-full border border-brand",
                {
                  "bg-brand": currentUser.user?.listofFollowing.includes(
                    item._id
                  ),
                }
              )}
            >
              <Text
                className={clsx("text-sm  font-Inter-bold text-brand", {
                  "text-white": currentUser.user?.listofFollowing.includes(
                    item._id
                  ),
                })}
              >
                {currentUser.user.listofFollowing.includes(item._id)
                  ? "Following"
                  : "Follow"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  async function update() {
    const res = await axios
      .request(
        `${process.env.EXPO_PUBLIC_API_URL}/categories/getAllUsersByGivenCategories?page=1&limit=10`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },

          data: JSON.stringify({
            categories: params.catList,
            // categories: [
            //   "645493a50621eb48e4b60dcd",
            //   "6454939c0621eb48e4b60dcb",
            //   "645493630621eb48e4b60dc9",
            //   "6454935d0621eb48e4b60dc7",
            //   "64514f8d288349464328fe36",
            //   "6454930c0621eb48e4b60dc1",
            // ],
          }),
        }
      )
      .catch((e) => console.log("update", e));

    return res.data;
  }
  const { data, isValidating, error } = useSWR("popularUsers", () => update());
  // useEffect(() => {
  //   update();
  // }, [params.catList]);
  // console.log(error);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // marginTop: StatusBar.currentHeight || 0,
      }}
    >
      <View className="mt-2 ml-4 space-y-2">
        <View className="flex-row space-x-4">
          <Ionicons
            name="chevron-back-sharp"
            size={28}
            color="#393A44"
            onPress={() => router.back()}
          />
          <Text
            onPress={() => console.log(currentUser.tokens.access.token)}
            className="text-xl font-Inter-bold text-textColor1 "
          >
            Popular Publishers
          </Text>
        </View>
        <Text className="text-xs font-Inter-Black text-textColor2 pr-24">
          Browse popular publishers based on the categories you followed.
        </Text>
      </View>
      <View className="flex-1 bg-white">
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data?.results}
          renderItem={renderItem}
          // keyExtractor={(item) => item.id}
          numColumns={2}
          // onEndReached={() => {
          //   setPageCount((prev) => prev + 10);
          //   mutate("/users");
          // }}

          columnWrapperStyle={{
            marginVertical: 4,
            marginHorizontal: 4,
          }}
        />
      </View>
      <Pressable
        onPress={() => router.replace("screens/Home")}
        className="w-[95%] py-2 items-center  rounded-full mx-auto  bg-brand"
      >
        <Text className="text-base text-white  font-Inter-bold">Next</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default PopularUsers;
