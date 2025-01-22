import { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  useWindowDimensions,
  Alert,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Animated,
  useAnimatedValue,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendPushNotification } from "app/components/NotificationsManager";

import { RichEditor } from "react-native-pell-rich-editor";
import { CroppedImage } from "app/components/CroppedImage";
import {
  SocketContext,
  SocketContextType,
} from "screens/Socket/SocketProvider";
import { useAppSelector } from "shared/hooks/useRedux";
import { useNavigation } from "@react-navigation/native";
import usePageEditor, { ImageSize } from "../usePageEditor";
import { AnimatedViewLifter, Button, Text } from "app/components/ui";
import { fontFamilyStyleSheet } from "assets/fonts/fontStylesheet";
import UploadPhotoIcon from "assets/svg/Stream/UploadPhoto";
import UseDebounce from "app/components/UseDebounce";
import Load from "assets/svg/Load.json";
import LottieView from "lottie-react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const fontFamily = "Inter";
const initialCSSText = {
  initialCSSText: `${fontFamilyStyleSheet}`,
  contentCSSText: `font-family: ${fontFamily}`,
};

export default function RichTextEditor() {
  const { height } = useWindowDimensions();
  const { liveBookSocket } = useContext(SocketContext) as SocketContextType;
  const { goBack } = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    insertPage,
    isLoading,
    updatePage,
    page,
    pageText,
    setPageText,
    buttonLoading,
    addImage,
    mediaLoading,
    richText,
    handleChange,
    goLive,
  } = usePageEditor();

