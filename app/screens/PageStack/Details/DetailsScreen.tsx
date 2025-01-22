import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import useDetailsScreenItem, {
  useDetailsScreenAction,
  usePageViewed,
} from "./useDetailsScreen";
import { Button, Text } from "app/components/ui";
import { formatDateAgo } from "shared/util/moment";
import { ChevronLeft, Eye, FileText, Heart } from "react-native-feather";
import { Loading } from "app/components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DetailsRouteProp } from "shared/navigators/PageStackNavigator";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useRef, useState } from "react";
import RenderHtml from "shared/util/htmlRender";
import useSafeAreaInsets from "shared/hooks/useSafeArea";
import { FlatList, TapGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Foundation from "@expo/vector-icons/Foundation";
import { showIfNotCurrentUser } from "shared/util/commom";
import axios from "axios";
import { useAppSelector } from "shared/hooks/useRedux";
const AnimatedImage = Animated.createAnimatedComponent(Image);

moment.updateLocale("en", {
  relativeTime: {
    future: "%s",
    past: "%s",
    s: "just now",
    m: "1m",
    mm: "%d m",
    h: "1h",
    hh: "%d h",
    d: "1dy",
    dd: "%d dy",
    M: "1mo",
    MM: "%d mo",
    y: "1yr",
    yy: "%d yr",
  },
});

type DetailsScreenHeaderProps = {
  authorFullName: string;
  authorProfilePicture: string;
  pageShortCode: string;
  createdAt: string;
  goBack: () => void;
  top: number;
  navigateToOtherProfile: (id: string) => void;
  authorId: string;
};

type DetailsScreenFooterProps = {
  likesCount: number;
  commentsCount: number;
  pageViewCount: number;
  authorFullName: string;
  navigateToDiscussion: Function;
  authorId: string;
  pageId: string;
  isLiked: boolean;
  handleLikePress: () => void;
  html: string;
  authorProfilePicture: string;
  pageShortCode: string;
  createdAt: string;
  goBack: () => void;
  top: number;
  // navigateToOtherProfile: (id: string) => void;
  
};

type DetailsScreenItemProps = {
  id: string;
  width: number;
  top: number;
  goBack: () => void;
  height: number;
};

const DetailsScreenHeader = ({
  authorFullName,
  authorProfilePicture,
  createdAt,
  pageShortCode,
  goBack,
  navigateToOtherProfile,
  authorId,
}: DetailsScreenHeaderProps): JSX.Element => {
  
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.75)",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 14,
        // marginBottom: 6,
        // position: "absolute",
        // marginTop: top,
        zIndex: 1000,
        // paddingVertical: 8,
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {Platform.OS === "ios" && (
          <TouchableOpacity onPress={goBack}>
            <ChevronLeft color="black" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="flex-row"
          onPress={() => navigateToOtherProfile(authorId)}
        >
          <Image
            source={{ uri: 
          authorProfilePicture?.startsWith("http")
      ? authorProfilePicture
      : `${process.env.S3}/${authorProfilePicture}`,
          }}
            style={{
              width: 26,
              aspectRatio: 1,
              borderRadius: 100,
              marginRight: 8,
              marginLeft: 4,
            }}
          />
          <Text className="mt-1">{authorFullName}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", width: "auto", gap: 10 }}>
        <Text>{pageShortCode}</Text>
        <Text>{moment(createdAt).fromNow()}</Text>
      </View>
    </View>
  );
};

const DetailsScreenFooter = ({
  commentsCount,
  likesCount,
  pageViewCount,
  navigateToDiscussion,
  authorId,
  pageId,
  handleLikePress,
  isLiked,
  html,
  authorFullName,
  authorProfilePicture,
  createdAt,
  pageShortCode,
  navigateToOtherProfile,
}: DetailsScreenFooterProps & {
  authorFullName: string;
  authorProfilePicture: string;
  createdAt: string;
  pageShortCode: string;
  navigateToOtherProfile: (id: string) => void;
}): JSX.Element => {
  const { actionLoading, handleFollowAction, isFollowing } =
    useDetailsScreenAction(authorId, pageId);
  const bottomModalRef = useRef<BottomSheetModal>(null);
  
  function openModal() {
    bottomModalRef.current?.present();
  }
  const [commentData,setCommentData]=useState()
  const token = useAppSelector((state) => state.auth.token);
  async function getAllComments() {
    // setLoading(true);
    try {
      const response = await axios.get(
        // `${process.env.EXPO_PUBLIC_API_URL}/pages/getAllCommentsByPageId/${pageRef}?page=${page}&limit=10&sortBy=createdAt:desc`,
        `${process.env.EXPO_PUBLIC_API_URL}/pages/getAllCommentsByPageId/${pageId}?page=1&limit=10&sortBy=createdAt:desc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get the current comments and append the new results
      // console.log("Data==>",response?.data?.results)
      setCommentData(response?.data?.results)
      // const updatedComments = [...allComments, ...response.data.results];
      // setAllComments(updatedComments);
      // setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getAllComments();
  }, []);
const {width}=Dimensions.get("screen")
  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: "rgba(255,255,255,0.75)",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        paddingHorizontal: 20,
        bottom: 0,
        paddingVertical: 8,
      }}
    >
      <BottomSheetModal
        snapPoints={["90%"]}
        ref={bottomModalRef}
        handleIndicatorStyle={{ width: "30%", backgroundColor: "#949494" }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={1}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetScrollView>
          {/* Render the header here */}
          <DetailsScreenHeader
            authorFullName={authorFullName}
            authorProfilePicture={authorProfilePicture}
            createdAt={createdAt}
            pageShortCode={pageShortCode}
            goBack={() => {}} // You can implement this if needed
            navigateToOtherProfile={navigateToOtherProfile}
            authorId={authorId}
          />
          {/*  */}
          <View>
          <RenderHtml  html={html} />
          <View style={{
            marginTop:20
          }}>

          </View>
          <FlatList 
          data={commentData?.slice(0, 5)}
          renderItem={({item,index})=>{
            // console.log("Follow",item?.userRef?.profilePicture)
            return(
              <View 
              style={{
                backgroundColor:"#f8f8f8",width:width*0.95,borderRadius:10,padding:15
                ,marginVertical:5,alignSelf:"center"
              }}

              
              >
                <View style={{
                  flexDirection:"row",alignItems:"center",justifyContent:"space-between"
                }}>

                  <View style={{
                    flexDirection:"row",alignItems:"center"
                  }}>
                    <Image source={{
                      uri:
                      item?.userRef?.profilePicture?.startsWith("http")
                      ? item?.userRef?.profilePicture
                      : `${process.env.S3}/${item?.userRef?.profilePicture}`
                    }}
                    style={{
                      height:40,width:40,borderRadius:40
                    }}
                    />
                    <Text style={{
                      color:"#000",fontSize:16,fontWeight:"bold",marginLeft:15
                    }} >
                      {item?.userRef?.fullName}
                    </Text>
                  </View>
                   <Text className="text-gray-500 text-xs">
                                {moment(item.createdAt).fromNow()}
                              </Text>
                </View>
                <View style={{

                  marginTop:5
                }}>
               
                      <Text
                        
                           className="ml-10 font-Inter-Black text-sm text-gray-800"
                         >
                           {item.commentText}
                         </Text>
                         </View>
                  
              </View>
            )
          }}
          />
          <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 12,padding:10,marginLeft:10
          }}
          onPress={() =>  
            {
              bottomModalRef.current?.close();
              navigateToDiscussion()
            }
          }
        >
          <FileText color="black" />
          <View style={{display:"flex",flexDirection:"row",alignItems:"center",gap:5}}>

          <Text style={{ marginLeft: 6 }}>{commentsCount}</Text>
          <Text style={{ marginLeft: 6, color:"blue",fontWeight:"bold" }}>Read / Write Comments</Text>
          </View>
        </TouchableOpacity>
          </View>
          {/*  */}
         
        </BottomSheetScrollView>
      </BottomSheetModal>
      <View style={{ flexDirection: "row",justifyContent:"space-between",alignItems:"center",width:width*0.9 }}>
      <View style={{
        flexDirection:"row"
      }}>
        {/* {html.length > 1200 && ( */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 12,
            }}
            onPress={openModal}
          >
            <Foundation name="arrows-expand" size={24} color="black" />
          </TouchableOpacity>
        {/* )} */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 12,
          }}
          onPress={handleLikePress}
        >
          <Heart color="red" fill={isLiked ? "red" : "white"} />
          <Text style={{ marginLeft: 6 }}>{likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 12,
          }}
          onPress={() => navigateToDiscussion()}
        >
          <FileText color="black" />
          <Text style={{ marginLeft: 6 }}>{commentsCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 12,
          }}
          disabled
        >
          <Eye color="black" />
          <Text style={{ marginLeft: 6 }}>{pageViewCount}</Text>
        </TouchableOpacity>
        </View>
        <View>
        {showIfNotCurrentUser (authorId) && (
          <Button
            label={isFollowing ? "Unfollow" : "Follow"}
            className="py-1 px-4"
            loading={actionLoading}
            onPress={handleFollowAction}
          />
        )}
        </View>
      </View>
    </View>
  );
};

// const DetailsScreenFooter = ({
//   commentsCount,
//   likesCount,
//   pageViewCount,

//   navigateToDiscussion,
//   authorId,
//   pageId,
//   handleLikePress,
//   isLiked,
//   html,
// }: DetailsScreenFooterProps): JSX.Element => {
//   const { actionLoading, handleFollowAction, isFollowing } =
//     useDetailsScreenAction(authorId, pageId);
//   const bottomModalRef = useRef<BottomSheetModal>(null);
//   function openModal() {
//     bottomModalRef.current?.present();
//   }
//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         backgroundColor: "rgba(255,255,255,0.75)",
//         justifyContent: "space-between",
//         alignItems: "center",
//         width: "100%",
//         paddingHorizontal: 20,
//         bottom: 0,
//         paddingVertical: 8,
//       }}
//     >
//       <BottomSheetModal
//         // enablePanDownToClose={false} // Prevent dismiss on swipe down
//         // enableContentPanningGesture={true} // Allow content scrolling
//         snapPoints={["90%"]}
//         ref={bottomModalRef}
//         handleIndicatorStyle={{ width: "30%", backgroundColor: "#949494" }}
//         backdropComponent={(props) => (
//           <BottomSheetBackdrop
//             {...props}
//             appearsOnIndex={1}
//             disappearsOnIndex={-1}
//           />
//         )}
//       >
//         <BottomSheetScrollView>
        
//           {DetailsScreenHeader()}
//           <RenderHtml html={html} />
//         </BottomSheetScrollView>
        
//       </BottomSheetModal>
//       <View style={{ flexDirection: "row" }}>
//         {html.length > 1200 && (
//           <TouchableOpacity
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginRight: 12,
//             }}
//             onPress={openModal}
//           >
//             <Foundation name="arrows-expand" size={24} color="black" />
//           </TouchableOpacity>
//         )}
//         <TouchableOpacity
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             marginRight: 12,
//           }}
//           onPress={handleLikePress}
//         >
//           <Heart color="red" fill={isLiked ? "red" : "white"} />
//           <Text style={{ marginLeft: 6 }}>{likesCount}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             marginRight: 12,
//           }}
//           onPress={() => navigateToDiscussion()}
//         >
//           <FileText color="black" />
//           <Text style={{ marginLeft: 6 }}>{commentsCount}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             marginRight: 12,
//           }}
//           disabled
//         >
//           <Eye color="black" />
//           <Text style={{ marginLeft: 6 }}>{pageViewCount}</Text>
//         </TouchableOpacity>
//       </View>
//       {showIfNotCurrentUser(authorId) && (
//         <Button
//           label={isFollowing ? "Unfollow" : "Follow"}
//           className="py-2 px-4"
//           loading={actionLoading}
//           onPress={handleFollowAction}
//         />
//       )}
//     </View>
//   );
// };

const DetailsScreenItem = ({
  id,
  goBack,
  top,
  width,
  height,
}: DetailsScreenItemProps): JSX.Element => {
  const {
    pageDetails,
    html,
    authorFullName,
    authorProfilePicture,
    isLoading,
    navigateToDiscussion,
    navigateToOtherProfile,
    doubleTapRef,
    onDoubleTap,
    onSingleTap,
    rStyle,
    handleLikePress,
    isLiked,
    likesCount,
  } = useDetailsScreenItem(id);
 
  

  if (!pageDetails || isLoading)
    return (
      <View style={{ width, height }}>
        <Loading />
      </View>
    );

  const { createdAt, pageShortCode, commentsCount, pageViewCount, authorId } =
    pageDetails;

    console.log("Id",id)

  return (
    <View>
      <TapGestureHandler waitFor={doubleTapRef} onActivated={onSingleTap}>
        <TapGestureHandler
          maxDelayMs={250}
          ref={doubleTapRef}
          numberOfTaps={2}
          onActivated={onDoubleTap}
        >
          <View
            style={{
              width,
              height,
              backgroundColor: "#fff",
            }}
          >
            <DetailsScreenHeader
              authorFullName={authorFullName}
              authorProfilePicture={authorProfilePicture}
              createdAt={createdAt}
              pageShortCode={pageShortCode}
              goBack={goBack}
              top={top}
              navigateToOtherProfile={navigateToOtherProfile}
              authorId={authorId}
            />
            {/* <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <RenderHtml html={html} />
            </ScrollView> */}
            <ScrollView className="flex-1">
              <RenderHtml html={html} />
            </ScrollView>
            <DetailsScreenFooter
             authorFullName={authorFullName}
             authorProfilePicture={authorProfilePicture}
             createdAt={createdAt}
             pageShortCode={pageShortCode}
           
              commentsCount={commentsCount}
              likesCount={likesCount}
              pageViewCount={pageViewCount}
              navigateToDiscussion={navigateToDiscussion}
              authorId={pageDetails.authorId}
              pageId={pageDetails._id}
              isLiked={isLiked}
              handleLikePress={handleLikePress}
              html={html}
            />
            <Animated.View
              style={{
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AnimatedImage
                source={require("assets/images/heart.png")}
                style={[
                  {
                    width,
                    height: width,
                    alignSelf: "center",
                    top: "40%",
                  },
                  rStyle,
                ]}
                resizeMode={"center"}
              />
            </Animated.View>
          </View>
        </TapGestureHandler>
      </TapGestureHandler>
    </View>
  );
};

const DetailsScreenList = (): JSX.Element => {
  const { width, height } = useWindowDimensions();
  const {
    params: { pageIds, initialIndex },
  } = useRoute<DetailsRouteProp>();
  const { top } = useSafeAreaInsets();
  const { goBack } = useNavigation();
  const listRef = useRef<FlashList<string>>(null);
  const { onViewableItemsChanged } = usePageViewed(pageIds);
 
  

  const renderItem = useCallback(({ item }: { item: string }) => {
    return (
      <DetailsScreenItem
        goBack={goBack}
        top={top}
        width={width}
        id={item}
        key={item}
        height={height}
      />
    );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlashList
        ref={listRef}
        data={pageIds}
        renderItem={renderItem}
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={height}
        estimatedListSize={{
          height: height * pageIds.length,
          width,
        }}
        initialScrollIndex={initialIndex ?? 0}
        contentOffset={{ x: 0, y: (initialIndex ?? 0) * height }}
        // contentOffset={{ x: (initialIndex ?? 0) * width, y: 0 }}
        // onViewableItemsChanged={onViewableItemsChanged}
        // viewabilityConfig={{
        //   itemVisiblePercentThreshold: 100,
        // }}
        // horizontal
      />
      {/* <DetailsScreenItem
        goBack={goBack}
        top={top}
        width={width}
        id={pageIds[initialIndex ?? 0]}
        height={height}
      /> */}
    </SafeAreaView>
  );
};

export default DetailsScreenList;
