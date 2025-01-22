import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RichTextEditor from "./partials/RichTextEditor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ScrollableText from "app/components/ScrollableText";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StreamStackNavigatorProps } from "shared/navigators/StreamStackNavigator";
import usePageEditor from "./usePageEditor";
import { Loading } from "app/components";
import { Text } from "app/components/ui";
import { ChevronLeft } from "react-native-feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePages from "../Pages/usePages";

export default function PageEditor() {
  const { goBack } = useNavigation<StreamStackNavigatorProps>();
  const { width } = useWindowDimensions();
  const {
    page,
    isLoading,
    handleGoLive,
    handleOffline,
    gotoDiscussion,
    lastComment,
    showComments,
    setShowComments,
    goLive,
    fullNamesString,
    uniqueFullNamesCount,
    pageNumber,
    storedPagesLength2
    
  } = usePageEditor();

  const adjustedIndex = page?.indexOfPage === undefined ? null : (page.indexOfPage === 0 ? 1 : page.indexOfPage);
 

// console.log("pageData",adjustedIndex,page?.indexOfPage,)
  const { top } = useSafeAreaInsets();

  // console.log("firstfirstfirstfirst",page)
const [overMe,setOverMe]=useState(false)
  // async function getAllComments() {
  //   const id = page?._id;
  //   await axios
  //     .get(
  //       `${process.env.EXPO_PUBLIC_API_URL}/pages/getAllCommentsByPageId/${id}?sortBy=createdAt:desc&limit=5`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       let commentsString = res.data.results
  //         .map((comment) => {
  //           let fullName = comment.userRef.fullName;
  //           return ` ${fullName}: ${comment.commentText} `;
  //         })
  //         .join("");
  //       setLastComment(commentsString);
  //     })
  //     .catch((e) => console.log(e.message));
  // }

  if (isLoading) return <Loading />;

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        paddingTop: top,
      }}
    >
      {/* HEADER */}
      <View className="flex-row  items-center border-b-2 border-gray-300/80 justify-between mr-2 bg-white">
        {showComments && (
          <View className="flex-row absolute z-10">
            <View
              className="flex-row  bg-yellow-300  py-2 mr-0.5 justify-between"
              style={{ width }}
            >
              <View className="absolute  top-3 ">
                <ScrollableText text={lastComment} />
              </View>
              <AntDesign
                style={{
                  backgroundColor: "#FDE047",
                  zIndex: 1000,
                  marginLeft: 2,
                  marginRight: 2,
                  borderRadius: 50,
                }}
                onPress={() => setShowComments(!showComments)}
                name="closecircleo"
                size={25}
                color="black"
              />
            </View>
            <Pressable
              // onPress={() =>
              //   navigation.navigate("Discussion", {
              //     bookRef: params?.page?.bookId,
              //     pageRef: params?.draftPageId,
              //   })
              // }
              className="flex-row absolute right-0   py-2 bg-yellow-300 items-center "
            >
              <Ionicons
                onPress={gotoDiscussion}
                name="ios-chatbox-ellipses-outline"
                size={20}
                color="black"
              />
              <Ionicons
                style={{ backgroundColor: "#FDE047" }}
                name="chevron-forward-sharp"
                size={24}
                color="black"
              />
            </Pressable>
          </View>
        )}

        <View className="flex-row items-center">
          <TouchableOpacity
            style={{ backgroundColor: "#F7F8F8", padding: 4, borderRadius: 8 }}
            onPress={goBack}
          >
            <ChevronLeft color="#4B4B4B" />
          </TouchableOpacity>
          <Text className="text-base font-Inter-medium color-textColor1">
            {/* We are using || because we are sending page in params from draft Check also, that is not similar to bookpages response.  */}
            {/* #{page?.pageNumber || page?.results[0].pageNumber} */}
            {pageNumber !== undefined
              ? `#Page ${pageNumber}`
              : `#Page ${page?.indexOfPage ?? page?.pageNumber}`}
          </Text>

          <View className="flex-row ml-10 items-center">
            <Text className="font-Inter-Black text-xs text-gray-400">Live</Text>
            {goLive ? (
              <MaterialCommunityIcons
                name="toggle-switch"
                size={40}
                color="#FF0000"
                onPress={() =>
                {
                setOverMe(false)
                  Alert.alert("Confirm", "Do you want to go Offline", [
                    { text: "Confirm", onPress: () => handleOffline() },
                    { text: "Cancel", style: "cancel" },
                  ])
                  AsyncStorage.setItem("ForLive", JSON.stringify(false)).catch((error) => {
                    console.error("Error saving to AsyncStorage:", error);
                  });
                }
                }
              />
            ) : (
              <MaterialCommunityIcons
                name="toggle-switch-off"
                size={40}
                color="#909198"
                // onPress={() =>
                //   Alert.alert("Confirm", "Do you want to go Online", [
                //     { text: "Confirm", onPress: () => {
                //       setOverMe(true)
                //       handleGoLive()
                //       AsyncStorage.setItem("ForLive"){overMe}
                //     } },
                //     { text: "Cancel", style: "cancel" },
                //   ])
                // }
                onPress={() =>{
                  if (!storedPagesLength2 || storedPagesLength2 < 0 ) {
                    Alert.alert("Info","You must publish at least one page to open live broadcast ")
                  }else{
                  Alert.alert("Confirm", "Do you want to go Online", [
                    {
                      text: "Confirm",
                      onPress: () => {
                        setOverMe(true);
                        // Store the value in AsyncStorage
                        AsyncStorage.setItem("ForLive", JSON.stringify(true)).catch((error) => {
                          console.error("Error saving to AsyncStorage:", error);
                        });
                        handleGoLive();
                      }
                      },
                  
                    { text: "Cancel", style: "cancel" },
                  ])
                }
                  }
                }
                
              />
            )}
          </View>
        </View>

        <View className="flex-row bg-white">
          {goLive && (
            <View className="flex-row space-x-4">
              <Pressable
                onPress={() =>
                  Alert.alert(
                    `Total Viewers : ${uniqueFullNamesCount || 0}`,
                    `${fullNamesString || ""}`,
                    [],
                    { cancelable: true }
                  )
                }
                className=" flex-row items-center space-x-2"
              >
                <AntDesign name="eyeo" size={24} color="black" />
                <Text>{uniqueFullNamesCount || 0}</Text>
              </Pressable>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color="black"
                onPress={gotoDiscussion}
              />
              <Pressable
                onPress={() => setShowComments(!showComments)}
                className="flex-row items-center space-x-2"
              >
                <View className="flex-row">
                  {/* <Ionicons name="chevron-back" size={24} color="black" /> */}
                </View>
                {/* <Text>
                  {(page?.commentsCount ?? 0) + (page?.repliesCount ?? 0)}
                </Text> */}
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <RichTextEditor />
    </View>
  );
}
