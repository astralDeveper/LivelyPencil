//NOTE: BACKUP 26Aug2023
import {
  View,
  StatusBar,
  SafeAreaView,
  Text,
  Pressable,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import UserFollowers from "./UserProfile/MyProfile/partials/UserFollowers";
import store from "store";
// $&
import { Image } from "expo-image";
import { API_URL } from "@env";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import UserPages from "./UserProfile/MyProfile/partials/UserPages";
import UserBooks from "./UserProfile/MyProfile/partials/UserBooks";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { Tabs } from "react-native-collapsible-tab-view";
import axios from "axios";
import UserMenu from "../components/UserMenu";
import clsx from "clsx";
import * as Linking from "expo-linking";
import UserFollowings from "./UserProfile/MyProfile/partials/UserFollowings";

export default function UserProfile() {
  const followingsScrollRef = useRef(null);
  const followerScrollRef = useRef(null);

  const [scrollPosition, setScrollPosition] = useState(0);

  const { currentUser, setCurrentUser, setOtherUser } = store();
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState("");
  const [followings, setFollowings] = useState("");

  const navigation = useNavigation();
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const url = () => {
    let userUrl = currentUser.user.link
      ? currentUser.user.link
      : "https://www.livelypencil.com";
    if (!userUrl.includes("https://")) {
      userUrl = "https://" + userUrl;
      return userUrl;
    } else {
      return userUrl;
    }
  };

  const joined = new Date(currentUser?.user?.createdAt);

  async function getFollowers() {
    let config = {
      method: "GET",
      url: `${API_URL}/users/getFollowersByUserId/${currentUser.user.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.tokens.access.token}`,
      },
    };
    try {
      axios.request(config).then((response) => {
        setFollowers(response.data.length);
      });
    } catch (e) {
      console.log(e);
    }
  }
  async function getFollowings() {
    let config = {
      method: "GET",
      url: `${API_URL}/users/getFollowingByUserId/${currentUser.user.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.tokens.access.token}`,
      },
    };
    try {
      axios.request(config).then((response) => {
        setFollowings(response?.data?.length);
      });
    } catch (e) {
      console.log(e);
    }
  }

  function Header() {
    return (
      <View>
        {!currentUser?.user?.coverImg ? (
          <Pressable
            onPress={() => navigation.navigate("UserUpdate")}
            className="h-36 w-full bg-gray-700 absolute "
          >
            <Text className="text-center font-Inter-bold text-xl justify-center mt-10 text-white">
              Add Cover
            </Text>
          </Pressable>
        ) : (
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            source={{
              uri: currentUser.user.coverImg.includes("file")
                ? currentUser.user.coverImg
                : // : `${API_URL}/s3/getMedia/${
                  `${process.env.S3}/${
                    currentUser.user.coverImg
                  }?timestamp=${new Date().getTime()}`,
            }}
            className="w-full h-36 absolute"
          />
        )}

        <Pressable onPress={() => navigation.navigate("UserUpdate")}>
          <Image
            source={{
              uri: currentUser.user.profilePicture.includes("file")
                ? currentUser.user.profilePicture
                : // : `${API_URL}/s3/getMedia/${
                  `${process.env.S3}/${
                    currentUser.user.profilePicture
                  }?timestamp=${new Date().getTime()}`,
            }}
            className="rounded-full w-24 h-24 border-4 border-white mt-16 ml-1"
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        </Pressable>
        <View className=" flex-col   ml-4 justify-center ">
          {/* Checks whether its taken from cache or URL */}

          <Text className="text-Black  text-xl font-Inter-bold">
            {currentUser.user?.fullName}
          </Text>
          <Text className="text-xs text-gray-400 font-Inter-Black">
            @
            {currentUser.user.nickName
              ? currentUser.user.nickName
              : currentUser.user?.email.split("@")[0]}
          </Text>
          <Text className=" text-sm text-gray-400 font-Inter-medium ">
            {currentUser.user.bio ? currentUser.user.bio : "Who am I?"}
          </Text>
          <Text className="font-Inter-medium text-gray-500 text-xs mt-5">
            <AntDesign name="calendar" size={16} color="gray" /> Joined{" "}
            {joined.toLocaleDateString("en-GB", options)}
          </Text>
          <Pressable className="mt-2 flex-row items-center space-x-2">
            <Feather name="link" size={16} color="gray" />
            <Text
              onPress={() => Linking.openURL(url())}
              className="text-blue-300 font-Inter-Black"
            >
              {url()}
              {/* {currentUser.user.link
                ? currentUser.user.link
                : "www.livelyPencil.com"} */}
            </Text>
          </Pressable>
          <View className="flex-row space-x-2 mt-4">
            {/* <View className="flex-row   items-center ">
              <Text className="text-xs font-Inter-bold text-blue-600">
                {currentUser.user.listofFollowers.length}
              </Text>
              <Text className="text-xs font-Inter-bold"> Followers</Text>
            </View> */}

            <View className="flex-row   items-center ">
              <Text className="text-xs font-Inter-bold text-blue-600">
                {followings}
              </Text>
              <Text className="text-xs font-Inter-bold"> Following</Text>
            </View>
            <View className="flex-row   items-center ">
              <Text className="text-xs font-Inter-bold text-blue-600">
                {/* {currentUser?.user?.listofFollowers?.length} */}
                {followers}
              </Text>
              <Text className="text-xs font-Inter-bold"> Followers</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  useEffect(() => {
    const handleFocus = () => {
      getFollowers();
      getFollowings();
    };
    const unsubscribe = navigation.addListener("focus", handleFocus);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Tabs.Container renderHeader={() => <Header />} headerHeight={200}>
        {/* Trick for all scenes , all scenese are wrapped in ScrollView and their flatlists are not scrollable. */}
        <Tabs.Tab name="Pages" style={styles.tabs} label={"Pages"}>
          <Tabs.ScrollView>
            <UserPages />
          </Tabs.ScrollView>
        </Tabs.Tab>

        <Tabs.Tab name="Following" style={styles.tabs} label={"Following"}>
          {/* NOTE: Scroll on follow button clicked, because the re-render of profile/cover was looking bad */}
          <Tabs.ScrollView
            ref={followingsScrollRef}
            // onScroll={(event) => {
            //   const currentY = event.nativeEvent.contentOffset.y;
            //   console.log(currentY);
            //   setScrollPosition(currentY);
            // }}
          >
            <UserFollowings followingsScrollRef={followingsScrollRef} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Followers" style={styles.tabs} label={"Followers"}>
          {/* NOTE: Scroll on follow button clicked, because the re-render of profile/cover was looking bad */}
          <Tabs.ScrollView
            ref={followerScrollRef}
            // onScroll={(event) => {
            //   const currentY = event.nativeEvent.contentOffset.y;
            //   console.log(currentY);
            //   setScrollPosition(currentY);
            // }}
          >
            <UserFollowers followerScrollRef={followerScrollRef} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Streams" style={styles.tabs} label={"Streams"}>
          <Tabs.ScrollView>
            <UserBooks />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabs: {
    fontSize: 100,
    fontWeight: "900",
  },
});