// console.log("True",goLive)

  const animatedOpacity = useAnimatedValue(0);
  let isPhotoMenuOpen = useRef<boolean>(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState<boolean>(false);
  const debouncedPageText = UseDebounce(pageText, 500);
  const previousCursosPosition = useRef(0);
  const tabBarHeight = useBottomTabBarHeight();
  // if Drafting page then select decoded text of draft, if new page then pagetext = ""
  let textLength = pageText.replace(/<[^>]*>?/gm, "").length;
  const imageIncluded = pageText.includes("img class=");
  const newline = (pageText.match(/<\/div>/g) || []).length;

  // console.log("imageIncluded==>",imageIncluded)

  //Content Limit
 
  
  
  
  const [percentage, setPercentage] = useState(0); // provide 1 less to have 100% otherwise it will be 101%
  const [toKnow, setToKnow] = useState();

  useEffect(() => {
    // Function to continuously fetch the value
    const intervalId = setInterval(() => {
      getForLiveValue();
    }, 200); // Fetch every 2 seconds (adjust as needed)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getForLiveValue = async () => {
    try {
      const value = await AsyncStorage.getItem("ForLive");
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        // console.log("Retrieved value:", parsedValue);
        setToKnow(parsedValue); // Update state with the retrieved value
      } else {
        console.log("No value found for 'ForLive'");
        // setToKnow(null); // Set state to null if no value exists
      }
    } catch (error) {
      console.error("Error retrieving value from AsyncStorage:", error);
    }
  };


  // if there is square image then limit 150, for portrait limit 100, and for full limit 599
  let limit = pageText.includes(`class="square"`)
    ? 120000
    : pageText.includes(`class="portrait"`)
    ? 120000
    : pageText.includes(`class="full"`)
    ? 1
    : 180000;

  const handleAuthorAddedNewPage = () => {
    liveBookSocket.emit("author_added_new_page", {
      bookId: page.bookId,
      newPageNumber: page?.pageNumber + 1, // PageNumber starts from 0
    });
  };

  const pickImage = (aspectRatio: [number, number], size: ImageSize) => {
    closeAnimation();
    addImage(aspectRatio, size);
  };

  async function sendNotify(title, body) {
    console.log(title, body);
    await sendPushNotification(title, body);
  }

  const richTextHandle = (text: string) => {
    console.log("richTextHandle",text)
    const newText = text.replace(
      /<span style="color: gray;">Write Something...<\/span>/g,
      "<div></div>"
    );

    /* Why we using WrappedText: When Text copied from website it has first like outside the <div> and the remaining part was inside the div , so text outside div was looking awkward. having no margin and different fontSize.
  What wrappedText does is just put <div> tag to that untagged text */

    const wrappedText = newText.replace(
      /(^|<\/\w+>)([^<]+)(<|$)/g,
      (match, p1, p2, p3) => {
        return p1 + (p2.trim() ? `<div>${p2.trim()}</div>` : p2) + p3;
      }
    );
    // There was too much spacing after "ENTER" reason:[<br> was enclosed in <div></div>, making two spaces], we have to put <br> before </div> here i found solution if removeDivFrowmBr makes any problem then remove it an keep using wrappedText instead... change removeDivFromBr to

    let removeDivFromBr = wrappedText.replace(
      /<\/div><div><br><\/div>/g,
      "<br></div>"
    );

    // TakeOut img tag from div and place it outside, img tag inside div will cause having no margin . hence the text in that div will also be not having margin
    const extractImgFromDiv = imageIncluded
      ? removeDivFromBr.replace(
          /<div>((?!<div>).*?)<img(.*?)>((?!<div>).*?)<\/div>/g,
          "<div>$1$3</div><img$2>"
        )
      : removeDivFromBr;
    const strippedText = extractImgFromDiv.replace(/<[^>]*>?/gm, "");
    setPageText(text);
    setPercentage(Math.round((strippedText.length / limit) * 100));
  };

  function update(isDraft: "true" | "false") {
    if (!page) return;
    updatePage({
      _id: page._id,
      isDraft,
      rawHtmlContent: pageText,
    });
  }

  function updateContinue() {
    updatePage({
      _id: page._id,
      isDraft: "false",
      rawHtmlContent: pageText,
    })
      .then(() => {
        insertPage({
          bookId: page.bookId,
          items: [
            {
              type: "html",
              rawHtmlContent: "",
            },
          ],
        });
      })
      .finally(() => {
        richText.current?.setContentHTML("");
        handleAuthorAddedNewPage();
        setPageText(""); // Send new emit of empty pageText
        handleChange();
        scrollViewRef?.current?.scrollTo({ y: 0 }); // Scrolltop dont stay down.
      });
  }

  function startAnimation() {
    if (isPhotoMenuOpen.current) {
      const animation = Animated.timing(animatedOpacity, {
        toValue: 0,
        useNativeDriver: true,
        duration: 200,
      });

      animation.start();
      isPhotoMenuOpen.current = false;
      setShowPhotoMenu(false);
    } else {
      const animation = Animated.timing(animatedOpacity, {
        toValue: 1,
        useNativeDriver: true,
        duration: 200,
      });

      animation.start();
      isPhotoMenuOpen.current = true;
      setShowPhotoMenu(true);
    }
  }

  function closeAnimation() {
    const animation = Animated.timing(animatedOpacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 200,
    });

    animation.start();

    isPhotoMenuOpen.current = false;
  }

  useEffect(() => {
    percentage < 101 && handleChange();
  }, [debouncedPageText]);

  useEffect(() => {
    if (liveBookSocket) {
      liveBookSocket.on("new_viewer_joined", () => {
        //Note: When new Viewer joined the handleChange() will execute and he will see latest content.
        handleChange();
      });
    }

    return () => {
      if (liveBookSocket) {
        liveBookSocket.off("new_viewer_joined");
      }
    };
  }, [liveBookSocket, pageText]);

  useEffect(() => {
    return () => {
      setPageText("");
    };
  }, []);


const {width}=Dimensions.get("screen")


  return (
    <View className="flex-1  ">
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <RichEditor
          onCursorPosition={(pos) => {
            if (pos > 300) {
              scrollViewRef.current?.scrollTo({ y: pos - 280 });
              previousCursosPosition.current = pos;
            } else if (pos < 100) {
              if (pos > 30) scrollViewRef.current?.scrollTo({ y: pos });
              else scrollViewRef.current?.scrollTo({ y: 0 });
              previousCursosPosition.current = pos;
            } else if (pos - previousCursosPosition.current <= -40) {
              scrollViewRef.current?.scrollTo({ y: pos });
              previousCursosPosition.current = pos;
            }
            // if (pos > 300) {
            //   scrollViewRef.current?.scrollTo({ y: pos + 100 });
            // } else if (pos > 600)
            //   scrollViewRef.current?.scrollTo({ y: pos * 1.6 });
            // else if (pos > 900) scrollViewRef.current?.scrollTo({ y: pos * 2 });
          }}
          // hideKeyboardAccessoryView={true}
          showsVerticalScrollIndicator={false}
          editorStyle={{
            color: !toKnow && textLength >= 4800  ? "#FF9D9D" : "black",
            caretColor: "#6687c4",
            ...initialCSSText,
          }}
          ref={richText}
          // Send Emit of last changes
          onPaste={(val) => {
            richText.current?.insertHTML(`<div></div>`);
          }}
          // onKeyUp={() => percentage < 101 && handleChange()}
          pasteAsPlainText={toKnow == false ? true : false}
          initialHeight={height * 0.86}
          initialContentHTML={pageText}
          onTouchStart={() => {
            // NOTE: this condition was creating new line when there was nothing inserted. So we only use it when there is no image
            if (imageIncluded) {
              // richText.current?.setContentHTML(pageText + "<span><br/></span>"); NOTE: uncomment if recent problem regarding new text didn't work
              richText.current?.setContentHTML(pageText + "<div><br/></div>");
              richText.current?.focusContentEditor();
            }
          }}
          onChange={richTextHandle}
          placeholder="Lets write whats on your mind... "
        />
      </ScrollView>

      <View className="flex-row items-center relative">
        {/* {percentage >= 100 && (
          <View className="absolute bg-gray-300 items-center p-5 w-screen z-50">
            <Text>You are exceeding the content limit.</Text>
          </View>
        )} */}
        {/* {
          <TouchableOpacity
            className="flex-row flex-1"
            onPress={startAnimation}
            // disabled={mediaLoading || textLength > 1200 || imageIncluded}
          >
            {mediaLoading ? (
              <View className=" w-10 h-4 items-center self-center mt-1">
                <LottieView resizeMode="cover" source={Load} autoPlay loop />
              </View>
            ) : (
              <>
              {goLive ? 
              <>
              <UploadPhotoIcon />
              <Text> Upload Photo</Text>
            </>
            :
            {textLength < 1200 && !imageIncluded && (
              <>
                <UploadPhotoIcon />
                <Text> Upload Photo</Text>
              </>
            )}
            }
              
               
              </>
            )}
          </TouchableOpacity>
        } */}
        <TouchableOpacity

  style={{
    width:width*0.1
  }}
  onPress={startAnimation}
  // disabled={mediaLoading || textLength < 4800 ||
  //   imageIncluded || toKnow ? true : false}
  disabled={imageIncluded == true && toKnow == false ? true: false }
>
  {mediaLoading ? (
    <View className="w-10 h-4 items-center self-center mt-1">
      <LottieView resizeMode="cover" source={Load} autoPlay loop />
    </View>
  ) : (
    <>
     <UploadPhotoIcon />
      {/* {toKnow ? (
        <>
          <UploadPhotoIcon />
          {/* <Text> Upload Photo</Text> 
        </>
      ) : (
        textLength < 4800 ||
        !imageIncluded && (
          <>
            <UploadPhotoIcon />
            {/* <Text> Upload Photo</Text>
          </>
        )
      )} */}
    </>
  )}
</TouchableOpacity>
 
 <View style={{
  width:width*0.35,flexDirection:"row",alignItems:"center",justifyContent:"space-around",
  paddingRight:width*0.1
 }}>
 <AnimatedCircularProgress
        size={20} 
        width={4}
        fill={(textLength || imageIncluded / 4800 ) * 100}
        tintColor= {!toKnow && textLength >= 4800 ? "#FF0000" : "#009846" }
        backgroundColor="#909098" 
        duration={800} 
      >
      </AnimatedCircularProgress>
     {!toKnow && textLength >= 4800 ? <Text style={{
        color:"#FF0000",fontSize:12
      }}>
        Limit Exceed!
      </Text> : 
      <Text style={{
        color:"#FFF",fontSize:12
      }}>
        Limit Exceed!
      </Text>
      }
 </View>

        <Animated.View
          style={{
            opacity: animatedOpacity,
            position: "absolute",
            bottom: 40,
            display: showPhotoMenu ? "flex" : "none",
            backgroundColor: "#FFF",
            borderRadius:10
          }}
        >
          {/* {!imageIncluded && ( */}
            <View className="space-y-2 border p-2 rounded-lg border-gray-500">
              {/* {textLength < 1200 && ( */}
                <TouchableOpacity
                  onPress={() => pickImage([1, 1], ImageSize.square)}
                  className="flex-row items-center space-x-2"
                >
                  <UploadPhotoIcon />
                  <Text className="font-Inter-Black text-xs">Square</Text>
                </TouchableOpacity>
              {/* )} */}

              {/* {textLength < 1200 && ( */}
                <TouchableOpacity
                  onPress={() => pickImage([3, 4], ImageSize.portrait)}
                  className="flex-row items-center space-x-2 "
                >
                  <UploadPhotoIcon />

                  <Text className="font-Inter-Black text-xs">Portrait</Text>
                </TouchableOpacity>
              {/* )} */}
              {/* {textLength === 0 && ( */}
                <TouchableOpacity
                  onPress={() => pickImage([9, 16], ImageSize.full)}
                  className="flex-row items-center space-x-2"
                >
                  <UploadPhotoIcon />
                  <Text className="font-Inter-Black text-xs">Full</Text>
                </TouchableOpacity>
              {/* )} */}
            </View>
          {/* )} */}
        </Animated.View>

        {/* {newline < 50 ? ( */}
          <Button
            label="Publish"
            className={`rounded-lg flex-1 py-1 ${
              pageText.replace(/<[^>]*>?/gm, "").length > 10 ||
              pageText.includes(`class="full"`)
                ? "bg-brand border-brand"
                : "bg-grey border-grey"
            }`}
            loading={buttonLoading}
            // Disabled if %>100 or Pure text length is equal to zero
            onPress={() => {
              if (
                !(
                  pageText.replace(/<[^>]*>?/gm, "").length > 10 ||
                  pageText.includes(`class="full"`)
                )
              )
                return;
              Alert.alert(
                "Confirm &  Save",
                "You cannot edit this page later, Are you sure to save this page.",
                [
                  // {
                  //   text: "Continue ",
                  //   onPress: () => {
                  //     handleAuthorAddedNewPage();
                  //     updateContinue();
                  //   },
                  // },

                  {
                    text: "CONFIRM & PUBLISH",
                    onPress: () => {
                      update("false");
                      handleAuthorAddedNewPage();
                      goBack();
                    },
                  },
                  {
                    text: "SAVE DRAFT",
                    onPress: () => {
                      update("true");
                      goBack();
                    },
                  },
                  {
                    text: "CANCEL",
                  },
                ],
                { cancelable: true }
              );
            }}
          />
        {/* // ) : (
        //   <View className="bg-gray-300 items-center p-5 w-[100%]">
        //     <Text className="text-xs font-Inter-medium">
        //       You are exceeding new lines limit
        //     </Text>
        //   </View>
        // )} */}
        {/* {percentage < 100 &&
          (textLength > 800 || pageText.includes(`class="`)) && (
            <Pressable
              disabled={isLoading}
              onPress={() => updateContinue()}
              className="items-center self-center border-2 border-Primary/40 px-2 py-1 rounded-xl"
            >
              <Text>{isLoading ? "Loading..." : "Continue & Save"}</Text>
            </Pressable>
          )} */}
      </View>
      <AnimatedViewLifter
        style={{
          backgroundColor: "#fff",
          width: "100%",
          position: "relative",
        }}
        heightOffset={tabBarHeight * -1}
        fullHeight={true}
        applyOnHeight={true}
      />
    </View>
  );
}


