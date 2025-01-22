/* 
APIs 
Get all pages including draft with pagination
Insert Page
Delete Page
Delete draft page

For stream id (which we may already have) (not to be implemented yet)
Get all pages of a stream with pagination (not to be implemented yet)
Delete stream (not to be implemented yet)
*/

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import PagesList from "app/components/Page/PagesList";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Alert } from "react-native";
import {
  SocketContext,
  SocketContextType,
} from "screens/Socket/SocketProvider";
import {
  useDeleteDraftPageMutation,
  useDeletePageMutation,
  useGetAllPagesIncludingDraftByStreamQuery,
  useGetAllPagesOfBookQuery,
  useInsertPageMutation,
} from "shared/apis/page/pageEditorApi";
import { usePaginatedPagesList } from "shared/hooks/usePaginatedList";
import {
  PagesRouteProp,
  StreamStackNavigatorProps,
} from "shared/navigators/StreamStackNavigator";
import { PageList } from "shared/types/page/Page.type";
import { apiHandler } from "shared/util/handler";

let count = 0;

const usePages = () => {
  const {
    params: { id: streamId, title },
  } = useRoute<PagesRouteProp>();
  const { setOptions, navigate } = useNavigation<StreamStackNavigatorProps>();
  const { liveBookSocket, setLiveBookRooms, liveBookRooms } = useContext(
    SocketContext
  ) as SocketContextType;

  const { pages, pageNumber, incrementPageNumber, onResultsReceived } =
    usePaginatedPagesList(count);
  const { data: draftData } = useGetAllPagesIncludingDraftByStreamQuery({
    id: streamId,
    page: 1,
  });
  const { data, error, isLoading, refetch } = useGetAllPagesOfBookQuery({
    id: streamId,
    page: pageNumber,
  });

  const [
    insertPage,
    { data: insertData, error: insertError, isLoading: insertLoading },
  ] = useInsertPageMutation();

  const [
    deletePage,
    { data: deleteData, error: deleteError, isLoading: deleteLoading },
  ] = useDeletePageMutation();
  const [
    deleteDraftPage,
    {
      data: deleteDraftData,
      error: deleteDraftError,
      isLoading: deleteDraftLoading,
    },
  ] = useDeleteDraftPageMutation();

  useEffect(() => {
    apiHandler({
      data,
      error,
      onSuccess(response) {
        count = onResultsReceived(response, response.data.totalPages === 1);
      },
    });
  }, [data, error]);

  useEffect(() => {
    apiHandler({
      data: insertData,
      error: insertError,
      showSuccess: true,
      onSuccess(response) {
        navigate("PageEditor", {
          pageId: response.data.page._id,
          pageNumber: response.data.newPageNumber,
        });
      },
    });
  }, [insertData, insertError]);

  useEffect(() => {
    apiHandler({
      data: deleteData,
      error: deleteError,
      showSuccess: true,
    });
  }, [deleteData, deleteError]);


  useEffect(() => {
    const saveToAsyncStorage = async (value) => {
      try {
        await AsyncStorage.setItem('pagesLength', value.toString());
        // console.log('Saved to AsyncStorage:', value);
      } catch (error) {
        console.error('Error saving to AsyncStorage:', error);
      }
    };
  
    const interval = setInterval(() => {
      if (pages?.length !== undefined) {
        saveToAsyncStorage(pages.length); 
      }
    }, 200); // 200ms interval
    
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [pages?.length]);
  useEffect(() => {
    apiHandler({
      data: deleteDraftData,
      error: deleteDraftError,
      showSuccess: true,
    });
  }, [deleteDraftData, deleteDraftError]);

  useLayoutEffect(() => {
    setOptions({ headerTitle: title });
  }, []);

  useEffect(() => {
    return () => handleOffline();
  }, []);

  function handleOffline() {
    liveBookSocket.emit("author_leave_live_book", {
      bookId: streamId,
    });
    const newList = liveBookRooms.filter((r) => r != streamId);
    setLiveBookRooms(newList);
  }

  function handleDeleteDrafftPage(id: string) {
    deleteDraftPage(id);
    insertPage({
      bookId: streamId,
      items: [{ type: "html", rawHtmlContent: "" }],
    });
  }

  function addPage() {
    const draftPages = draftData.data.results.length;
    if (draftPages > 0) {
      Alert.alert(
        "Draft Page",
        `You have ${draftPages} Draft Page. Do you want to Publish one?`,
        [
          {
            text: "Continue",
            onPress: () => 
              navigate("PageEditor", {
                pageId: draftData.data.results[0]?._id,
                pageNumber: pageNumber.toString(),
              }),
          },
          {
            text: "Discard",
            onPress: () =>
              handleDeleteDrafftPage(draftData.data.results[0]?._id),
          },
        ],
        { cancelable: true }
      );
    } else {
      insertPage({
        bookId: streamId,
        items: [{ type: "html", rawHtmlContent: "" }],
      });
    }
  }



  function navigateToEditPage(pageId: string) {
   
    navigate("PageEditor", { pageId });
  }

  async function handleRefetch() {
    await refetch();
  }
  // console.log(pages?.length)
  // console.log(pages)
  return {
    streamId,
    isLoading: isLoading || deleteLoading,
    pages,
    deletePage,
    incrementPageNumber,
    title,
    addPage,
    navigateToEditPage,
    buttonLoading: insertLoading || deleteDraftLoading,
    handleRefetch,
  };
};

export default usePages;
