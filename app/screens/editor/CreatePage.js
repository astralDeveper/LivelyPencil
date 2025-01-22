import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RichTextEditor from "screens/editor/RichTextEditor";
import { API_URL } from "@env";

// $&
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useEffect, useState, useContext } from "react";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ScrollableText from "../../components/ScrollableText";
import store from "store";
import { SocketContext } from "../Socket/SocketProvider";
import { Alert } from "react-native";
import axios from "axios";

export default function CreatePage() {
  const navigation = useNavigation();
  const { currentUser } = store();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams();
  const [lastComment, setLastComment] = useState("");

  const {
    setLiveBookRooms,
    liveBookSocket,
    liveBookRooms,
    viewers,
    discussionSocket,
  } = useContext(SocketContext);
  // onPress Eye Icon All Joined Users in one long string with new line between them
  const fullNames = viewers?.liveBook?.joinedFollowers?.map(
    (follower) => follower.fullName
  );

  //---------Total Comments & Replies--------------
  let comments = 0;
  const totalComments = () => {
    if (params.page.results) {
      comments =
        params.page.results[0].commentsCount +
        params.page.results[0].repliesCount;
    } else if (params.page.commentsCount) {
      comments = params.page.commentsCount + params.page.repliesCount;
    }
  };
  totalComments();
  //-----------------------------------------------------

  //---------------Goto----Discussion--------------------
  function gotoDiscussion() {
    // We get page param from either BookPages or Continue function RichText they are different
    if (params.page.results) {
      return navigation.navigate("Discussion", {
        bookRef: params.page.bookId,
        pageRef: params.page.results[0]._id,
        pageShortCode: params.page.results[0].bookShortCode.split("/")[1],
        totalComments:
          params.page.results[0].commentsCount +
          params.page.results[0].repliesCount,
      });
    } else {
      return navigation.navigate("Discussion", {
        bookRef: params.page.bookId,
        pageRef: params.page._id,
        pageShortCode: "",
        totalComments: params.page.commentsCount + params.page.repliesCount,
      });
    }
  }
  //-------------------------------------------------------

  //----------------Get-All-Comments-----------------------
  async function getAllComments() {
    const id = params?.page._id || params?.page?.results[0]?._id;
    await axios
      .get(
        `${API_URL}/pages/getAllCommentsByPageId/${id}?sortBy=createdAt:desc&limit=5`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },
        }
      )
      .then((res) => {
        let commentsString = res.data.results
          .map((comment) => {
            // Assuming userRef has a property called fullName
            let fullName = comment.userRef.fullName;
            return ` ${fullName}: ${comment.commentText} `;
          })
          .join("");
        setLastComment(commentsString);
      })
      .catch((e) => console.log(e.message));
  }

  //-------------------------------------------------------

  const uniqueFullNames = [...new Set(fullNames)]; // To Avoid duplicates
  const uniqueFullNamesCount = new Set(fullNames).size;

  const fullNamesString = uniqueFullNames?.join("\n");
  // Author posted page, and come again to post new page. This
  const leftRoomCheck = liveBookRooms.includes(params.page.bookId);
  const [goLive, setGoLive] = useState(leftRoomCheck);
  const [pageNumber, setPageNumber] = useState("");
  const [showComments, setShowComments] = useState(false);

  //It will see last page number
  // const lastPage = params?.bookData?.results[0]?.pageNumber || 0;

  function handleGoLive() {
    setGoLive(true);
    liveBookSocket.emit("turn_on_book_live_mode", {
      bookId: params.page.bookId,
      authorId: currentUser.user.id,
    });
    console.log(liveBookRooms);
  }

  function handleOffline() {
    liveBookSocket.emit("author_leave_live_book", {
      bookId: params.page.bookId,
    });
    const newList = liveBookRooms.filter((r) => r != params.page.bookId);
    setLiveBookRooms(newList);
    console.log("Author Leaving Live Book Closes app");
    setGoLive(false);
  }

  // Get Page Number
  // console.log(params.page.bookId, params.page.results[0].bookId);
  async function getPageNumber() {
    console.log("💥 getting page Number");
    const id = params?.page?.bookId || params?.page?.results[0]?.bookId;
    await axios
      .get(`${API_URL}/pages/getNewPageNumber/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })
      .then((res) => setPageNumber(res.data.pageNumber))
      .catch((e) => console.log(e.message));
  }

  useEffect(() => {
    if (discussionSocket) {
      discussionSocket.on("new_comment_made", (data) => {
        if (data) {
          setLastComment(
            (prev) =>
              data.comment.userRef.fullName +
              " : " +
              data.comment.commentText +
              " " +
              prev
          );
        }
      });
    }

    if (discussionSocket) {
      discussionSocket.emit("create_discussion_room", {
        pageRef: params?.draftPageId,
      });
    }
    return () => {
      if (discussionSocket) {
        discussionSocket.off("new_comment_made");
        discussionSocket.emit("delete_discussion_room", {
          pageRef: params?.draftPageId,
        });
      }
    };
  }, [discussionSocket, params]);

  useEffect(() => {
    getPageNumber();
    getAllComments();
  }, [params, goLive]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
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
                onPress={() => gotoDiscussion()}
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
          <Ionicons
            onPress={() => navigation.goBack()}
            name="chevron-back-sharp"
            size={28}
            color="#3B70B7"
          />
          <Text className="text-base font-Inter-medium">
            {/* We are using || because we are sending page in params from draft Check also, that is not similar to bookpages response.  */}
            {/* #{params.page.pageNumber || params.page.results[0].pageNumber} */}
            {"#" + pageNumber}
          </Text>

          <View className="flex-row ml-10 items-center">
            <Text className="font-Inter-Black text-xs text-gray-400">Live</Text>
            {goLive ? (
              <MaterialCommunityIcons
                name="toggle-switch"
                size={40}
                color="#FF0000"
                onPress={() =>
                  Alert.alert("Confirm", "Do you want to go Offline", [
                    { text: "Confirm", onPress: () => handleOffline() },
                    { text: "Cancel", style: "cancel" },
                  ])
                }
              />
            ) : (
              <MaterialCommunityIcons
                name="toggle-switch-off"
                size={40}
                color="gray"
                onPress={() =>
                  Alert.alert("Confirm", "Do you want to go Online", [
                    { text: "Confirm", onPress: () => handleGoLive() },
                    { text: "Cancel", style: "cancel" },
                  ])
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
                <Ionicons name="ios-eye" size={24} color="black" />
                <Text>{uniqueFullNamesCount || 0}</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowComments(!showComments)}
                className="flex-row items-center space-x-2"
              >
                <View className="flex-row">
                  <Ionicons name="chevron-back" size={24} color="black" />

                  <Ionicons
                    name="ios-chatbox-ellipses-outline"
                    size={24}
                    color="black"
                  />
                </View>
                <Text>{comments}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      {/* BODY */}

      <RichTextEditor page={params.page} pageNumber={pageNumber} />

      {/* Bottom  Bar*/}
    </SafeAreaView>
  );
}
