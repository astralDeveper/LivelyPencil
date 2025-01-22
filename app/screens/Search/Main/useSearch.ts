import { useNavigation } from "@react-navigation/native";
import UseDebounce from "app/components/UseDebounce";
import { DataItem } from "app/components/ui/AnimatedSectionSelector";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  useLazySearchPagesQuery,
  useLazySearchStreamsQuery,
  useLazySearchUsersQuery,
} from "shared/apis/searchApi/searchApi";
import {
  usePaginatedPagesList,
  usePaginatedStreamList,
  usePaginatedUsersList,
} from "shared/hooks/usePaginatedList";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import { SearchStackNavigatorProps } from "shared/navigators/SearchStackNavigator";
import { PageList } from "shared/types/page/Page.type";
import { SelectedStream } from "shared/types/stream/streamList.type";
import { apiHandler } from "shared/util/handler";
import { formatPagesResponseToPagesList } from "shared/util/page";
import { setShowSelectPageModal } from "store/slices/stream/streamSlice";

let count = 0;
let pageIds: string[] = [];
let streamPages: string[] = [];

export enum SearchSections {
  pages = "PAGES",
  users = "USERS",
  streams = "STREAMS",
}

const sectionsList: DataItem[] = [
  {
    label: "Pages",
    value: SearchSections.pages,
  },
  {
    label: "Users",
    value: SearchSections.users,
  },
  {
    label: "Streams",
    value: SearchSections.streams,
  },
];