// import { useContext, useEffect, useRef, useState } from "react";
// import {
//   View,
//   useWindowDimensions,
//   Alert,
//   ScrollView,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { sendPushNotification } from "app/components/NotificationsManager";
// import { RichEditor } from "react-native-pell-rich-editor";
// import { CroppedImage } from "app/components/CroppedImage";
// import {
//   SocketContext,
//   SocketContextType,
// } from "screens/Socket/SocketProvider";
// import { useAppSelector } from "shared/hooks/useRedux";
// import { useNavigation } from "@react-navigation/native";
// import usePageEditor, { ImageSize } from "../usePageEditor";
// import { Button, Text } from "app/components/ui";
// import { fontFamilyStyleSheet } from "assets/fonts/fontStylesheet";
// import UploadPhotoIcon from "assets/svg/Stream/UploadPhoto";
// import UseDebounce from "app/components/UseDebounce";
// import Load from "assets/svg/Load.json";
// import LottieView from "lottie-react-native";
// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { AnimatedCircularProgress } from "react-native-circular-progress";

// const fontFamily = "Inter";
// const initialCSSText = {
//   initialCSSText: `${fontFamilyStyleSheet}`,
//   contentCSSText: `font-family: ${fontFamily}`,
// };

// export default function RichTextEditor() {
//   const { height } = useWindowDimensions();
//   const { liveBookSocket } = useContext(SocketContext) as SocketContextType;
//   const { goBack } = useNavigation();
//   const scrollViewRef = useRef<ScrollView>(null);
//   const {
//     insertPage,
//     isLoading,
//     updatePage,
//     page,
//     pageText,
//     setPageText,
//     buttonLoading,
//     addImage,
//     mediaLoading,
//     richText,
//     handleChange,
//     goLive,
//   } = usePageEditor();

