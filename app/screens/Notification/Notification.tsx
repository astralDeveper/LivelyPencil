import { Heading, MySafeAreaContainer, Text } from "app/components/ui";
import {
  Alert,
  FlatList,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import useNotification from "./useNotification";
import { Loading } from "app/components";
import { useCallback, useContext, useState } from "react";
import {
  INotification,
  NotificationType,
} from "shared/types/notification/notification.type";
import NotificationIcon from "assets/svg/Drawer/Notification";
import { formatDateAgo } from "shared/util/moment";
import { useNavigation } from "@react-navigation/native";
import { NotificationStackNavigatorProps } from "shared/navigators/NotificationStackNavigator";
import Toast from "react-native-toast-message";
import {
  SocketContext,
  SocketContextType,
} from "screens/Socket/SocketProvider";

type NotificaitonItemProps = {
  notificationType: NotificationType;
  data: unknown;
  createdAt: string;
  read: boolean;
  title: string;
};

interface NotificationItemLayoutProps extends TouchableOpacityProps {
  read: boolean;
  createdAt: string;
  text: string;
}

const NotificationItemLayout = (
  props: NotificationItemLayoutProps
): JSX.Element => {

  const { read, createdAt, text } = props;
 
  return (
    <TouchableOpacity
      {...props}
      className={`flex-row mb-4 bg-textField justify-between items-center rounded-lg ${
        read ? "bg-white" : "bg-textField p-2"
      }`}
    >
      <View
        style={{
          borderRadius: 8,
          padding: 8,
          backgroundColor: "rgba(0, 118, 252, 0.10)",
        }}
      >
        <NotificationIcon width={24} height={24} stroke={"#0076FC"} />
      </View>
      <View className="flex-1 ml-4">
        <Text>{text}</Text>
        <Text>{formatDateAgo(createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const NotificationItem = (props: NotificaitonItemProps): JSX.Element => {
  const { data, notificationType } = props;
  const { navigate } = useNavigation<NotificationStackNavigatorProps>();
  if (!(data && typeof data === "object")) return <></>;


  function handleJoin() {
    liveBookSocket.emit("join_live_book", {
      bookId:props?.data?.bookId,
      userId:props?.userId,
    });
    navigate("PageStack", {
      screen: "Preview",
      params: {
        shortCode: props?.data?.fullName,
        coverImageUrl: props?.data?.profilePicture ?? "",
        id: props?.data?.bookId,
        title: props?.title,
      },
    });
  } 

  function handleDiscussionNavigation() {
    // Need bookId, pageid, pageShortCode and commentsCount

    if (
      data &&
      typeof data === "object" &&
      "bookId" in data &&
      typeof data.bookId === "string" &&
      "pageRef" in data &&
      typeof data.pageRef === "string" &&
      "commentsCount" in data &&
      typeof data.commentsCount === "number" &&
      "pageShortCode" in data &&
      typeof data.pageShortCode === "string"
    ) { 
      navigate("PageStack", {
        screen: "Discussion",
        params: {
          bookId: data.bookId,
          pageId: data.pageRef,
          totalComments: data.commentsCount,
          pageShortCode: data.pageShortCode,
        },
      });
    }  else {
      Toast.show({
        type:"info",
        text1:"This comment was on unpublished page ",
        text2:"So you are unable to see it.",
      })
    }
  }

  function handleUserProfileNavigation() {
    if (
      data &&
      typeof data === "object" &&
      "userId" in data &&
      typeof data.userId === "string"
    ) 
    {
      navigate("PageStack", {
        screen: "OtherProfile",
        params: { id: data.userId },
      });
    }
  }
  
//   else
//   {
//    Alert.alert("Hello");
//  }
  function handlePageDetailsNavigation() {
    if (
      data &&
      typeof data === "object" &&
      "indexOfPage" in data &&
      "pageRef" in data &&
      typeof data.pageRef === "string" &&
      typeof data.indexOfPage === "number"
    )
     { navigate("PageStack", {
        screen: "Details",
        params: {
          pageIds: [data.pageRef],
          initialIndex: data.indexOfPage,
          inverted: true,
        },
      })}
  }

  const { liveBookSocket } = useContext(SocketContext) as SocketContextType;



  switch (notificationType) {
    case NotificationType.BOOKLIVE:
      if ("fullName" in data && typeof data.fullName === "string"){
        // console.log("NotificationItemLayout", data);
      
     

        // setGet(props)
        // console.log("s===>",props)
        return (
          <NotificationItemLayout
            {...props}
            text={`${data.fullName} ${props.title}`}
            onPress={()=>{
              // props?.data?.bookId ?
               handleJoin()
              //  : Alert.alert("ajgsdh")
              // handleJoin()
              // Toast.show({

              // })
            }}
          />
        )}
      else{ return <></>}


  

    case NotificationType.NEW_COMMENT ||
      NotificationType.NEW_COMMENT_LIKE ||
      NotificationType.NEW_REPLY ||
      NotificationType.NEW_REPLY_LIKE:
      if ("fullName" in data && typeof data.fullName === "string") {
// console.log("NotificationItemLayout",props)
        return (
          <NotificationItemLayout
            {...props}
            text={`${data.fullName} ${props.title}`}
            onPress={handleDiscussionNavigation}
          />
        );
      } else {
        return <></>;
      }
      
    case NotificationType.PAGE_LIKE || NotificationType.PAGE_PUBLISHED:
      if ("fullName" in data && typeof data.fullName === "string")
        return (
          <NotificationItemLayout
            {...props}
            text={`${data.fullName} ${props.title}`}
            onPress={handlePageDetailsNavigation}
          />
        );
      else return <></>;
    case NotificationType.NEW_FOLLOW:
      if ("fullName" in data && typeof data.fullName === "string")
        return (
          <NotificationItemLayout
            {...props}
            text={`${data.fullName} ${props.title}`}
            onPress={handleUserProfileNavigation}
          />
        );
      else return <></>;
    default:
      return <></>;
  }
};

const Notification = (): JSX.Element => {
  const { incrementPageNumber, isLoading, notifications } = useNotification();

  const renderItem = useCallback(({ item }: { item: INotification }) => {
    return <NotificationItem {...item} key={item._id} />;
  }, []);

  if (isLoading) return <Loading />;

  return (
    <View style={{ paddingHorizontal: 20, backgroundColor: "#fff", flex: 1 }}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        extraData={true}
        ListEmptyComponent={<Text>No new notifications recently</Text>}
      />
    </View>
  );
};

export default Notification;
// import React, { useState, useEffect, useContext } from "react";
// import {
//   View,
//   SafeAreaView,
//   StatusBar,
//   Text,
//   FlatList,
//   Pressable,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { NotificationList } from "components";
// import { useNavigation } from "expo-router";
// import axios from "axios";
// import { API_URL } from "@env";
// import store from "app/store";
// import moment from "moment";
// import LottieView from "lottie-react-native";
// import Load from "assets/svg/Load.json";
// import { SocketContext } from "./Socket/SocketProvider";
// import clsx from "clsx";

// interface NotificationData {
//   fullName?: string;
//   bookId?: string;
//   indexOfPage?: number;
//   pageRef?: string;
//   pageShortCode?: string;
//   repliesCount?: number;
//   commentsCount?: number;
//   userId?: string;
// }

// interface Notification {
//   _id: string;
//   notificationType: string;
//   title: string;
//   data: NotificationData;
//   createdAt: string;
//   read: boolean;
// }

// export default function Notification() {
//   const { liveBookSocket, liveBookRooms } = useContext(SocketContext);
//   const navigation = useNavigation();
//   const { currentUser, setOtherUser } = store();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(false);

//   function gotoPage(notification: Notification) {
//     navigation.navigate("PageSystem", {
//       bookId: notification.data.bookId,
//       indexNumber: notification.data.indexOfPage,
//     });
//   }

//   function gotoChat(notification: Notification) {
//     navigation.navigate("Discussion", {
//       bookRef: notification.data.bookId,
//       pageRef: notification.data.pageRef,
//       pageShortCode: notification.data.pageShortCode,
//       totalComments:
//         (notification.data.repliesCount || 0) +
//         (notification.data.commentsCount || 0),
//     });
//   }

//   async function gotoLive(notification: Notification) {
//     if (!liveBookRooms.includes(notification.data.bookId || "")) {
//       return Alert.alert("Stream Offline", "This Stream is no more online");
//     }
//     try {
//       const resp = await axios.get(`${API_URL}/books/getBookById/${notification.data.bookId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentUser.tokens.access.token}`,
//         },
//       });
//       const book = resp.data;
//       liveBookSocket.emit("join_live_book", {
//         bookId: book._id,
//         userId: currentUser.user.id,
//       });
//       navigation.navigate("Preview", { book });
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async function gotoUser(notification: Notification) {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_URL}/users/getUserById/${notification.data.userId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentUser.tokens.access.token}`,
//         },
//       });
//       setOtherUser(res.data);
//       navigation.navigate("OtherProfile");
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function markAsRead(id: string) {
//     try {
//       await axios.get(`${API_URL}/notification/markAsRead/${id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentUser.tokens.access.token}`,
//         },
//       });
//       const newList = notifications.map((n) =>
//         n._id === id ? { ...n, read: true } : n
//       );
//       setNotifications(newList);
//       console.log("Marked Read", id);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   function whichType(notification: Notification) {
//     switch (notification.notificationType) {
//       case "Page_Like":
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

//   const renderItem = ({ item }: { item: Notification }) => {
//     return (
//       <Pressable
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
//     try {
//       const res = await axios.get(`${API_URL}/notification/getAllNotifications?limit=20`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentUser.tokens.access.token}`,
//         },
//       });
//       setNotifications(res.data.notifications);
//       console.log(res.data.notifications);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     getAllNotifications();
//   }, []);

//   if (loading) {
//     return (
//       <View className="w-10 h-4 items-center m-auto">
//         <LottieView resizeMode="cover" source={Load} autoPlay loop />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: "white",
//       }}
//     >
//       {/* HEADER */}
//       <View className="flex-row items-center m-2 justify-between">
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
