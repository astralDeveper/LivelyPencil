import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import {
  SocketContext,
  SocketContextType,
} from "screens/Socket/SocketProvider";
import {
  useGetAllCommentsQuery,
  useGetPageByIdQuery,
  useLazyGetPageByIdQuery,
} from "shared/apis/page/pageApi";
import {
  useInsertPageMutation,
  useUpdatePageMutation,
} from "shared/apis/page/pageEditorApi";
import { useAddMediaMutation } from "shared/apis/user/userFileApi";
import { useAppSelector } from "shared/hooks/useRedux";
import {
  PageEditorRouteProp,
  StreamStackNavigatorProps,
} from "shared/navigators/StreamStackNavigator";
import { IGetPageById } from "shared/types/page/PageResponse.type";
import { apiHandler } from "shared/util/handler";
import { RichEditor } from "react-native-pell-rich-editor";
import { removeImageTag } from "shared/util/htmlParsers";
import he from "he";
import { usePaginatedPagesList } from "shared/hooks/usePaginatedList";
import AsyncStorage from "@react-native-async-storage/async-storage";

export enum ImageSize {
  full = "full",
  portrait = "portrait",
  square = "square",
}

let isLive = false; // Outside of function so it is changed on every render
// Helps optimise sending calls to socket API

// APIs -> update page, insert page
const usePageEditor = () => {
  const {
    params: { pageId, pageNumber },
  } = useRoute<PageEditorRouteProp>();
  
  const {
    setLiveBookRooms,
    liveBookSocket,
    liveBookRooms,
    viewers,
    discussionSocket,
  } = useContext(SocketContext) as SocketContextType;
  const { navigate } = useNavigation<StreamStackNavigatorProps>();
  const [page, setPage] = useState<IGetPageById>();
  const richText = useRef<RichEditor>(null);

  const [pageText, setPageText] = useState("");
  const [goLive, setGoLive] = useState<boolean>(false);
  const [lastComment, setLastComment] = useState("");
  const [forResponse, setForResponse] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const userId = useAppSelector((state) => state.auth.user?._id);

  const fullNames = viewers?.liveBook?.joinedFollowers?.map(
    (follower) => follower.fullName
  );
  const uniqueFullNames = [...new Set(fullNames)];
  const uniqueFullNamesCount = new Set(fullNames).size;

  const fullNamesString = uniqueFullNames?.join("\n");

  const [updatePage, { data, isLoading, error }] = useUpdatePageMutation();
  const [
    fetchPageLazily,
    { data: pageData, error: pageError, isLoading: pageLoading },
  ] = useLazyGetPageByIdQuery();


  const {
    data: commentsData,
    error: commentsError,
    isLoading: commentsLoading,
  } = useGetAllCommentsQuery(pageId);
  const [
    insertPage,
    { data: insertData, isLoading: insertLoading, error: insertError },
  ] = useInsertPageMutation();
  const [
    addMedia,
    { data: mediaData, isLoading: mediaLoading, error: mediaError },
  ] = useAddMediaMutation();

  useEffect(() => {
    apiHandler({
      data,
      error,
      showSuccess: true,
    });
  }, [data, error]);

  useEffect(() => {
    apiHandler({
      data: insertData,
      error: insertError,
      showSuccess: true,
    });
  }, [insertData, insertError]);

  useEffect(() => {
    apiHandler({
      data: mediaData,
      error: mediaError,
      onSuccess(response) {
       
        // const imageUrl = `${process.env.S3}/` + response.fileKey;
        const imageUrl = forResponse;
        const combinedHTML = `<img class="${imageSize}" src="${imageUrl}" style="width:100%"/>`;
        handleChange(pageText + combinedHTML);
        if (pageText.replace(/<[^>]*>?/gm, "").length >= 4) {
          // If user insert image on same line then we close that line using </div>
          richText.current?.insertHTML("</div>");
        }
        if (pageText.length === 0)
          richText.current?.insertHTML(`<div>${combinedHTML}</div>`);
        else richText.current?.insertHTML(combinedHTML);
        // if (size != "full" && pageText == "") { removing page text experiment
        // if (imageSize !== "full") {
        //   richText.current?.insertHTML(
        //     `<div style='color:gray'>Write Something...</div>`
        //   );
        // } else {
        //   richText.current?.insertHTML("<span></span>");
        //   handleChange(combinedHTML);
        // }
      },
    });
  }, [mediaData, mediaError]);
  
  const [storedPagesLength, setStoredPagesLength] = useState(null);
  const [storedPagesLength2, setStoredPagesLength2] = useState(null);

  useEffect(() => {
    const getFromAsyncStorage = async () => {
      try {
        const value = await AsyncStorage.getItem('pagesLength');
        if (value !== null) {
          const parsedValue = parseInt(value, 10);
          setStoredPagesLength(parsedValue);
          // console.log('Retrieved from AsyncStorage:', parsedValue); // Log inside the async function
        }
      } catch (error) {
        console.error('Error retrieving from AsyncStorage:', error);
      }
    };

    // Polling every 200ms
    const interval = setInterval(() => {
      getFromAsyncStorage();
    }, 200);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Log state updates directly
  useEffect(() => {
    // console.log('Updated storedPagesLength:', storedPagesLength);
    setStoredPagesLength2(storedPagesLength);
  }, [storedPagesLength]); // Triggered every time `storedPagesLength` updates

  // console.log( "adfafaf",storedPagesLength2)

  useEffect(() => {
    apiHandler({
      data: pageData,
      error: pageError,
      onSuccess(response) {
        setPage(response.data);
        setPageText(
          he.decode(response.data.history[0].items[0].rawHtmlContent)
        );
      },
    });
  }, [pageData, pageError]);



  useEffect(() => {
    fetchPageLazily(pageId, false);
  }, []);

  useEffect(() => {
    apiHandler({
      data: commentsData,
      error: commentsError,
      onSuccess(response) {
        let commentsString = response.results
          .map((comment) => {
            let fullName = comment.userRef.fullName;
            return ` ${fullName}: ${comment.commentText} `;
          })
          .join("");
        setLastComment(commentsString);
      },
    });
  }, [commentsData, commentsError]);

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
        pageRef: page?._id,
      });
    }
    return () => {
      if (discussionSocket) {
        discussionSocket.off("new_comment_made");
        discussionSocket.emit("delete_discussion_room", {
          pageRef: page?._id,
        });
      }
    };
  }, [discussionSocket]);




  const handleGoLive = async () =>{

    await AsyncStorage.setItem('selectedItemId', pageId);
    setGoLive(true);
    isLive = true;
    console.log("livevevevevev")
    liveBookSocket?.emit("turn_on_book_live_mode", {
      bookId: page?.bookId,
      authorId: userId,
    });
    liveBookSocket?.emit("author_updated_page", {
      bookId: page?.bookId,
      authorId: userId,
      data: pageText,
    });
  }

  function handleOffline() {
    liveBookSocket?.emit("author_leave_live_book", {
      bookId: page?.bookId,
    });
    const newList = liveBookRooms.filter((r) => r != page?.bookId);
    setLiveBookRooms(newList);
    setGoLive(false);
    isLive = false;
  }

  async function addImage(aspectRatio: [number, number], size: ImageSize) {
    // if ((pageText.match(/<img /g) || []).length === 1) {
    //   Alert.alert("Limit Reached", "Media is taking almost 70% of text space");
    //   return;
    // }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: aspectRatio ? true : false,
      aspect: aspectRatio,
    });

    if ("granted" in result && result.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }
    if (result.canceled) {
      return;
    }

    // if (result.assets[0].uri) {
    //   addMedia({
    //     name: `${result.assets[0].uri.split("/").pop()}`,
    //     type: "image/jpeg",
    //     uri: result.assets[0].uri,
    //   });
      
    //   setImageSize(size);
    // }
    if (result.assets[0].uri) {
      addMedia({
        name: `${result.assets[0].uri.split("/").pop()}`,
        type: "image/jpeg",
        uri: result.assets[0].uri,
      })
        .unwrap() // Extract the raw response
        .then((response) => {
          console.log("Response:", response); 
          setForResponse(response)
          setImageSize(size); // Set image size after successful response
        })
        .catch((error) => {
          console.error("Error:", error); // Log any errors
        });
    }
    
  }

  function handleChange(html?: string) {
    if (isLive)
      liveBookSocket?.emit("page_updated", {
        bookId: page?.bookId,
        authorId: userId,
        data: html ?? pageText,
      });
  }

  function gotoDiscussion() {
    if (!page) return;
    navigate("PageStack", {
      screen: "Discussion",
      params: {
        bookId: page?.bookId,
        pageId: page?._id,
        pageShortCode: page?.pageShortCode,
        totalComments: page?.commentsCount,
      },
    });
  }

  return {
    updatePage,
    insertPage,
    isLoading: pageLoading,
    page,
    pageText,
    setPageText,
    buttonLoading: insertLoading || isLoading,
    goLive,
    lastComment,
    gotoDiscussion,
    handleGoLive,
    handleOffline,
    showComments,
    setShowComments,
    fullNamesString,
    uniqueFullNamesCount,
    pageNumber,
    addImage,
    mediaLoading,
    richText,
    handleChange,
    forResponse,
    storedPagesLength2
  };
};

export default usePageEditor;