//   const animatedOpacity = useRef(new Animated.Value(0)).current;
//   const isPhotoMenuOpen = useRef<boolean>(false);
//   const [showPhotoMenu, setShowPhotoMenu] = useState<boolean>(false);
//   const debouncedPageText = UseDebounce(pageText, 500);
//   const previousCursorPosition = useRef(0);
//   const tabBarHeight = useBottomTabBarHeight();
//   const [percentage, setPercentage] = useState(0);
//   const [toKnow, setToKnow] = useState(null);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       getForLiveValue();
//     }, 200);

//     return () => clearInterval(intervalId);
//   }, []);

//   const getForLiveValue = async () => {
//     try {
//       const value = await AsyncStorage.getItem("ForLive");
//       if (value !== null) {
//         setToKnow(JSON.parse(value));
//       } else {
//         setToKnow(null);
//       }
//     } catch (error) {
//       console.error("Error retrieving value from AsyncStorage:", error);
//     }
//   };

//   const limit = pageText.includes(`class="square"`)
//     ? 120000
//     : pageText.includes(`class="portrait"`)
//     ? 120000
//     : pageText.includes(`class="full"`)
//     ? 1
//     : 180000;

//   const handleAuthorAddedNewPage = () => {
//     liveBookSocket.emit("author_added_new_page", {
//       bookId: page.bookId,
//       newPageNumber: page?.pageNumber + 1,
//     });
//   };

//   const pickImage = (aspectRatio: [number, number], size: ImageSize) => {
//     closeAnimation();
//     addImage(aspectRatio, size);
//   };

//   const richTextHandle = (text: string) => {
//     const newText = text.replace(
//       /<span style="color: gray;">Write Something...<\/span>/g,
//       "<div></div>"
//     );
//     const wrappedText = newText.replace(
//       /(^|<\/\w+>)([^<]+)(<|$)/g,
//       (match, p1, p2, p3) => {
//         return p1 + (p2.trim() ? `<div>${p2.trim()}</div>` : p2) + p3;
//       }
//     );
//     const removeDivFromBr = wrappedText.replace(
//       /<\/div><div><br><\/div>/g,
//       "<br></div>"
//     );
//     const extractImgFromDiv = removeDivFromBr.replace(
//       /<div>((?!<div>).*?)<img(.*?)>((?!<div>).*?)<\/div>/g,
//       "<div>$1$3</div><img$2>"
//     );
//     const strippedText = extractImgFromDiv.replace(/<[^>]*>?/gm, "");
//     setPageText(text);
//     setPercentage(Math.round((strippedText.length / limit) * 100));
//   };

//   const update = (isDraft: "true" | "false") => {
//     if (!page) return;
//     updatePage({
//       _id: page._id,
//       isDraft,
//       rawHtmlContent: pageText,
//     });
//   };

