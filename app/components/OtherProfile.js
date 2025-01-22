import { View, SafeAreaView, Text, Pressable } from "react-native";
import clsx from "clsx";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { Image } from "expo-image";
// import { API_URL } from "@env";
import store from "store";
import axios from "axios";
import OtherPages from "../screens/PageStack/OtherProfile/partials/OtherPages";
import OtherFollowers from "../screens/PageStack/OtherProfile/partials/OtherFollowers";
import OtherBooks from "../screens/PageStack/OtherProfile/partials/OtherBooks";
import { Tabs } from "react-native-collapsible-tab-view";
// $&
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import OtherFollowings from "../screens/PageStack/OtherProfile/partials/OtherFollowings";
import * as Linking from "expo-linking";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";

export default function OtherProfile() {
  const followingsScrollRef = useRef(null);
  const followerScrollRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { otherUser, currentUser, setCurrentUser } = store();
  const navigation = useNavigation();

  const url = () => {
    let userUrl = otherUser.link
      ? otherUser.link
      : "https://www.livelypencil.com";
    if (!userUrl.includes("https://")) {
      userUrl = "https://" + userUrl;
      return userUrl;
    } else {
      return userUrl;
    }
  };

  const follow = async (item) => {
    setLoading(true);
    if (currentUser.user.listofFollowing.includes(item._id)) {
      const newListofFollowing = currentUser.user.listofFollowing.filter(
        (obj) => obj != item._id
      );

      // API Call
      await axios
        .request(`${API_URL}/users/unfollow/${item._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },
        })
        .then(() => {
          const updateUser = {
            ...currentUser,

            user: {
              ...currentUser.user,
              listofFollowing: newListofFollowing,
            },
          };
          //SET STATE
          setCurrentUser(updateUser);
          setLoading(false);
        })
        .catch((e) => console.log(e.response.data.message));

      return;
    } else {
      // API Call
      await axios
        .request(`${API_URL}/users/follow/${item._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },
        })
        .then(() => {
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
          setLoading(false);
        })
        .catch((e) => console.log(e.response.data.message));
    }
  };
  const joined = new Date(otherUser?.createdAt);
  const Header = () => {
    return (
      <View style={{ flex: 1 }} className="bg-white">
        <View className="flex-row justify-between w-full  z-40 absolute">
          <Ionicons
            onPress={() => navigation.goBack()}
            name="chevron-back-sharp"
            size={28}
            color="white"
          />
        </View>
        {!otherUser?.coverImg ? (
          <View
            onPress={() => navigation.navigate("UserUpdate")}
            className="h-36 w-full bg-gray-700 absolute"
          >
            <Text className="text-center font-Inter-bold text-xl justify-center mt-10 text-white">
              No Cover
            </Text>
          </View>
        ) : (
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            source={{
              uri: `${process.env.S3}/${otherUser?.coverImg}`,
            }}
            className="w-full h-36 absolute"
          />
        )}
        <View className=" flex-col ml-2">
          {/* Checks whether its taken from cache or URL */}
          <Image
            source={{
              uri: `${process.env.S3}/${otherUser?.profilePicture}`,
            }}
            className="rounded-full w-24 h-24 border-white mt-[18%] border-4"
            contentFit="cover"
          />
          <View className="flex-col ml-2">
            <Text className="text-Black text-xl font-Inter-bold">
              {otherUser?.fullName}
            </Text>
            <Text className="text-xs text-gray-400 font-Inter-Black">
              @
              {otherUser.nickName
                ? otherUser?.nickName
                : otherUser?.email?.split("@")[0]}
            </Text>
            <Text className="text-sm text-gray-400 font-Inter-medium">
              {otherUser.bio ? otherUser.bio : "Who am I?"}
            </Text>
            <Text className="font-Inter-medium text-gray-500 text-xs mt-5">
              <AntDesign name="calendar" size={16} color="gray" /> Joined{" "}
              {joined.toLocaleDateString("en-GB", options)}
            </Text>
            <View className="mt-2 flex-row items-center space-x-2">
              <Feather name="link" size={16} color="gray" />
              <Text
                onPress={() => Linking.openURL(url())}
                className="text-blue-300 font-Inter-Black text-xs"
              >
                {url()}
                {/* {`livelypencil.com/${
                  otherUser?.nickName || otherUser?.email.split("@")[0]
                }`} */}
              </Text>
            </View>
          </View>
          {/* FOLLOWERS/FOLLOWINGS/ and leave button all in flex-row */}
          <View className="w-screen px-2 pr-5 justify-between flex-row items-center mt-2">
            <View className="flex-row space-x-2 ">
              <View className="flex-row   items-center ">
                <Text className="text-xs font-Inter-bold text-blue-600">
                  {otherUser?.listofFollowers?.length ||
                    otherUser?.totalFollowers}
                </Text>
                <Text className="text-xs font-Inter-bold"> Followers</Text>
              </View>
              <View className="flex-row   items-center ">
                <Text className="text-xs font-Inter-bold text-blue-600">
                  {otherUser?.listofFollowing?.length ||
                    otherUser?.totalFollowings ||
                    0}
                </Text>
                <Text className="text-xs font-Inter-bold"> Following</Text>
              </View>
            </View>
            <View>
              {/* {loading ? (
                <ActivityIndicator color="blue" style={{ margin: 10 }} />
              ) : ( */}
              {loading ? (
                <View className="border-Primary border-2 rounded-full px-1.5">
                  <LottieView
                    resizeMode="cover"
                    source={Load}
                    autoPlay
                    loop
                    style={{
                      width: 50,
                      height: 30,

                      marginHorizontal: 20,
                      alignSelf: "center",
                    }}
                  />
                </View>
              ) : (
                <Pressable
                  onPress={() => follow(otherUser)}
                  className={clsx(
                    "px-4 py-1  rounded-full bg-white border-Primary border-2",
                    {
                      "bg-Primary": currentUser.user?.listofFollowing.includes(
                        otherUser._id
                      ),
                    }
                  )}
                >
                  <Text
                    className={clsx("text-sm text-white  font-Inter-bold", {
                      "text-white": currentUser.user?.listofFollowing.includes(
                        otherUser._id
                      ),
                      "text-Primary":
                        !currentUser.user?.listofFollowing.includes(
                          otherUser._id
                        ),
                    })}
                  >
                    {currentUser.user.listofFollowing.includes(otherUser._id)
                      ? "Unfollow"
                      : "Follow"}
                  </Text>
                </Pressable>
              )}
              {/* )} */}
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Tabs.Container renderHeader={() => <Header />} headerHeight={200}>
        {/* Trick for all scenes , all scenese are wrapped in ScrollView and their flatlists are not scrollable. */}
        <Tabs.Tab name="Pages" label="Pages">
          <Tabs.ScrollView>
            <OtherPages id={otherUser._id} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Followers" label="Followers">
          <Tabs.ScrollView ref={followerScrollRef}>
            <OtherFollowers
              id={otherUser._id}
              followerScrollRef={followerScrollRef}
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Following" label="Following">
          <Tabs.ScrollView ref={followingsScrollRef}>
            <OtherFollowings
              id={otherUser._id}
              followingsScrollRef={followingsScrollRef}
            />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Streams" label="Streams">
          <Tabs.ScrollView>
            <OtherBooks id={otherUser._id} />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </SafeAreaView>
  );
}
