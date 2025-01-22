import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  useWindowDimensions,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import Live from "../../../components/Live";
import { Ionicons, Feather, Foundation } from "@expo/vector-icons";
import clsx from "clsx";
import LottieView from "lottie-react-native";
import Offline from "assets/svg/Offline.json";
import { useAppSelector } from "shared/hooks/useRedux";
import RenderHtml from "shared/util/htmlRender";
import usePreview from "./usePreview";
import { Button } from "app/components/ui";
import { FileText, Heart } from "react-native-feather";
import { ChevronLeft, Eye } from "react-native-feather";
import useDetailsScreenItem from "../Details/useDetailsScreen";

export default function Preview() {
  const { height } = useWindowDimensions();

  const pageLikedIds = useAppSelector((state) => state.util.pagesLiked);


  

  const {
    gotoDiscussion,
    goBack,
    shortCode,
    title,
    bookLive,
    updatedContent,
    page,
    uniqueViewers,
    coverImageUrl,
  } = usePreview();
  const currentUser = useAppSelector((state) => state.auth.user);

  // const { commentsCount,likesCount,handleLikePress, navigateToDiscussion, isLiked } =
  //   useDetailsScreenItem();


console.log("currentUser",currentUser)

    console.log("pageLikedIds",pageLikedIds);
 
 
    console.log("bookLive", bookLive);  

    console.log(title)

    
//  const id="675ea1278093ab5c185d0cf5"

 
  // const [pageNumber, setPageNumber] = useState("");
  // const [currentUserLikedPages, setCurrentUserLikedPages] = useState(null);
  // const dispatch = useAppDispatch();
  // const uniqueViewers = new Set(viewers?.liveBook?.joinedFollowers);

  // let bookLive = liveBookRooms.includes(streamId);

  // We check whether author is online or disconnected using connectedUsers
  // let authorLive = connectedUsers.some(
  //   (user) => user.email === params.book.email
  // );
  // }, [authorLive, bookLive]);
 
  const { width } = Dimensions.get("screen");
  // const updatedContent = `<p>This is your HTML content.</p>`;

  // const customStyles = {
  //   body: {
  //     fontSize: 30, // Set a larger font size here
  //     // lineHeight: 28, // Adjust line height for readability
  //   },
  // };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // marginTop: StatusBar.currentHeight,
        backgroundColor: "white",
      }}
    >
      {/* HEADER */}
      <View
        className="flex-row mx-2  border-b border-gray-200 "
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 5,
          width: width * 0.95,
          // borderBottomWidth: 1,
          // borderColor: "#8e8e8e",
          alignSelf: "center",
        }}
      >
        <View
        // style={{
        //   flexDirection:"row",alignItems:"center",justifyContent:"center",
        // }}
        >
          {/* <Ionicons
            onPress={goBack}
            name="chevron-back-sharp"
            size={28}
            color="#3B70B7"
          /> */}
          <Image
            cachePolicy="none"
            // source={`${process.env.EXPO_PUBLIC_API_URL}/s3/getMedia/${params.book.coverImageUrl}`}
            source={`${process.env.S3}/${
              coverImageUrl || currentUser?.profilePicture
            }`}
            className="h-12 w-12 border-4 border-gray-300 rounded-full"
            contentFit="cover"
          />
        </View>
        <View
          style={{
            // backgroundColor:"red",
            marginLeft: 5,
            width: width * 0.6,
          }}
        >
          <Text
           ellipsizeMode="tail"
            // style={{
            //   fontSize: 18,
              
            // }}
            className="text-xs font-Inter-medium"
          >
            {/* {shortCode.split("/")[0].length > 10
              ? shortCode.split("/")[0].slice(0, 10) + "..."
              : shortCode.split("/")[0]} */}
            {shortCode}
          </Text>
          <Text
          ellipsizeMode="tail"
         className="text-base text-Primary  font-Inter-medium"
            // style={{
            //   fontSize: 16,
            // }}
          >
            {title}
          </Text>
        </View>
        <View>
          {/* Show newPage if available, otherwise show viewer.pageShortCode */}
          {/* <Text className="text-xs text-Primary font-Inter-medium">
            {shortCode.split("/")[1]}/
          </Text> */}
          {/* {newPage ? `#${newPage}` : `#${pageNumber}`} */}
          {/* {viewers?.pageShortCode} */}
          {/* {authorLive ? ( */}
          {bookLive ? (
            <View className="flex-row  space-x-0.5">
              <Live color={"red"} />
              <Text className="text-lg font-Inter-Black text-black">
                Live({uniqueViewers.size})
              </Text>
            </View>
          ) : (
            // <View className="flex-row space-x-2">
            //   <Text className="text-xs">😴offline</Text>
            // </View>
            <View className="flex-row items-center">
              <LottieView
                style={{ width: 16, height: 16 }}
                resizeMode="cover"
                source={Offline}
                autoPlay
                loop
              />
              <Text className="text-xs "> Offline</Text>
            </View>
          )}
        </View>
      </View>
      {/* HEADER END */}

      {/* SCROLLING PREVIEW */}
      <ScrollView className="mt-1 mx-2">
        {/* <RenderHtml html={updatedContent} /> */}
        <RenderHtml

        html={updatedContent}

      />
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          width: width,
          justifyContent: "space-between",
          paddingHorizontal: 18,paddingBottom:10
        }}
        className="items-center  bg-white   border-gray-300"
      >
        {/* <View className="flex-row space-x-2 items-center ">
          <Feather name="bar-chart-2" size={32} color="black" />
          <Text className="text-Primary font-Inter-medium text-xs">
            {page?.pageViewCount}
          </Text>
          <Ionicons
            // disabled={loading}
            // onPress={() =>
            //   currentUserLikedPages?.includes(page._id) ? unLike() : likePage()
            // }
            name={
              // currentUserLikedPages?.includes(page._id)
              "ios-heart"
              // : "heart-outline"
            }
            size={32}
            color="red"
            // color={
            //   currentUserLikedPages?.includes(Page?._id) ? "red" : "gray"
            // }
          />
          <Text className="text-Primary font-Inter-medium text-xs">
            {page?.likesCount}
          </Text>
          <Ionicons
            onPress={() => gotoDiscussion()}
            // onPress={() => {
            // navigation.navigate("Discussion", {
            //   bookRef: page?.bookId,
            //   pageRef: page?._id,
            //   pageShortCode: page?.bookShortCode.split("/")[1],
            //   totalComments: page?.commentsCount + page?.repliesCount,
            // });
            // }}
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
          />
          <Text className="text-Primary font-Inter-medium text-xs ">
            {page?.commentsCount}
          </Text>
        </View> */}
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {/* {html?.length > 1200 && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 12,
            }}
            // onPress={openModal}
          >
            <Foundation name="arrows-expand" size={24} color="black" />
          </TouchableOpacity>
        )} */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 12,
            }}
            // onPress={handleLikePress}
          >
            {/* <Heart color="red" fill={isLiked ? "red" : "white"} /> */}
            <Heart color="red" fill={"red"} />
            <Text style={{ marginLeft: 6 }}>{page?.likesCount}</Text>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 12,
            }}
            onPress={() => gotoDiscussion()}
          >
            <FileText color="black" />
            <Text style={{ marginLeft: 6 }}> {page?.commentsCount}</Text>
          </TouchableOpacity>
           {/* <Ionicons
            onPress={() => gotoDiscussion()}
            // onPress={() => {
            // navigation.navigate("Discussion", {
            //   bookRef: page?.bookId,
            //   pageRef: page?._id,
            //   pageShortCode: page?.bookShortCode.split("/")[1],
            //   totalComments: page?.commentsCount + page?.repliesCount,
            // });
            // }}
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
          />
          <Text className="text-Primary font-Inter-medium text-xs ">
            {page?.commentsCount}
          </Text> */}
        </View>
        {page?.authorId != currentUser?._id && (
          // <Pressable
          //   // onPress={follow}
          //   className={clsx(
          //     "px-3 py-2  bg-white rounded-full border-2 border-Primary",
          //     {
          //       "bg-brand": currentUser?.listofFollowing.includes(
          //         page?.authorId
          //       ),
          //     }
          //   )}
          // >
          //   <Text
          //     className={clsx("text-sm  font-Inter-bold", {
          //       "text-white": currentUser?.listofFollowing.includes(
          //         page?.authorId
          //       ),
          //     })}
          //   >
          //     {currentUser?.listofFollowing.includes(page?.authorId)
          //       ? "Unfollow"
          //       : "Follow"}
          //   </Text>
          // </Pressable>
          <Button
            //  label={isFollowing ? "Unfollow" : "Follow"}
            label={
              currentUser?.listofFollowing.includes(page?.authorId)
                ? "Unfollow"
                : "Follow"
            }
            className="py-1 px-4"
            //  loading={actionLoading}
            //  onPress={handleFollowAction}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// import {
//   View,
//   Text,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   useWindowDimensions,
//   StatusBar,
//   Dimensions,
// } from "react-native";
// import { Image } from "expo-image";
// import { useAppSelector } from "shared/hooks/useRedux";
// import RenderHtml from "shared/util/htmlRender";
// import usePreview from "./usePreview";
// import { Button } from "app/components/ui";
// import { FileText, Heart, Eye } from "react-native-feather";
// import LottieView from "lottie-react-native";
// import Offline from "assets/svg/Offline.json";
// import Live from "../../../components/Live";
// import useDetailsScreenItem from "../Details/useDetailsScreen";

// export default function Preview() {
//   const { height } = useWindowDimensions();
//   const { width } = Dimensions.get("screen");

//   // Destructuring values from hooks
//   const {
//     gotoDiscussion,
//     goBack,
//     shortCode,
//     title,
//     bookLive,
//     updatedContent,
//     page,
//     uniqueViewers,
//     coverImageUrl,
//   } = usePreview();

//   const {
//     commentsCount,
//     likesCount,
//     pageViewCount,
//     navigateToDiscussion,
//     authorId,
//     pageId,
//     handleLikePress,
//     isLiked,
//     html,
//     authorFullName,
//     authorProfilePicture,
//     createdAt,
//     pageShortCode,
//   } = useDetailsScreenItem();

//   const currentUser = useAppSelector((state) => state.auth.user);

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         marginTop: StatusBar.currentHeight,
//         backgroundColor: "white",
//       }}
//     >
//       {/* HEADER */}
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: 5,
//           width: width * 0.95,
//           borderBottomWidth: 1,
//           borderColor: "#8e8e8e",
//           alignSelf: "center",
//         }}
//       >
//         {/* Book Cover Image */}
//         <View>
//           <Image
//             cachePolicy="none"
//             source={`${process.env.S3}/${coverImageUrl}`}
//             className="h-12 w-12 border-4 border-gray-300 rounded-full"
//             contentFit="cover"
//           />
//         </View>

//         {/* Book Details */}
//         <View style={{ marginLeft: 5, width: width * 0.6 }}>
//           <Text
//             style={{
//               fontSize: 18,
//             }}
//             className="text-gray-400"
//           >
//             {shortCode}
//           </Text>
//           <Text
//             className="text-Primary"
//             style={{
//               fontSize: 16,
//             }}
//           >
//             {title.length > 10 ? title.slice(0, 10) + "..." : title}
//           </Text>
//         </View>

//         {/* Live or Offline Status */}
//         <View>
//           {bookLive ? (
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Live color={"red"} />
//               <Text
//                 style={{
//                   fontSize: 16,
//                   color: "black",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Live({uniqueViewers.size})
//               </Text>
//             </View>
//           ) : (
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <LottieView
//                 style={{ width: 16, height: 16 }}
//                 resizeMode="cover"
//                 source={Offline}
//                 autoPlay
//                 loop
//               />
//               <Text style={{ fontSize: 14, color: "#666" }}>Offline</Text>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Content Preview */}
//       <ScrollView style={{ marginTop: 10, marginHorizontal: 10 }}>
//         <RenderHtml html={updatedContent} />
//       </ScrollView>

//       {/* Footer Actions */}
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-around",
//           padding: 10,
//           borderTopWidth: 1,
//           borderColor: "#ccc",
//           backgroundColor: "white",
//         }}
//       >
//         {/* Like Button */}
//         <TouchableOpacity
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//           }}
//           onPress={handleLikePress}
//         >
//           <Heart color="red" fill={isLiked ? "red" : "white"} />
//           <Text style={{ marginLeft: 6 }}>{likesCount}</Text>
//         </TouchableOpacity>

//         {/* Comments Button */}
//         <TouchableOpacity
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//           }}
//           onPress={() => navigateToDiscussion()}
//         >
//           <FileText color="black" />
//           <Text style={{ marginLeft: 6 }}>{commentsCount}</Text>
//         </TouchableOpacity>

//         {/* Page Views */}
//         <TouchableOpacity
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//           }}
//           disabled
//         >
//           <Eye color="black" />
//           <Text style={{ marginLeft: 6 }}>{pageViewCount}</Text>
//         </TouchableOpacity>

//         {/* Follow/Unfollow Button */}
//         {page?.authorId !== currentUser?._id && (
//           <Button
//             label={
//               currentUser?.listofFollowing.includes(page?.authorId)
//                 ? "Unfollow"
//                 : "Follow"
//             }
//             className="py-1 px-4"
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }
