import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment/moment";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { ToastAndroid } from "react-native";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import { FlatList } from "react-native";
import { SocketContext } from "../../Socket/SocketProvider";
import { useContext } from "react";
import UseDebounce from "../../../components/UseDebounce";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "shared/hooks/useRedux";
import { AnimatedViewLifter } from "app/components/ui";
import { PageStackNavigatorProps } from "shared/navigators/PageStackNavigator";

export default function PageDiscussion({
  bookRef,
  pageRef,
  pageShortCode,
  totalComments,
}) {
  //---------States-------------------
  const navigation = useNavigation<PageStackNavigatorProps>();
  const { discussionSocket } = useContext(SocketContext);
  const currentUser = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const [whoIsTyping, setWhoIsTyping] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadReplies, setLoadReplies] = useState(false);
  const [pLoading, setPLoading] = useState(false);
  const [newCommentLoad, setNewCommentLoad] = useState(false);
  const [loadLikes, setLoadLikes] = useState(false);
  const [showReplies, setShowReplies] = useState([]); //
  const [sendReply, setSendReply] = useState([]); // to keep single id of comment, and reply box will show of that comment.
  const [onlyMe, setOnlyMe] = useState(false); // To show only Author comments
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(totalComments);
  const [page, setPage] = useState(1);
  const flatListRef = useRef(null);

  const debounceNewComment = UseDebounce(newComment, 500);

  //Scroll to top after making new comment
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  //Visit Profile
  const visitProfile = async (id: string) => {
    navigation.navigate("OtherProfile", { id });
    // setPLoading(true);
    // await axios
    //   .get(`${process.env.EXPO_PUBLIC_API_URL}/users/getUserById/${id}`, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((res) => {
    //     setOtherUser(res.data);
    //     navigation.navigate("OtherProfile");
    //   })
    //   .finally(() => setPLoading(false))
    //   .catch((e) => console.log(e));
  };

  // Method for showing replies
  function showReply(id: string) {
    !showReplies.includes(id) && getAllReplies(id); // dont call getAllReplies if Replies is already clicked. clicked = showReplies will be having id of that comment.
    setSendReply([]); // Hide Reply Box
    setShowReplies((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  }

  // Show Reply Input on/off toggle
  function sendReplyFun(id: string) {
    // Condition to make Reply button a toggle to show and off the reply input
    if (sendReply.includes(id)) {
      return setSendReply([]);
    }
    // setShowReplies([]); // To hide replies client said don't hide
    setSendReply([id]); // To Open reply of specific userId
  }

  // Like Reply
  async function likeReply(_id, c_id) {
    const updatedComments = allComments.map((comment) => {
      if (comment._id === c_id) {
        const updatedReplies = comment.replies.map((reply) => {
          if (reply._id === _id) {
            return {
              ...reply,
              isLikedByCurrentUser: true,
              likesCount: reply.likesCount + 1,
            };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
    setAllComments(updatedComments);

    try {
      await axios.request(
        `${process.env.EXPO_PUBLIC_API_URL}/pages/likeReply/${_id}`,
        {
          method: "post",
          maxBodyLength: Infinity,
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // After Liking just fetch All replies again
      // getAllReplies(c_id);

      // setLoadLikes(false);
    } catch (error) {
      console.log(error);
    }
  }

// console.log("Ace",allComments)

  function onDeleteReply(replyId, commentId) {
    const updatedComments = allComments.map((comment) => {
      if (comment.replies && comment._id === commentId) {
        // will check if on viewers screen if user loaded repleis
        const updatedReplies = comment.replies.filter(
          (reply) => reply._id != replyId
        );
        return {
          ...comment,
          repliesCount: comment.repliesCount - 1,
          replies: updatedReplies,
        };
      }
      return comment;
    });

    setAllComments(updatedComments);
  }

  async function deleteReply(_id, c_id) {
    try {
      await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL}/pages/deleteReplyByReplyId/${_id}`,
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      ToastAndroid.show("Deleted", ToastAndroid.SHORT);
      onDeleteReply(_id, c_id);
      discussionSocket.emit("delete_reply", {
        pageRef,
        replyId: _id,
        commentId: c_id,
      });
    } catch (error) {
      console.log(error);
    }
  }
  // Unlike Reply
  async function unlikeReply(_id, c_id) {
    const updatedComments = allComments.map((comment) => {
      if (comment._id === c_id) {
        const updatedReplies = comment.replies.map((reply) => {
          if (reply._id === _id) {
            return {
              ...reply,
              isLikedByCurrentUser: false,
              likesCount: reply.likesCount > 0 ? reply.likesCount - 1 : 0,
            };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });

    setAllComments(updatedComments);
    try {
      await axios.request(
        `${process.env.EXPO_PUBLIC_API_URL}/pages/unlikeReply/${_id}`,
        {
          method: "post",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // setLoadLikes(false);
    } catch (error) {
      console.log(error);
    }
  }

  // Like comment
  async function likeComment(_id) {
    //EXP: Move this part back to "After await is done" if problem
    const updatedComments = allComments.map((comment) => {
      if (comment._id === _id) {
        return {
          ...comment,
          isLikedByCurrentUser: true,
          likesCount: comment.likesCount + 1,
        };
      }
      return comment;
    });

    setAllComments(updatedComments);
    try {
      await axios.request(
        `${process.env.EXPO_PUBLIC_API_URL}/pages/likeComment/${_id}`,
        {
          method: "post",
          maxBodyLength: Infinity,
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  // Unlike comment
  async function unLikeComment(_id) {
    //EXP: Move this part back to "After await is done" if problem
    const updatedComments = allComments.map((comment) => {
      if (comment._id === _id) {
        return {
          ...comment,
          isLikedByCurrentUser: false,
          likesCount: comment.likesCount > 0 ? comment.likesCount - 1 : 0,
        };
      }
      return comment;
    });

    setAllComments(updatedComments);
    try {
      await axios.request(
        `${process.env.EXPO_PUBLIC_API_URL}/pages/unlikeComment/${_id}`,
        {
          method: "post",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  function onReplyComment(reply, commentId) {
    // Find the comment with the provided _id
    const updatedComments = allComments.map((comment) => {
      if (comment._id === commentId) {
        // Check if the comment has replies array, if not create one
        const currentReplies = comment.replies
          ? [...comment.replies, reply]
          : [reply];

        // Increment the repliesCount and append the new reply to the comment's replies array
        return {
          ...comment,
          replies: currentReplies,
          repliesCount: comment.repliesCount + 1,
          hasReplies: true,
        };
      }
      return comment;
    });
    setAllComments(updatedComments);
    setShowReplies((prev) => [...prev, commentId]);
    setCommentsCount((prev) => prev + 1);
  }

  //Reply Comment
  async function replyComment(_id) {
    await axios
      .request(`${process.env.EXPO_PUBLIC_API_URL}/pages/addReply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          bookRef,
          pageRef,
          commentRef: _id,
          replyText: replyContent,
          commentMediaUrl: "",
        },
      })
      .then((res) => {
        onReplyComment(res.data.reply, _id);
        discussionSocket.emit("new_reply", {
          pageRef,
          commentId: _id,
          reply: res.data.reply,
        });
        // // Find the comment with the provided _id
        // const updatedComments = allComments.map((comment) => {
        //   if (comment._id === _id) {
        //     // Check if the comment has replies array, if not create one
        //     const currentReplies = comment.replies
        //       ? [...comment.replies, res.data.reply]
        //       : [res.data.reply];

        //     // Increment the repliesCount and append the new reply to the comment's replies array
        //     return {
        //       ...comment,
        //       replies: currentReplies,
        //       repliesCount: comment.repliesCount + 1,
        //       hasReplies: true,
        //     };
        //   }
        //   return comment;
        // });
      })
      .catch((e) => console.log(e))
      .finally(() => {
        // setShowReplies((prev) => [...prev, _id]);
        setSendReply([]); // this setSendReply([]) will close reply box
        setReplyContent(""); // this will empty text in reply
        // setCommentsCount((prev) => prev + 1); // increment counter at top of screen
      });
  }

  // Get all replies to a comment
  async function getAllReplies(_id) {
    setLoadReplies(true);
    await axios
      .get(
        `${process.env.EXPO_PUBLIC_API_URL}/pages/getAllRepliesByCommentId/${_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        // Note: We don't recieve replies in Comments API so we have to create replies array in a comment object.
        const updatedComments = allComments.map((comment) => {
          if (comment._id === _id) {
            // Overwrite the replies array for that comment
            return {
              ...comment,
              replies: res.data.results,
            };
          }
          return comment;
        });

        setAllComments(updatedComments);
      })
      .finally(() => setLoadReplies(false))
      .catch((e) => console.log(e));
  }

  // Make new comment
  async function makeNewComment() {
    setNewCommentLoad(true);
    await axios
      .request(`${process.env.EXPO_PUBLIC_API_URL}/pages/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          bookRef,
          pageRef,
          commentText: newComment,
          commentMediaUrl: "",
        },
      })
      .then((res) => {
        // Correctly append the new comment to the results
        const updatedComments = [res.data.comment, ...allComments];
        setAllComments(updatedComments);
        discussionSocket.emit("new_comment", {
          comment: res.data.comment,
        });
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setNewComment("");
        setNewCommentLoad(false);
        setCommentsCount((prev) => prev + 1); // increment counter at top of screen
        scrollToTop();
      });
  }

  //Delete Coment
  async function deleteComment(_id) {
    setLoading(true);
    await axios
      .delete(
        `${process.env.EXPO_PUBLIC_API_URL}/pages/deleteCommentByCommentId/${_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        ToastAndroid.show("Deleted", ToastAndroid.SHORT);
        const updatedComments = allComments.filter(
          (comment) => comment._id !== _id
        );
        setAllComments(updatedComments);
        setLoading(false);
        discussionSocket.emit("delete_comment", {
          id: _id,
          pageRef,
        });
      })
      .finally(() => setCommentsCount((prev) => prev - 1)) // decrement counter at top of screen
      .catch((e) => console.log(e));
  }

  // Only Me Button
  const OnlyMe = () => {
    return (
      <View className="flex-row  items-center mr-2">
        <Text className="font-Inter-bold text-xs text-Black">Only Me</Text>
        {onlyMe ? (
          <MaterialCommunityIcons
            name="toggle-switch"
            size={32}
            color="#6687c4"
            onPress={() => setOnlyMe(false)}
          />
        ) : (
          <MaterialCommunityIcons
            name="toggle-switch-off"
            size={32}
            color="gray"
            onPress={() => setOnlyMe(true)}
          />
        )}
      </View>
    );
  };

  // Get All comments
  async function getAllComments() {
    setLoading(true);
    try {
      const response = await axios.get(
        // `${process.env.EXPO_PUBLIC_API_URL}/pages/getAllCommentsByPageId/${pageRef}?page=${page}&limit=10&sortBy=createdAt:desc`,
        `${process.env.EXPO_PUBLIC_API_URL}/pages/getAllCommentsByPageId/${pageRef}?page=${page}&limit=10&sortBy=createdAt:desc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get the current comments and append the new results
      const updatedComments = [...allComments, ...response.data.results];
      setAllComments(updatedComments);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getAllComments();
  }, []);
  // TODO: UNCOMMENT BEFORE BUILD
  // useEffect(() => {
  //   if (debounceNewComment) {
  //     discussionSocket.emit("who_is_typing", {
  //       pageRef,
  //       fullName: currentUser.user.fullName,
  //     });
  //   }
  // }, [debounceNewComment]);

  // TODO: UNCOMMENT BEFORE BUILD
  // useEffect(() => {
  //   if (discussionSocket) {
  //     discussionSocket.emit("create_discussion_room", {
  //       pageRef,
  //     });
  //     discussionSocket.on("typing", (data) => {
  //       setWhoIsTyping(data);
  //       setIsTyping(true);
  //       setTimeout(() => {
  //         setIsTyping(false);
  //       }, 5000);
  //     });
  //   }
  //   return () => {
  //     discussionSocket.emit("delete_discussion_room", {
  //       pageRef,
  //     });
  //   };
  // }, [discussionSocket]);

  // For viewers to see latest comments instantly
  // TODO: UNCOMMENT BEFORE BUILD
  // useEffect(() => {
  //   discussionSocket.on("new_comment_made", (data) => {
  //     if (data) {
  //       const updatedComments = [data.comment, ...allComments];
  //       setAllComments(updatedComments);
  //     }
  //   });

  //   discussionSocket.on("comment_deleted", (data) => {
  //     const updatedComments = allComments.filter(
  //       (comment) => comment._id !== data
  //     );
  //     setAllComments(updatedComments);
  //   });

  //   discussionSocket.on("reply_made", (data) => {
  //     onReplyComment(data.reply, data.commentId);
  //   });
  //   discussionSocket.on("reply_deleted", (data) => {
  //     onDeleteReply(data.replyId, data.commentId);
  //   });
  // }, [discussionSocket, allComments]);

// console.log("Also Ace",pageRef)

  if (pLoading) {
    return (
      <View className="flex-1 w-full  bg-white  items-center m-auto ">
        <LottieView
          style={{ width: 40, height: 40, marginTop: 150 }}
          resizeMode="cover"
          source={Load}
          autoPlay
          loop
        />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <View
        key={item._id}
        className="flex-row items-center space-x-2 mb-4 bg-textField rounded-md mx-1 "
      >
        <View className=" flex-1 flex-col py-4 px-2 ">
          <View className="flex-row space-x-2 items-center justify-between">
            <View className="flex-row items-center">
              <Pressable
                disabled={pLoading}
                onPress={() => visitProfile(item?.userRef?._id)}
              >
                <Image
                  source={{
                    // uri: `${process.env.EXPO_PUBLIC_API_URL}/s3/getMedia/${item.userRef.profilePicture}`,
                    uri:
                    //  `${process.env.S3}/${item.userRef.profilePicture}`,
                    item.userRef.profilePicture?.startsWith("http")
                    ? item.userRef.profilePicture
                    : `${process.env.S3}/${item.userRef.profilePicture}`
                  }}
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 30,
                    marginRight: 8,
                  }}
                />
              </Pressable>
              <Text
                className="font-Inter-bold"
                style={{ color: "#272727", fontSize: 14 }}
              >
                {item.userRef.fullName}
              </Text>
            </View>
            <Text className="text-gray-500 text-xs">
              {moment(item.createdAt).fromNow()}
            </Text>
          </View>
          <Text
            onPress={() => console.log(item)}
            className="ml-10 font-Inter-Black text-sm text-gray-800"
          >
            {item.commentText}
          </Text>
          {showReplies.includes(item._id) &&
            item?.replies?.map((r) => (
              <View
                key={r._id}
                className="flex-col bg-white relative rounded-xl p-2 ml-8 mt-2 border-2 border-Primary/60"
              >
                {/* Replies Heart */}
                <View className="absolute right-2 bottom-2  flex-row space-x-4 z-20">
                  {/* <AntDesign name="delete" size={14} color="black" /> */}
                  <View className="items-center flex-row space-x-1">
                    <AntDesign
                      // disabled={loadLikes}
                      onPress={
                        r.isLikedByCurrentUser
                          ? () => unlikeReply(r._id, item._id)
                          : () => likeReply(r._id, item._id)
                      }
                      name="heart"
                      size={17}
                      color={r.isLikedByCurrentUser ? "red" : "#c8cbcf"}
                    />
                    <Text className="text-Primary" style={{ fontSize: 10 }}>
                      {r.likesCount}
                    </Text>
                  </View>
                </View>
                <View className="flex-row space-x-4 ">
                  <Text className="flex-row  text-xs font-Inter-bold">
                    {r.userRef.fullName}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {moment(r.createdAt).fromNow()}
                  </Text>
                </View>
                <Text className="text-sm font-Inter-Black">{r.replyText}</Text>
                {r.userRef._id === currentUser.id && (
                  <AntDesign
                    onPress={() => deleteReply(r._id, item._id)}
                    name="delete"
                    size={17}
                    color="#A2A2A1"
                    style={{
                      alignSelf: "flex-end",
                      marginRight: 40,
                    }}
                  />
                )}
              </View>
            ))}
          <View className="flex-row space-x-3 mt-4">
            {item.userRef._id === currentUser.id && (
              <Text
                disabled={loading}
                onPress={() => deleteComment(item._id)}
                className=" text-Primary text-xs font-Inter-bold mr-2"
              >
                Erase
              </Text>
            )}
            <View className="flex-row space-x-1 items-center">
              {item.isLikedByCurrentUser ? (
                <AntDesign
                  onPress={() => unLikeComment(item._id)}
                  name="heart"
                  size={17}
                  color="red"
                />
              ) : (
                <AntDesign
                  onPress={() => likeComment(item._id)}
                  name="hearto"
                  size={17}
                  color="red"
                />
              )}
              <Text className="text-Primary text-xs ">{item.likesCount}</Text>
            </View>
            <View className="flex-grow items-end ">
              <Text
                // onFocus={() => setSendReply([item._id])}
                onPress={() => sendReplyFun(item._id)}
                className=" text-Primary text-s font-Inter-medium "
              >
                Reply
              </Text>
            </View>

            {/* Show Loading at tail of specific replies text when pressed,Logic: last index in showReplies _id container*/}
            {(showReplies[showReplies.length - 1] == item._id) &
              loadReplies && (
              <View className="  w-4 h-4 items-center m-auto">
                <LottieView resizeMode="cover" source={Load} autoPlay loop />
              </View>
            )}
          </View>
          {item.repliesCount !== 0 && (
            <View className="flex-row items-center">
              <View
                style={{
                  width: 20,
                  height: 1,
                  backgroundColor: "#909198",
                  marginRight: 6,
                  marginTop: 8,
                }}
              />
              <Text
                onPress={() => showReply(item._id)}
                className="text-textColor2 text-xs mt-2"
              >
                View {item.repliesCount} Replies
              </Text>
            </View>
          )}
          {/* REPLY */}
          {sendReply.includes(item._id) && (
            <View className="flex-row bg-white items-center mx-2 rounded-xl mt-2 ">
              <TextInput
                multiline={true}
                maxLength={400}
                placeholderTextColor={"#c8cbcf"}
                placeholder={`Reply to ${item.userRef.fullName}`}
                className="bg-white rounded-xl py-2 px-2 flex-1"
                onChangeText={(val) => setReplyContent(val)}
              />
              <MaterialCommunityIcons
                name="send-circle"
                size={28}
                color="#6687c4"
                onPress={() => replyComment(item._id)}
                // onPress={() => setSendReply([])}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
      }}
    >
      <View className="flex-row items-center  justify-between">
        <View className="flex-row items-center ">
          <TouchableOpacity
            style={{ padding: 8, backgroundColor: "#F7F8F8", borderRadius: 6 }}
            onPress={navigation.goBack}
          >
            <Ionicons name="chevron-back" size={24} color="#4B4B4B" />
          </TouchableOpacity>

          <Text className="text-center text-black font-Inter-bold text-lg py-4 ml-4">
            Discussion
          </Text>

          <Text
            className="ml-4 text-center items-center font-Inter-medium"
            style={{ color: "#909198" }}
          >
            {pageShortCode}
          </Text>
        </View>
        {/* <View className="flex-row items-center space-x-1">
          <Ionicons
            name="md-chatbubble-ellipses-outline"
            size={15}
            color="gray"
          />
          <Text className=" font-Inter-medium text-gray-400 text-sm">
            {commentsCount}
          </Text>
        </View> */}
        <OnlyMe />
      </View>
      <Text className="text-textColor1 mb-4">{commentsCount} comments</Text>
      <FlatList
        ref={flatListRef}
        renderItem={renderItem}
        onEndReached={() => {
          if (!loading && allComments.length >= 10) {
            // onEndReach only works if its not loading & comments more than 10
            const newPage = page + 1; // setPage(prev=>prev+1) was having issue
            setPage(newPage);
            !onlyMe && getAllComments(newPage); // it was fetching when we select onlyMe, it should not fetch when onlyMe
          }
        }}
        data={
          onlyMe
            ? allComments.filter(
                (c) => c.isCommentedOutByCurrentUser || c.hasReplies
              )
            : allComments
        }
        ListFooterComponent={() =>
          loading && (
            <View className="flex-1 w-10 h-4 items-center m-auto">
              <LottieView resizeMode="cover" source={Load} autoPlay loop />
            </View>
          )
        }
      />
      <View
        className={clsx("", {
          hidden: sendReply.length > 0,
        })}
      >
        {/* <AnimatedViewLifter
          fullHeight={true}
          shouldMove={Platform.OS === "ios"}
          heightOffset={-40}
        > */}
        <View className="flex-row  mx-2 border-2 p-2 rounded-md border-gray-300 items-center relative bg-white">
          {/* {isTyping && (
              <Text className="self-center text-gray-400 text-xs absolute -bottom-4 left-1/3">
                <Text
                  className="text-blue-500 font-Inter-bold "
                  style={{ fontSize: 10 }}
                >
                  {whoIsTyping}
                </Text>{" "}
                is typing...
              </Text>
            )} */}
          {/* <View className="flex-row justify-between bg-white"> */}
          <TextInput
            className="text-sm flex-1"
            value={newComment}
            multiline={true}
            placeholder="Comment on the page"
            placeholderTextColor={"gray"}
            onChangeText={(val) => setNewComment(val)}
            onFocus={() => setSendReply([])}
            maxLength={400}
          />
          {newCommentLoad ? (
            <LottieView
              style={{ width: 10, height: 10 }}
              source={Load}
              autoPlay
              loop
            />
          ) : (
            <MaterialCommunityIcons
              onPress={makeNewComment}
              name="send-circle"
              size={28}
              color="#6687c4"
            />
          )}
          {/* </View> */}
        </View>
        {/* </AnimatedViewLifter> */}
        <Text className="text-xs text-gray-400 self-end mr-2">
          {newComment.length}/400
        </Text>
      </View>
    </SafeAreaView>
  );
}