const useSearch = () => {
  const [activeSection, setActiveSection] = useState<DataItem>(sectionsList[0]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedStream, setSelectedStream] = useState<SelectedStream>({
    streamId: undefined,
    title: undefined,
    lastIndex: undefined,
    bookShortCode: undefined,
    coverImageUrl: undefined,
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSelectPageModalVisible, toggleSelectPageModal] = useState(false);
  const debouncedPageText = UseDebounce(searchInput, 1000);
  const selectedLanguage = useAppSelector(
    (state) => state.util.languageSelected
  );

  const { navigate } = useNavigation<SearchStackNavigatorProps>();

  const {
    onResultsReceived,
    pages,
    pageNumber,
    incrementPageNumber,
    resetPageNumber,
    resetResults,
  } = usePaginatedPagesList(count);

  const {
    onResultsReceived: onResultsReceivedStreams,
    streams,
    pageNumber: streamsPageNumber,
    incrementPageNumber: incrementStreamsPage,
    resetPageNumber: resetStreamPageNumber,
    resetResults: resetStreamResults,
  } = usePaginatedStreamList();

  const {
    onResultsReceived: onResultsRecievedUsers,
    users,
    pageNumber: usersPageNumber,
    incrementPageNumber: incrementUsersNumber,
    resetPageNumber: resetUsersPageNumber,
    resetResults: resetUsersResults,
  } = usePaginatedUsersList();
  const [searchPages, { data: pagesData, error: pagesError }] =
    useLazySearchPagesQuery();
  const [searchUsers, { data: usersData, error: usersError, isSuccess }] =
    useLazySearchUsersQuery();
  const [searchStreams, { data: streamsData, error: streamsError }] =
    useLazySearchStreamsQuery();

  function handleSearch() {
    // setIsLoading(true);
    // if (searchInput === "") return;
    searchPages({
      input: searchInput,
      page: pageNumber,
      category: selectedCategory,
      language: selectedLanguage,
    });
    searchUsers({
      input: searchInput,
      page: usersPageNumber,
      language: selectedLanguage,
    });
    searchStreams({
      input: searchInput,
      page: streamsPageNumber,
      category: selectedCategory,
      language: selectedLanguage,
    });
  }

  useEffect(() => {
    searchPages({
      input: "",
      category: selectedCategory,
      language: selectedLanguage,
      page: pageNumber,
    });
    searchUsers({
      input: "",
      page: usersPageNumber,
      language: selectedLanguage,
    });
    searchStreams({
      input: "",
      page: streamsPageNumber,
      language: selectedLanguage,
      category: selectedCategory,
    });
  }, []);

  useEffect(() => {
    apiHandler({
      data: pagesData,
      error: pagesError,
      onSuccess(response) {
        setIsLoading(false);
        count = onResultsReceived(response);
        response?.data?.results.map((item) => {
          if (item.isEnabled) pageIds.push(item._id);
        });
      },
      onError(response) {
        setIsLoading(false);
      },
    });
  }, [pagesData, pagesError]);

  useEffect(() => {
    apiHandler({
      data: usersData,
      error: usersError,
      onSuccess(response) {
        setIsLoading(false);
        onResultsRecievedUsers(response);
      },
      onError(response) {
        setIsLoading(false);
      },
    });
  }, [usersData, usersError]);


  useEffect(() => {
    apiHandler({
      data: streamsData,
      error: streamsError,
      onSuccess(response) {
        setIsLoading(false);
        onResultsReceivedStreams(response);

        // console.log("streamsData=======>",response)
      },
      onError(response) {
        setIsLoading(false);
      },
    });
  }, [streamsData, streamsError]);



    

  useEffect(() => {
    handleSearch();
    setIsLoading(true);
  }, [debouncedPageText]);

  useEffect(() => {
    handleSearch();
  }, [usersPageNumber, pageNumber, streamsPageNumber]);

  useEffect(() => {
    resetResultsAndNumber();
    handleSearch();
    setIsLoading(true);
  }, [selectedCategory]);

  useEffect(() => {
    // Synchronising the values
    resetResultsAndNumber();
    resetUsersPageNumber();
    resetUsersResults();
    setIsLoading(true);
  }, [searchInput]);

  function resetResultsAndNumber() {
    pageIds = [];
    resetPageNumber();
    resetStreamPageNumber();
    resetResults();
    resetStreamResults();
  }

  function handlePageSelectionNavigation(isLast: boolean) {
    // Page selected from stream
    navigate("PageStack", {
      screen: "Details",
      params: {
        pageIds: streamPages,
        initialIndex: isLast ? selectedStream.lastIndex : 0,
      },
    });
  }

  function onPressUserNavigate(id: string) {
    navigate("PageStack", { screen: "OtherProfile", params: { id } });
  }

  function onPressPageNavigate(pageId: string) {
    if (pageIds.length === 0)
      return Alert.alert("Error", "This page cannot be viewed");
    const initialIndex = pageIds.findIndex((id) => id === pageId);
    navigate("PageStack", {
      screen: "Details",
      params: { pageIds, initialIndex },
    });
  }

  function onPressStreamNavigate(streamId: string) {
    const streamIndex = streams.findIndex((item) => item._id === streamId);
    if (streamIndex >= 0) {
      streamPages = [];
      streams[streamIndex].listOfPageIds.map((item) => {
        if (item.isEnabled) streamPages.push(item.pageId);
      });

      if (streamPages.length === 0)
        return Alert.alert("Error", "No pages to view in this stream");
      setSelectedStream({
        title: streams[streamIndex].title,
        lastIndex: streamPages.length - 1,
        bookShortCode: streams[streamIndex].bookShortCode,
        coverImageUrl: streams[streamIndex].coverImageUrl,
        streamId,
      });
      if (streamPages.length > 1) toggleSelectPageModal(true);
      else handlePageSelectionNavigation(false);
    } else return Alert.alert("Error", "No pages to view in this stream");
  }

  function closeSelectPageModal() {
    toggleSelectPageModal(false);
  }

  return {
    activeSection,
    setActiveSection,
    sectionsList,
    searchInput,
    setSearchInput,
    handleSearch,
    onPressUserNavigate,
    onPressPageNavigate,
    searchedUsers: users,
    searchedPages: pages,
    searchedStreams: streams,
    isLoading,
    onPagesEndReached: incrementPageNumber,
    onStreamsEndReached: incrementStreamsPage,
    onUsersEndReached: incrementUsersNumber,
    onPressStreamNavigate,
    handlePageSelectionNavigation,
    selectedStream,
    selectedCategory,
    setSelectedCategory,
    isSelectPageModalVisible,
    closeSelectPageModal,
  };
};

export default useSearch;





// import { useNavigation } from "@react-navigation/native";
// import UseDebounce from "app/components/UseDebounce";
// import { DataItem } from "app/components/ui/AnimatedSectionSelector";
// import { useEffect, useState } from "react";
// import { Alert } from "react-native";
// import {
//   useLazySearchPagesQuery,
//   useLazySearchStreamsQuery,
//   useLazySearchUsersQuery,
// } from "shared/apis/searchApi/searchApi";
// import {
//   usePaginatedPagesList,
//   usePaginatedStreamList,
//   usePaginatedUsersList,
// } from "shared/hooks/usePaginatedList";
// import { useAppSelector } from "shared/hooks/useRedux";
// import { SearchStackNavigatorProps } from "shared/navigators/SearchStackNavigator";
// import { SelectedStream } from "shared/types/stream/streamList.type";
// import { apiHandler } from "shared/util/handler";

// let count = 0;
// let pageIds: string[] = [];
// let streamPages: string[] = [];

// export enum SearchSections {
//   pages = "PAGES",
//   users = "USERS",
//   streams = "STREAMS",
// }

// const sectionsList: DataItem[] = [
//   {
//     label: "Pages",
//     value: SearchSections.pages,
//   },
//   {
//     label: "Users",
//     value: SearchSections.users,
//   },
//   {
//     label: "Streams",
//     value: SearchSections.streams,
//   },
// ];

// const useSearch = () => {
//   const [activeSection, setActiveSection] = useState<DataItem>(sectionsList[0]);
//   const [searchInput, setSearchInput] = useState("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [selectedStream, setSelectedStream] = useState<SelectedStream>({
//     streamId: undefined,
//     title: undefined,
//     lastIndex: undefined,
//     bookShortCode: undefined,
//     coverImageUrl: undefined,
//   });
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [isSelectPageModalVisible, toggleSelectPageModal] = useState(false);
//   const debouncedPageText = UseDebounce(searchInput, 1000);
//   const selectedLanguage = useAppSelector(
//     (state) => state.util.languageSelected
//   );
  
//   // To track whether the section has been clicked
//   const [hasClicked, setHasClicked] = useState(false);

//   const { navigate } = useNavigation<SearchStackNavigatorProps>();

//   const {
//     onResultsReceived,
//     pages,
//     pageNumber,
//     incrementPageNumber,
//     resetPageNumber,
//     resetResults,
//   } = usePaginatedPagesList(count);

//   const {
//     onResultsReceived: onResultsReceivedStreams,
//     streams,
//     pageNumber: streamsPageNumber,
//     incrementPageNumber: incrementStreamsPage,
//     resetPageNumber: resetStreamPageNumber,
//     resetResults: resetStreamResults,
//   } = usePaginatedStreamList();

//   const {
//     onResultsReceived: onResultsRecievedUsers,
//     users,
//     pageNumber: usersPageNumber,
//     incrementPageNumber: incrementUsersNumber,
//     resetPageNumber: resetUsersPageNumber,
//     resetResults: resetUsersResults,
//   } = usePaginatedUsersList();

//   const [searchPages, { data: pagesData, error: pagesError }] =
//     useLazySearchPagesQuery();
//   const [searchUsers, { data: usersData, error: usersError }] =
//     useLazySearchUsersQuery();
//   const [searchStreams, { data: streamsData, error: streamsError }] =
//     useLazySearchStreamsQuery();

//   function handleSearch() {
//     setIsLoading(true);

//     if (activeSection.value === SearchSections.pages) {
//       searchPages({
//         input: searchInput,
//         page: pageNumber,
//         category: selectedCategory,
//         language: selectedLanguage,
//       });
//     }

//     if (activeSection.value === SearchSections.users) {
//       searchUsers({
//         input: searchInput,
//         page: usersPageNumber,
//         language: selectedLanguage,
//       });
//     }

//     if (activeSection.value === SearchSections.streams) {
//       searchStreams({
//         input: searchInput,
//         page: streamsPageNumber,
//         category: selectedCategory,
//         language: selectedLanguage,
//       });
//     }
//   }

//   useEffect(() => {
//     // Trigger API only when section is clicked
//     if (hasClicked) {
//       handleSearch();
//     }
//   }, [activeSection, hasClicked]); // This effect will be triggered when `activeSection` or `hasClicked` changes

//   useEffect(() => {
//     apiHandler({
//       data: pagesData,
//       error: pagesError,
//       onSuccess(response) {
//         setIsLoading(false);
//         count = onResultsReceived(response);
//         response?.data?.results.forEach((item) => {
//           if (item.isEnabled) pageIds.push(item._id);
//         });
//       },
//       onError() {
//         setIsLoading(false);
//       },
//     });
//   }, [pagesData, pagesError]);

//   useEffect(() => {
//     apiHandler({
//       data: usersData,
//       error: usersError,
//       onSuccess(response) {
//         setIsLoading(false);
//         onResultsRecievedUsers(response);
//       },
//       onError() {
//         setIsLoading(false);
//       },
//     });
//   }, [usersData, usersError]);

//   useEffect(() => {
//     apiHandler({
//       data: streamsData,
//       error: streamsError,
//       onSuccess(response) {
//         setIsLoading(false);
//         onResultsReceivedStreams(response);
//       },
//       onError() {
//         setIsLoading(false);
//       },
//     });
//   }, [streamsData, streamsError]);

//   useEffect(() => {
//     if (debouncedPageText) {
//       handleSearch();
//     }
//   }, [debouncedPageText]);

//   useEffect(() => {
//     handleSearch();
//   }, [usersPageNumber, pageNumber, streamsPageNumber]);

//   function resetResultsAndNumber() {
//     pageIds = [];
//     resetPageNumber();
//     resetStreamPageNumber();
//     resetResults();
//     resetStreamResults();
//   }

//   function handlePageSelectionNavigation(isLast: boolean) {
//     navigate("PageStack", {
//       screen: "Details",
//       params: {
//         pageIds: streamPages,
//         initialIndex: isLast ? selectedStream.lastIndex : 0,
//       },
//     });
//   }

//   function onPressUserNavigate(id: string) {
//     navigate("PageStack", { screen: "OtherProfile", params: { id } });
//   }

//   function onPressPageNavigate(pageId: string) {
//     if (pageIds.length === 0)
//       return Alert.alert("Error", "This page cannot be viewed");
//     const initialIndex = pageIds.findIndex((id) => id === pageId);
//     navigate("PageStack", {
//       screen: "Details",
//       params: { pageIds, initialIndex },
//     });
//   }

//   function onPressStreamNavigate(streamId: string) {
//     const streamIndex = streams.findIndex((item) => item._id === streamId);
//     if (streamIndex >= 0) {
//       streamPages = [];
//       streams[streamIndex].listOfPageIds.forEach((item) => {
//         if (item.isEnabled) streamPages.push(item.pageId);
//       });

//       if (streamPages.length === 0)
//         return Alert.alert("Error", "No pages to view in this stream");
//       setSelectedStream({
//         title: streams[streamIndex].title,
//         lastIndex: streamPages.length - 1,
//         bookShortCode: streams[streamIndex].bookShortCode,
//         coverImageUrl: streams[streamIndex].coverImageUrl,
//         streamId,
//       });
//       if (streamPages.length > 1) toggleSelectPageModal(true);
//       else handlePageSelectionNavigation(false);
//     } else return Alert.alert("Error", "No pages to view in this stream");
//   }

//   function closeSelectPageModal() {
//     toggleSelectPageModal(false);
//   }

//   return {
//     activeSection,
//     setActiveSection,
//     sectionsList,
//     searchInput,
//     setSearchInput,
//     handleSearch,
//     onPressUserNavigate,
//     onPressPageNavigate,
//     searchedUsers: users,
//     searchedPages: pages,
//     searchedStreams: streams,
//     isLoading,
//     onPagesEndReached: incrementPageNumber,
//     onStreamsEndReached: incrementStreamsPage,
//     onUsersEndReached: incrementUsersNumber,
//     onPressStreamNavigate,
//     handlePageSelectionNavigation,
//     selectedStream,
//     selectedCategory,
//     setSelectedCategory,
//     isSelectPageModalVisible,
//     closeSelectPageModal,
//     setHasClicked,  // Add this to allow user interaction with the section
//   };
// };

// export default useSearch;




// import { useNavigation } from "@react-navigation/native";
// import UseDebounce from "app/components/UseDebounce";
// import { DataItem } from "app/components/ui/AnimatedSectionSelector";
// import { useEffect, useState } from "react";
// import { Alert } from "react-native";
// import {
//   useSearchPagesQuery,
//   useSearchStreamsQuery,
//   useSearchUsersQuery,
// } from "shared/apis/searchApi/searchApi";
// import {
//   usePaginatedPagesList,
//   usePaginatedStreamList,
//   usePaginatedUsersList,
// } from "shared/hooks/usePaginatedList";
// import { useAppSelector } from "shared/hooks/useRedux";
// import { SearchStackNavigatorProps } from "shared/navigators/SearchStackNavigator";
// import { apiHandler } from "shared/util/handler";

// let pageIds = [];
// let streamPages = [];

// export enum SearchSections {
//   pages = "PAGES",
//   users = "USERS",
//   streams = "STREAMS",
// }

// const sectionsList: DataItem[] = [
//   { label: "Pages", value: SearchSections.pages },
//   { label: "Users", value: SearchSections.users },
//   { label: "Streams", value: SearchSections.streams },
// ];

// const useSearch = () => {
//   const [activeSection, setActiveSection] = useState<DataItem>(sectionsList[0]);
//   const [searchInput, setSearchInput] = useState("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [selectedStream, setSelectedStream] = useState({
//     streamId: undefined,
//     title: undefined,
//     lastIndex: undefined,
//     bookShortCode: undefined,
//     coverImageUrl: undefined,
//   });
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [isSelectPageModalVisible, toggleSelectPageModal] = useState(false);
//   const debouncedPageText = UseDebounce(searchInput, 1000);
//   const selectedLanguage = useAppSelector(
//     (state) => state.util.languageSelected
//   );

//   const { navigate } = useNavigation<SearchStackNavigatorProps>();

//   const {
//     onResultsReceived,
//     pages,
//     pageNumber,
//     incrementPageNumber,
//     resetPageNumber,
//     resetResults,
//   } = usePaginatedPagesList();

//   const {
//     onResultsReceived: onResultsReceivedStreams,
//     streams,
//     pageNumber: streamsPageNumber,
//     incrementPageNumber: incrementStreamsPage,
//     resetPageNumber: resetStreamPageNumber,
//     resetResults: resetStreamResults,
//   } = usePaginatedStreamList();

//   const {
//     onResultsReceived: onResultsRecievedUsers,
//     users,
//     pageNumber: usersPageNumber,
//     incrementPageNumber: incrementUsersNumber,
//     resetPageNumber: resetUsersPageNumber,
//     resetResults: resetUsersResults,
//   } = usePaginatedUsersList();

//   const { data: pagesData, error: pagesError } = useSearchPagesQuery({
//     input: debouncedPageText,
//     page: pageNumber,
//     category: selectedCategory,
//     language: selectedLanguage,
//   });

//   const { data: usersData, error: usersError } = useSearchUsersQuery({
//     input: debouncedPageText,
//     page: usersPageNumber,
//     language: selectedLanguage,
//   });

//   const { data: streamsData, error: streamsError } = useSearchStreamsQuery({
//     input: debouncedPageText,
//     page: streamsPageNumber,
//     category: selectedCategory,
//     language: selectedLanguage,
//   });

//   useEffect(() => {
//     apiHandler({
//       data: pagesData,
//       error: pagesError,
//       onSuccess(response) {
//         setIsLoading(false);
//         onResultsReceived(response);
//         response?.data?.results.map((item) => {
//           if (item.isEnabled) pageIds.push(item._id);
//         });
//       },
//       onError() {
//         setIsLoading(false);
//       },
//     });
//   }, [pagesData, pagesError]);

//   useEffect(() => {
//     apiHandler({
//       data: usersData,
//       error: usersError,
//       onSuccess(response) {
//         setIsLoading(false);
//         onResultsRecievedUsers(response);
//       },
//       onError() {
//         setIsLoading(false);
//       },
//     });
//   }, [usersData, usersError]);

//   useEffect(() => {
//     apiHandler({
//       data: streamsData,
//       error: streamsError,
//       onSuccess(response) {
//         setIsLoading(false);
//         onResultsReceivedStreams(response);
//       },
//       onError() {
//         setIsLoading(false);
//       },
//     });
//   }, [streamsData, streamsError]);

//   useEffect(() => {
//     setIsLoading(true);
//   }, [debouncedPageText]);

//   function resetResultsAndNumber() {
//     pageIds = [];
//     resetPageNumber();
//     resetStreamPageNumber();
//     resetResults();
//     resetStreamResults();
//   }

//   function handlePageSelectionNavigation(isLast: boolean) {
//     navigate("PageStack", {
//       screen: "Details",
//       params: {
//         pageIds: streamPages,
//         initialIndex: isLast ? selectedStream.lastIndex : 0,
//       },
//     });
//   }

//   function onPressUserNavigate(id: string) {
//     navigate("PageStack", { screen: "OtherProfile", params: { id } });
//   }

//   function onPressPageNavigate(pageId: string) {
//     if (pageIds.length === 0)
//       return Alert.alert("Error", "This page cannot be viewed");
//     const initialIndex = pageIds.findIndex((id) => id === pageId);
//     navigate("PageStack", {
//       screen: "Details",
//       params: { pageIds, initialIndex },
//     });
//   }

//   function onPressStreamNavigate(streamId: string) {
//     const streamIndex = streams.findIndex((item) => item._id === streamId);
//     if (streamIndex >= 0) {
//       streamPages = [];
//       streams[streamIndex].listOfPageIds.map((item) => {
//         if (item.isEnabled) streamPages.push(item.pageId);
//       });

//       if (streamPages.length === 0)
//         return Alert.alert("Error", "No pages to view in this stream");
//       setSelectedStream({
//         title: streams[streamIndex].title,
//         lastIndex: streamPages.length - 1,
//         bookShortCode: streams[streamIndex].bookShortCode,
//         coverImageUrl: streams[streamIndex].coverImageUrl,
//         streamId,
//       });
//       if (streamPages.length > 1) toggleSelectPageModal(true);
//       else handlePageSelectionNavigation(false);
//     } else return Alert.alert("Error", "No pages to view in this stream");
//   }

//   function closeSelectPageModal() {
//     toggleSelectPageModal(false);
//   }

//   return {
//     activeSection,
//     setActiveSection,
//     sectionsList,
//     searchInput,
//     setSearchInput,
//     onPressUserNavigate,
//     onPressPageNavigate,
//     searchedUsers: users,
//     searchedPages: pages,
//     searchedStreams: streams,
//     isLoading,
//     onPagesEndReached: incrementPageNumber,
//     onStreamsEndReached: incrementStreamsPage,
//     onUsersEndReached: incrementUsersNumber,
//     onPressStreamNavigate,
//     handlePageSelectionNavigation,
//     selectedStream,
//     selectedCategory,
//     setSelectedCategory,
//     isSelectPageModalVisible,
//     closeSelectPageModal,
//   };
// };

// export default useSearch;
