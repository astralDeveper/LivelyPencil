import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Text,
  Image,
  Alert,
  ScrollView,
  ToastAndroid,
} from "react-native";
import PagerView from "react-native-pager-view";
import RenderHTML, { TNodeChildrenRenderer } from "react-native-render-html";
import { decode } from "he";
import CustomImage from "../components/CustomImage";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
// $&
import { Ionicons, Feather } from "@expo/vector-icons";

import moment from "moment/moment";
import axios from "axios";
import { API_URL } from "@env";
import store from "store";
import clsx from "clsx";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import DivRenderer, {
  PageSystemDivRenderer,
  SpanRenderer,
} from "../components/DivRenderer";
import End from "assets/svg/End.json";
import Heart from "assets/svg/Heart.json";
import ProfileShimmer from "assets/svg/ProfileShimmer.json";
import { CustomEndPage } from "../components/CustomEndPage";

// const { width } = Dimensions.get("window");

const VerticalPager = ({
  data,
  indexNumber,
  lastpage,
  setData,
  currentUserLikedPages,
  setCurrentUserLikedPages,
}) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { currentUser, setCurrentUser, setOtherUser } = store();
  const [currentIndex, setCurrentIndex] = useState(0);
  const pagerViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pLoading, setPLoading] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const timeoutId = useRef(null); // For PageViewCount for every 5 Seconds.

  // Current Page
  let Page = data?.results?.filter((page) => page.isEnabled)[currentIndex];

  // This will change index as per page index
  const onPageSelected = (event) => {
    const newIndex = event.nativeEvent.position;
    setCurrentIndex(newIndex);

    //------------------PageViewCount-Logic-------------------------
    // using newIndex / "Page" variable was sending request to previous page.
    let thisPage = data?.results?.filter((page) => page.isEnabled)[newIndex];
    // Clear timer
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    // Note: PageView count sent if user stay on page for atleast 5 seconds
    timeoutId.current = setTimeout(() => {
      pageViewed(thisPage?._id);
      // console.log(`You Stayed 1 Second ${newIndex}`);
    }, 1000);
    //-------------------------------------------------------------------
    //NOTE: here you can call some function when last page hits
    if ((newIndex === data.results.length - 1) & !lastpage) {
      // ToastAndroid.show("The End", ToastAndroid.SHORT);
    }
  };
  // This will goto page without animation
  const goToPageWithoutAnimation = (pageIndex) => {
    pagerViewRef.current?.setPageWithoutAnimation(pageIndex);
  };

  // Custom End Page
  // const CustomEndPage = () => {
  //   return (
  //     <CustomEndPage/>
  //   );
  // };
  // Page Viewed by user
  const pageViewed = async (id) => {
    if (!id) {
      //if there is no id then it means it is customEndPage so don't execute
      return;
    }
    await axios
      .request(`${API_URL}/pages/newPageViewCount/${id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })
      // .then((response) => {
      //   const updatedResults = data.results.map((item) => {
      //     if (item._id === id) {
      //       return {
      //         ...item,
      //         pageViewCount: item.pageViewCount + 1,
      //       };
      //     }
      //     return item;
      //   });
      //   setData((prevState) => ({
      //     ...prevState,
      //     results: updatedResults,
      //   }));
      // })
      .catch((e) => console.log(e));
  };

  const onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setShowHeart(true);
      likePage();
    }
  };

  const visitProfile = async (id) => {
    setPLoading(true);
    await axios
      .get(`${API_URL}/users/getUserById/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })
      .then((res) => {
        setOtherUser(res.data);
        navigation.navigate("OtherProfile");
      })
      .finally(() => setPLoading(false))
      .catch((e) => console.log(e));
  };

  const follow = async (item) => {
    if (currentUser.user.listofFollowing.includes(item)) {
      const newListofFollowing = currentUser.user.listofFollowing.filter(
        (obj) => obj != item
      );

      // API Call
      try {
        const updateUser = {
          ...currentUser,

          user: {
            ...currentUser.user,
            listofFollowing: newListofFollowing,
          },
        };

        //SET STATE
        setCurrentUser(updateUser);

        const response = await axios.request(
          `${API_URL}/users/unfollow/${item}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser.tokens.access.token}`,
            },
          }
        );

        if (response.status !== 200) {
          // fallback
        }
      } catch (e) {
        console.log(e.message);

        // fallback
      }
    } else {
      const newListofFollowing = [...currentUser.user.listofFollowing, item];

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

      try {
        await axios.request(`${API_URL}/users/follow/${item}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  // Like page
  async function likePage() {
    setLoading(true);
    await axios
      .request(`${API_URL}/pages/likePage/${Page?._id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })
      .then(() => {
        console.log("Liked");
        const updatedPages = data.results.map((page) => {
          if (
            (page._id === Page?._id) &
            !currentUserLikedPages.includes(page._id)
          ) {
            currentUserLikedPages.push(page._id);
            return {
              ...page,
              likesCount: page.likesCount + 1,
            };
          }
          return page;
        });
        setData({ ...data, results: updatedPages });
      })
      .finally(() => setLoading(false))
      .catch((e) => console.log(e));
  }
  // Like page
  async function unLike() {
    setLoading(true);
    await axios
      .request(`${API_URL}/pages/unlikePage/${Page?._id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })
      .then(() => {
        const updatedPages = data.results.map((page) => {
          if (
            (page._id === Page?._id) &
            currentUserLikedPages.includes(page._id)
          ) {
            let newlist = currentUserLikedPages.filter((id) => id != page._id);
            setCurrentUserLikedPages(newlist);
            return {
              ...page,
              likesCount: page.likesCount - 1,
            };
          }
          return page;
        });
        setData({ ...data, results: updatedPages });
      })
      .finally(() => setLoading(false))
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    let initialIndex = indexNumber || 0;

    if (lastpage) {
      initialIndex = lastpage - 1; // Set the initial index to the last page
    }
    setCurrentIndex(initialIndex);
    goToPageWithoutAnimation(initialIndex);
  }, [indexNumber]); //EXP: We changed PageSystem useEffect Dependency and this dependency, either bookId or indexNumber is changed then it will show as accordingly

  //Show Heart
  useEffect(() => {
    if (showHeart) {
      const timer = setTimeout(() => {
        setShowHeart(false);
      }, 1500); // hide after 1500ms

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showHeart]);

  if (!data) {
    return (
      <View className="w-10 h-10  items-center m-auto">
        <LottieView resizeMode="cover" source={Load} autoPlay loop />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {showHeart && (
        <View style={styles.heartContainer}>
          {/* <Ionicons name="ios-heart" size={400} color="red" /> */}
          <View style={{ width: 300, height: 300 }}>
            <LottieView
              resizeMode="cover"
              source={Heart}
              autoPlay
              loop={false}
            />
          </View>
        </View>
      )}
      {data.results[currentIndex] && (
        <View className="justify-between flex-row items-center mx-2 bg-white">
          <View className="flex-row items-center">
            <Ionicons
              name="chevron-back-sharp"
              size={28}
              color="#3B70B7"
              onPress={() => navigation.goBack()}
            />
            {/* On Click Visit Profile | Apply Shimmer too */}
            {pLoading ? (
              <View className="h-10 w-36">
                <LottieView
                  resizeMode="cover"
                  source={ProfileShimmer}
                  autoPlay
                  loop
                />
              </View>
            ) : (
              <Pressable
                className="flex-row"
                onPress={() => visitProfile(data?.results[0]?.authorId)}
              >
                <Image
                  className="w-10 h-10 rounded-full mr-3"
                  source={{
                    // uri: `${API_URL}/s3/getMedia/${data?.results[0]?.authorProfilePicture}`,
                    uri: `${process.env.S3}/${data?.results[0]?.authorProfilePicture}`,
                  }}
                />
                <View>
                  <Text className="text-base font-Inter-medium">
                    @{data?.results[0]?.authorFullName}
                  </Text>
                  <Text className="text-Primary font-Inter-medium text-sm">
                    {data?.results[0]?.bookName?.length < 17
                      ? data?.results[0]?.bookName
                      : data?.results[0]?.bookName?.substring(0, 17) + "..."}
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
          <View>
            <Text className="text-base font-Inter-bold text-Primary">
              {
                data?.results?.filter((page) => page.isEnabled)[currentIndex]
                  ?.pageShortCode
              }
            </Text>
            <Text>
              {moment(data?.results[currentIndex]?.createdAt).fromNow()}
            </Text>
          </View>
        </View>
      )}
      <PagerView
        initialPage={currentIndex}
        style={{ flex: 1 }}
        orientation="horizontal"
        onPageSelected={onPageSelected}
        ref={pagerViewRef}
      >
        {/* Note: this was comented before inserting custom page at end */}
        {/* {data.results.map((item, index) => { */}
        {data.results.concat({ customEndPage: true }).map((item, index) => {
          if (item.customEndPage) {
            return (
              <CustomEndPage
                key="custom-end-page"
                authorId={data?.results[0]?.authorId}
              />
            );
          }

          const htmlContent = decode(item.history.items[0].rawHtmlContent);

          return (
            <TapGestureHandler
              numberOfTaps={2}
              onHandlerStateChange={onDoubleTap}
              key={index}
            >
              <ScrollView
                className="flex-1"
                key={index}
                showsVerticalScrollIndicator={false}
              >
                <RenderHTML
                  style={{ width }}
                  ignoredDomTags={["font"]}
                  tagsStyles={{
                    body: {
                      fontSize: 17,
                    },
                    // span: {
                    //   fontSize: 17,
                    //   marginHorizontal: "2%",
                    // },
                    // b: { marginHorizontal: 10 },
                    h1: {
                      fontWeight: "normal",
                      marginHorizontal: 10,
                      fontSize: 40,
                    },
                  }}
                  contentWidth={width}
                  source={{ html: htmlContent }}
                  renderers={{
                    img: (htmlAttribs) => {
                      const src = htmlAttribs.tnode.init.domNode.attribs;
                      return <CustomImage htmlAttribs={src} />;
                    },
                    div: PageSystemDivRenderer,
                    span: SpanRenderer,
                  }}
                />

                {/* Last page Shows this  */}
                {/* {data.results.length - 1 === index && (
                  <View className=" justify-center items-center mt-2 mx-auto bg-transparent">
                    <View className="border-2 border-Primary rounded-full ">
                      <Text className="mx-5 text-black/80 font-Inter-bold">
                        Check More Streams by{" "}
                        <Text className="font-Inter-extrabold text-Primary">
                          {data?.results[0]?.authorFullName}
                        </Text>
                      </Text>
                    </View>
                    <LottieView
                      resizeMode="cover"
                      source={End}
                      autoPlay
                      loop={true}
                    />
                  </View>
                )} */}
              </ScrollView>
            </TapGestureHandler>
          );
        })}
      </PagerView>

      {/* We are Removing Bottom bar because this item of data is not real, this is custom we are showing users last page */}
      {data.results[currentIndex] && (
        <View className="w-screen flex-row items-center justify-around  bg-white   border-gray-300">
          {data?.results?.filter((page) => page.isEnabled)[0]?.authorId !=
            currentUser?.user?.id && (
            <Pressable
              onPress={() =>
                follow(
                  data?.results?.filter((page) => page.isEnabled)[0]?.authorId
                )
              }
              className={clsx(
                "px-4 py-1  bg-white rounded-full border-2 border-Primary",
                {
                  "bg-Primary": currentUser.user?.listofFollowing?.includes(
                    data?.results?.filter((page) => page.isEnabled)[0]?.authorId
                  ),
                }
              )}
            >
              <Text
                className={clsx("text-sm  font-Inter-bold", {
                  "text-white": currentUser.user?.listofFollowing.includes(
                    data?.results?.filter((page) => page.isEnabled)[0]?.authorId
                  ),
                })}
              >
                {currentUser.user.listofFollowing.includes(
                  data?.results?.filter((page) => page.isEnabled)[0]?.authorId
                )
                  ? "Unfollow"
                  : "Follow"}
              </Text>
            </Pressable>
          )}
          {/* Bottom Panel FOLLOW | COMMENTS | LIKES */}

          <View className="flex-row space-x-6  my-1">
            <View className="flex-row items-baseline space-x-1">
              <Feather name="bar-chart-2" size={32} color="black" />
              <Text className="text-Primary font-Inter-medium text-xs">
                {Page?.pageViewCount}
              </Text>
            </View>
            <View className="flex-row space-x-1 items-baseline">
              <Ionicons
                disabled={loading}
                onPress={() =>
                  currentUserLikedPages?.includes(Page?._id)
                    ? unLike()
                    : likePage()
                }
                name={
                  currentUserLikedPages?.includes(Page?._id)
                    ? "ios-heart"
                    : "heart-outline"
                }
                size={32}
                color="red"
                // color={
                //   currentUserLikedPages?.includes(Page?._id) ? "red" : "gray"
                // }
              />
              <Text className="text-Primary font-Inter-medium text-xs ">
                {Page?.likesCount}
              </Text>
            </View>
            <View className="flex-row space-x-1 items-baseline">
              <Ionicons
                onPress={() =>
                  navigation.navigate("Discussion", {
                    bookRef: Page?.bookId,
                    pageRef: Page?._id,
                    pageShortCode: Page?.pageShortCode,
                    totalComments: Page?.commentsCount + Page?.repliesCount,
                  })
                }
                name="chatbox-ellipses-outline"
                size={32}
                color="black"
              />
              <Text className="text-Primary font-Inter-medium text-xs ">
                {Page?.commentsCount + Page?.repliesCount}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default VerticalPager;

const styles = StyleSheet.create({
  heartContainer: {
    position: "absolute",
    top: "30%",
    left: "20%",
    transform: [{ translateX: -30 }, { translateY: -30 }], // assuming heart icon is 60x60
    zIndex: 10,
  },
});
