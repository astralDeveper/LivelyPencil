// NOTE: Perfect Infinit List Implementation:
// I have used InifiniteList Re-Usable Component That perfectly execute onEnd
// When On End Reached if there is data from server then it increment pageCount else not
// so we get that specific data incremented to our list 'data'

import { View, Text, Pressable } from "react-native";
import clsx from "clsx";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import InfiniteScrollList from "../components/InfiniteScrollList";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "shared/hooks/useRedux";
import { setCurrentUser } from "store/slices/auth/authSlice";

// assets

const Users = () => {
  // const { data, isValidating } = useSWR("/users", () => update());
  const { navigate } = useNavigation();
  const flatListRef = useRef(); // Ref for the flatlist
  const lastScrollPosition = useRef(0); // Ref to hold the last scroll position
  const currentUser = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const { userSearchFetchData, userSearchInput } = useAppSelector(
    (state) => state.search
  );
  const [pageCount, setPageCount] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  function gotoOtherProfile(item) {
    console.log(item);
    // navigate("OtherProfile");
  }

  const renderItem = ({ item }) => (
    <Pressable
      // key={item._id}
      delayLongPress={50}
      onLongPress={() => gotoOtherProfile(item)}
      className="flex-1 h-[180px] relative bg-white mx-1 rounded-xl"
      // className="flex-1 h-[180px] relative bg-white mx-1 rounded-xl text-xs"
    >
      <View className="absolute top-0 left-0 right-0 bottom-0 z-20 ">
        <View className=" flex-1 flex-col items-center space-y-1 mt-2">
          <Image
            source={{
              uri: `${process.env.S3}/${item.profilePicture}`,
            }}
            className="h-16 w-16 border-4 border-gray-300 rounded-full"
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          {/* Note: Hide Menu until we get reporting system */}
          {/* <View className="absolute top-0 right-0 ">
            <UserMenu />
          </View> */}

          <Text className="font-Inter-medium text-Primary text-sm">
            {item.fullName}
          </Text>
          <Text className="font-Inter-Black text-black text-xs">
            @
            {item.nickName == null ? item?.email?.split("@")[0] : item.nickName}
          </Text>
          <Pressable
            onPress={() => follow(item)}
            className={clsx(
              "px-4 py-1 bg-white rounded-full border-2 border-Primary",
              {
                "bg-Primary": currentUser?.listofFollowing.includes(item._id),
              }
            )}
          >
            <Text
              className={clsx("text-sm  font-Inter-bold", {
                "text-white": currentUser.listofFollowing.includes(item._id),
              })}
            >
              {currentUser.listofFollowing.includes(item._id)
                ? "UnFollow"
                : "Follow"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  async function update(pageCount) {
    if (userSearchInput) {
      return;
    }

    setLoading(true); // Uncomment this if you manage loading state in your UI
    await axios
      .get(
        `${process.env.EXPO_PUBLIC_API_URL}/users/getPopularUsers?limit=10&page=${pageCount}&sortBy=createdAt:desc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        const newData = resp.data.results;
        if (newData.length > 0) {
          setData((prevData) => [...prevData, ...newData]);
          setPageCount(pageCount); //NOTE: Update the page count only if new data is received
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));

    // setData(addUsers);
  }
  async function follow(item) {
    if (currentUser.listofFollowing.includes(item._id)) {
      const newListofFollowing = currentUser.listofFollowing.filter(
        (obj) => obj != item._id
      );

      const updateUser = {
        ...currentUser,

        user: {
          ...currentUser,
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
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => console.log(response.data))
        .catch((e) => console.log(e.response.data.message));
    } else {
      const newListofFollowing = [...currentUser.listofFollowing, item._id];

      const updateUser = {
        ...currentUser,

        user: {
          ...currentUser,
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
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => console.log(response.data))
        .catch((e) => console.log(e.response.data.message));
    }
  }

  console.log("💜 Users Page 💜");

  useEffect(() => {
    update(1);

    return () => {};
  }, []);
  console.log("PageCount:", pageCount);
  return (
    <View className=" bg-[#ECF5F6] flex-1">
      <InfiniteScrollList
        onEndReached={() => {
          if (!loading) {
            console.log("END REACHED INFINITE");
            update(pageCount + 1);
          }
        }}
        // refreshing={loading}
        // onRefresh={() => {
        //   setPageCount(1);
        //   setData([]);
        //   update(1);
        // }}
        showsVerticalScrollIndicator={false}
        //NOTE: If Search Input has nothing then show common results otherwise users Search Input Results
        data={userSearchInput == "" ? data : userSearchFetchData?.results}
        renderItem={renderItem}
        // keyExtractor={(item) => item._id}
        // onScroll={handleScroll}
        // scrollEventThrottle={400}
        numColumns={2}
        ListEmptyComponent={
          userSearchFetchData?.results?.length == 0 && (
            <View className=" h-screen  items-center">
              <Text className="text-gray-400 ">No user found</Text>
            </View>
          )
        }
        ListFooterComponent={
          loading && (
            <View className=" flex-1 w-10 h-4 items-center m-auto">
              <LottieView resizeMode="cover" source={Load} autoPlay loop />
            </View>
          )
        }
        columnWrapperStyle={{
          marginVertical: 4,
          marginHorizontal: 4,
        }}
      />
    </View>
  );
};

export default Users;