//   const updateContinue = () => {
//     updatePage({
//       _id: page._id,
//       isDraft: "false",
//       rawHtmlContent: pageText,
//     })
//       .then(() => {
//         insertPage({
//           bookId: page.bookId,
//           items: [
//             {
//               type: "html",
//               rawHtmlContent: "",
//             },
//           ],
//         });
//       })
//       .finally(() => {
//         richText.current?.setContentHTML("");
//         handleAuthorAddedNewPage();
//         setPageText("");
//         handleChange();
//         scrollViewRef?.current?.scrollTo({ y: 0 });
//       });
//   };

//   const startAnimation = () => {
//     Animated.timing(animatedOpacity, {
//       toValue: isPhotoMenuOpen.current ? 0 : 1,
//       useNativeDriver: true,
//       duration: 200,
//     }).start();
//     isPhotoMenuOpen.current = !isPhotoMenuOpen.current;
//     setShowPhotoMenu(!showPhotoMenu);
//   };

//   const closeAnimation = () => {
//     Animated.timing(animatedOpacity, {
//       toValue: 0,
//       useNativeDriver: true,
//       duration: 200,
//     }).start();
//     isPhotoMenuOpen.current = false;
//     setShowPhotoMenu(false);
//   };

//   useEffect(() => {
//     percentage < 101 && handleChange();
//   }, [debouncedPageText]);

//   useEffect(() => {
//     if (liveBookSocket) {
//       liveBookSocket.on("new_viewer_joined", () => handleChange());
//     }
//     return () => {
//       liveBookSocket?.off("new_viewer_joined");
//     };
//   }, [liveBookSocket, pageText]);

//   useEffect(() => {
//     return () => setPageText("");
//   }, []);

//   const { width } = Dimensions.get("screen");

//   return (
//     <View className="flex-1">
//       <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
//         <RichEditor
//           onCursorPosition={(pos) => {
//             if (pos > 300) {
//               scrollViewRef.current?.scrollTo({ y: pos - 280 });
//             } else if (pos < 100) {
//               scrollViewRef.current?.scrollTo({ y: pos });
//             }
//           }}
//           editorStyle={{
//             color: !toKnow && percentage >= 100 ? "#FF9D9D" : "black",
//             caretColor: "#6687c4",
//             ...initialCSSText,
//           }}
//           ref={richText}
//           initialHeight={height * 0.86}
//           initialContentHTML={pageText}
//           onChange={richTextHandle}
//           placeholder="Let's write what's on your mind..."
//         />
//       </ScrollView>
//       <View className="flex-row items-center">
//         <TouchableOpacity
//           style={{ width: width * 0.1 }}
//           onPress={startAnimation}
//         >
//           {mediaLoading ? (
//             <LottieView resizeMode="cover" source={Load} autoPlay loop />
//           ) : (
//             <UploadPhotoIcon />
//           )}
//         </TouchableOpacity>
//         <View
//           style={{
//             width: width * 0.35,
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-around",
//             paddingRight: width * 0.1,
//           }}
//         >
//       <AnimatedCircularProgress
//   size={20}
//   width={4}
//   fill={(pageText.replace(/<[^>]*>?/gm, "").length / limit) * 100}
//   tintColor={!toKnow && percentage >= 100 ? "#FF0000" : "#009846"}
//   backgroundColor="#909098"
// />

//           <Text
//             style={{
//               color: percentage >= 100 ? "#FF0000" : "#FFF",
//               fontSize: 12,
//             }}
//           >
//             {percentage >= 100 ? "Limit Exceeded!" : "Writing in Limit"}
//           </Text>
//         </View>
//         <Button
//           label="Publish"
//           className={`rounded-lg flex-1 py-1 ${
//             pageText.replace(/<[^>]*>?/gm, "").length > 10 ||
//             pageText.includes(`class="full"`)
//               ? "bg-brand border-brand"
//               : "bg-grey border-grey"
//           }`}
//           loading={buttonLoading}
//           onPress={() => update("false")}
//           disabled={
//             !(
//               pageText.replace(/<[^>]*>?/gm, "").length > 10 ||
//               pageText.includes(`class="full"`)
//             )
//           }
//         />
//       </View>
//     </View>
//   );
// }


