// import {
//   View,
//   SafeAreaView,
//   StatusBar,
//   Text,
//   FlatList,
//   Pressable,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { NotificationList } from "components";
// // $&
// import axios from "axios";
// import { API_URL } from "@env";
// import store from "store";
// import { useContext, useEffect } from "react";
// import { useState } from "react";
// import moment from "moment/moment";
// import LottieView from "lottie-react-native";
// import Load from "assets/svg/Load.json";
// import { SocketContext } from "./Socket/SocketProvider";
// import { Alert } from "react-native";
// import clsx from "clsx";
// import { useNavigation } from "@react-navigation/native";
// import { useAppSelector } from "shared/hooks/useRedux";

// export default function Notification() {
//   const { liveBookSocket, liveBookRooms } = useContext(SocketContext);
//   const navigation = useNavigation();
//   // const { currentUser, setOtherUser } = store();
//   const userId = useAppSelector((state) => state.auth.user?._id);
//   const token = useAppSelector((state) => state.auth.token);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);

//   function gotoPage(notification) {
//     return navigation.navigate("PageSystem", {
//       bookId: notification.data.bookId,
//       indexNumber: notification.data.indexOfPage,
//     });
//   }

//   function gotoChat(notification) {
//     navigation.navigate("Discussion", {
//       bookRef: notification.data.bookId,
//       pageRef: notification.data.pageRef,
//       pageShortCode: notification.data.pageShortCode,
//       totalComments:
//         notification.data.repliesCount + notification.data.commentsCount,
//     });
//   }

//   async function gotoLive(notification) {
//     if (!liveBookRooms.includes(notification.data.bookId)) {
//       return Alert.alert("Stream Offline", "This Stream is no more online");
//     }
//     await axios(`${API_URL}/books/getBookById/${notification.data.bookId}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${currentUser.tokens.access.token}`,
//       },
//     }).then((resp) => {
//       const book = resp.data;
//       liveBookSocket.emit("join_live_book", {
//         bookId: book._id,
//         userId: currentUser.user.id,
//       });
//       navigation.navigate("Preview", { book });
//     });
//   }

//   async function gotoUser(notification) {
//     setLoading(true);
//     await axios
//       .get(`${API_URL}/users/getUserById/${notification.data.userId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentUser.tokens.access.token}`,
//         },
//       })
//       .then((res) => {
//         setOtherUser(res.data);
//         navigation.navigate("OtherProfile");
//       })
//       .finally(() => setLoading(false));
//   }

//   /**
// - Total Types:
//     Book_live
//     New_Comment
//     New_Reply
//     New_Comment_Like
//     New_Reply_Like
//     Page_Like
//     New_Follow
//     PAGE_PUBLISHED
//  */

//   function whichType(notification) {
//     switch (notification.notificationType) {
//       case "Page_Like":
//         gotoPage(notification);
//         markAsRead(notification._id);

//         break;
//       case "PAGE_PUBLISHED":
//         gotoPage(notification);
//         markAsRead(notification._id);

//         break;
//       case "New_Follow":
//         gotoUser(notification);
//         markAsRead(notification._id);
//         break;
//       case "Book_live":
//         gotoLive(notification);
//         markAsRead(notification._id);
//         break;
//       case "New_Comment_Like":
//       case "New_Reply_Like":
//       case "New_Reply":
//       case "New_Comment":
//         gotoChat(notification);
//         markAsRead(notification._id);
//         break;
//       default:
//         console.log(notification);
//     }
//   }

//   async function markAsRead(id) {
//     await axios
//       .get(`${API_URL}/notification/markAsRead/${id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentUser.tokens.access.token}`,
//         },
//       })
//       .then(() => {
//         const newList = notifications.map((n) => {
//           if (n._id === id) {
//             return { ...n, read: true };
//           } else {
//             return n;
//           }
//         });
//         setNotifications(newList);
//         console.log("Marked Read", id);
//       })
//       .catch((e) => console.log(e.message));
//   }

//   const renderItem = ({ item }) => {
//     return (
//       <Pressable
//         // onPress={() => console.log(item)}
//         onPress={() => whichType(item)}
//         className="mx-2 py-4 border-b-0.5 border-gray-400"
//       >
//         <View className="flex-row space-x-2 justify-between">
//           <View className="flex-row space-x-2">
//             {item.data.fullName && (
//               <Text
//                 className={clsx(
//                   "font-Inter-Black text-sm text-blue-500 capitalize ",
//                   {
//                     "font-Inter-bold": !item.read,
//                   }
//                 )}
//               >
//                 {item.data.fullName}
//               </Text>
//             )}
//             <Text
//               className={clsx("font-Inter-Black text-sm ", {
//                 "font-Inter-bold": !item.read,
//               })}
//             >
//               {item.title}
//             </Text>
//           </View>
//           <Text className="font-Inter-Black text-xs">
//             {moment(item.createdAt).fromNow()}
//           </Text>
//         </View>
//       </Pressable>
//     );
//   };

//   async function getAllNotifications() {
//     setLoading(true);
//     await axios
//       .get(`${API_URL}/notification/getAllNotifications?limit=20`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentUser.tokens.access.token}`,
//         },
//       })
//       .then((res) => {
//         setNotifications(res.data.notifications);
//         console.log(res.data.notifications);
//       })
//       .finally(() => setLoading(false))
//       .catch((e) => console.log(e.message));
//   }

//   useEffect(() => {
//     getAllNotifications();
//   }, []);

//   if (loading) {
//     return (
//       <View className=" w-10 h-4 items-center m-auto">
//         <LottieView resizeMode="cover" source={Load} autoPlay loop />
//       </View>
//     );
//   }
//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         // marginTop: StatusBar.currentHeight || 0,
//         backgroundColor: "white",
//       }}
//     >
//       {/* HEADER */}
//       <View className="flex-row  items-center m-2 justify-between">
//         <View className="flex-row space-x-2">
//           <Ionicons
//             name="chevron-back-sharp"
//             size={28}
//             color="#3B70B7"
//             onPress={() => navigation.goBack()}
//           />
//           <Text className="text-xl font-Inter-medium">Notifications</Text>
//         </View>
//       </View>
//       <View className="flex-1">
//         <FlatList data={notifications} renderItem={renderItem} />
//       </View>
//     </SafeAreaView>
//   );
// }
