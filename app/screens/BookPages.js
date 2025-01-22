import {
  View,
  Text,
  StatusBar,
  FlatList,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
// $&
// $&
import axios from "axios";
import { API_URL } from "@env";
import store from "store";
import { useEffect, useState, useContext } from "react";
import RenderHTML from "react-native-render-html";
import { decode } from "he";
import { Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SocketContext } from "./Socket/SocketProvider";
import clsx from "clsx";
import DivRenderer from "../components/DivRenderer";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import CustomImage from "../components/CustomImage";
// insert add button to data

// Params need id and title
export default function BookPages() {
  const { width, height } = useWindowDimensions();
  let params = useLocalSearchParams();
  const navigation = useNavigation();
  const { currentUser } = store();
  const [pages, setPages] = useState([]);
  const { liveBookSocket, setLiveBookRooms, liveBookRooms } =
    useContext(SocketContext);

  //Draft Page
  const [loading, setLoading] = useState(false);

  // Send Broadcast to Viewers and also update Current state of liveRooms
  function handleOffline() {
    liveBookSocket.emit("author_leave_live_book", {
      bookId: params.book._id,
    });
    const newList = liveBookRooms.filter((r) => r != params.book._id);
    setLiveBookRooms(newList);
  }
  // console.log("BOOK ID:", pages.bookId);
  //Create page and navigate to CreatePage Screen
  async function addPage() {
    setLoading(true);
    await axios
      .request(`${API_URL}/pages/insertpage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
        data: {
          bookId: `${pages.bookId}`, // got id from props from createPage
          items: [
            {
              type: "html",
              rawHtmlContent: ``,
            },
          ],
        },
      })

      .then(({ data }) =>
        navigation.navigate("CreatePage", {
          // bookData: pages,
          page: data.page,
          draftPageId: data.page._id,
        })
      )
      .finally(() => setLoading(false))
      .catch((e) => console.log(e.message));
  }
  //Note: If it has img don't show text just show that image , or if it has only text then show text
  function imgOnly(str) {
    const regex = /<img [^>]*>/g;
    const matches = str.match(regex);
    if (!matches) {
      return str;
    }
    const imgTag = matches[0];
    const imgTagWithoutStyle = imgTag.replace(/style="[^"]*"/, ""); // Remove style attribute
    return imgTagWithoutStyle;
  }

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        gotoBook(item.indexOfPage);
      }}
      className=" w-1/2 h-72  bg-gray-50 border border-gray-300 overflow-hidden  relative"
    >
      <Pressable
        onPress={() =>
          Alert.alert(
            "Confirm Delete",
            `Do you want to permanently delete Page # ${item.pageNumber} of book "${params.book.title}" ?`,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              { text: "Confirm", onPress: () => deletePage(item._id) },
            ]
          )
        }
        className=" absolute right-0 bottom-0 z-20 bg-slate-200 rounded-tl-full pl-5 pt-5 pr-2 pb-2"
      >
        {item.isEnabled && (
          <AntDesign name="delete" size={20} color="#6687c4" />
        )}
      </Pressable>
      <Text
        className="-rotate-90  w-12 
      pl-0.5 text-xs  font-Inter-bold  text-white  bg-gray-400  absolute z-10 top-0 right-0"
      >
        {item?.pageNumber}
      </Text>
      {item?.isEnabled && (
        <View>
          <RenderHTML
            tagsStyles={{
              // img: {
              //   overflow: "hidden",
              //   height: 288,
              //   width: width / 2,
              //   objectFit: "cover",
              // },
              div: { width: width / 2, overflow: "hidden" },
            }}
            contentWidth={width}
            source={{
              html: imgOnly(decode(item?.history?.items[0]?.rawHtmlContent)),
              // html: `
              // <p style='text-align:center;'>
              //   Hello World!
              // </p><img src="https://via.placeholder.com/150" />`,
            }}
            renderers={{
              img: (htmlAttribs) => {
                const src = htmlAttribs.tnode.init.domNode.attribs;
                return <CustomImage htmlAttribs={src} forPages={true} />;
              },
              div: DivRenderer,
            }}
          />
        </View>
      )}
    </Pressable>
  );

  async function gotoBook(indexOfPage) {
    await axios(`${API_URL}/books/getBookById/${pages.bookId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.tokens.access.token}`,
      },
    }).then((resp) =>
      navigation.navigate("PageSystem", {
        bookId: resp.data._id,
        indexNumber: indexOfPage,
      })
    );
  }

  async function update() {
    setLoading(true);
    const url = `${API_URL}/pages/getAllPages?limit=60&bookId=${params.book._id}&sortBy=createdAt:desc`;
    await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })
      .then((request) => {
        setPages(request.data);
      })
      .finally(() => setLoading(false))
      .catch((error) => console.log(error.message));
  }
  // Delete Page
  async function deletePage(id) {
    setLoading(true);
    await axios
      .delete(`${API_URL}/pages/deletePage/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })
      .then(() => update())
      .finally(() => setLoading(false))
      .catch(({ message }) => console.log(message));
  }
  async function permDelete(id) {
    setLoading(true);
    await axios
      .delete(`${API_URL}/pages/deleteDraftPagePermenantly/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })
      .then(() => update())
      .finally(() => setLoading(false))
      .catch(({ message }) => console.log(message));
  }
  //Delete Book
  async function deleteBook() {
    await axios
      .delete(`${API_URL}/books/deleteBook/${params.book._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })
      .then(() => navigation.goBack())
      .catch(({ message }) => console.log(message));
  }

  //Check Draft Pages if there is draft page either Continue/discard else addPage()
  async function checkDraftPages() {
    setLoading(true);
    await axios
      .get(
        `${API_URL}/pages/getAllPagesIncludingDraftByBookId?page=1&bookId=${pages.bookId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },
        }
      )
      .then((resp) => {
        if (resp.data.results.length > 0) {
          Alert.alert(
            "Draft Page",
            `You have 1 Draft Page. Do you want to Publish it?`,
            [
              {
                text: "Continue",
                onPress: () =>
                  navigation.navigate("CreatePage", {
                    page: resp.data,
                    draftPageId: resp?.data?.results[0]?._id,
                  }),
              },
              {
                text: "Discard",
                onPress: () => permDelete(resp.data.results[0]._id),
              },
            ],
            { cancelable: true }
          );
        } else {
          addPage();
        }
      })
      .catch((e) => {
        Alert.alert(
          "",
          "Something went wrong at Server side. Please try again"
        );
        console.log("LATEST SHIT", e);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const handleFocus = () => {
      setTimeout(() => {
        update();
      }, 1000);
    };
    const unsubscribe = navigation.addListener("focus", handleFocus);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    return () => handleOffline();
  }, []);

  return (
    <View
      className="flex-1 bg-white"
      // style={{ marginTop: StatusBar.currentHeight || 0 }}
    >
      <View className="flex-row justify-between mt-2 px-2 border-b border-gray-200  pb-3 ">
        <View className="flex-row items-center">
          <View className="mr-2">
            <Ionicons
              onPress={() => navigation.goBack()}
              name="chevron-back-sharp"
              size={24}
              color="gray"
            />
          </View>
          <MaterialCommunityIcons name="bookshelf" size={24} color="gray" />
          <Text className="font-Inter-medium text-lg text-[#3293fa]">
            {/* If book title is 17 chars then it add ... to it */}
            {!params.book.title.length > 30
              ? `${params.book.title.slice(0, 30)}...`
              : params.book.title}
          </Text>
        </View>
        <View className="flex-row items-center">
          <AntDesign
            onPress={() =>
              Alert.alert(
                " Confirm Delete",
                `Do you want to delete book "${params.book.title}" ?`,
                [
                  {
                    text: "Cancel",

                    style: "cancel",
                  },
                  { text: "Confirm", onPress: () => deleteBook() },
                ]
              )
            }
            name="delete"
            size={20}
            color="#3293fa"
          />
        </View>
      </View>

      {loading ? (
        <View className=" w-10 h-4 items-center m-auto">
          <LottieView resizeMode="cover" source={Load} autoPlay loop />
        </View>
      ) : (
        <FlatList
          data={pages?.results?.filter((page) => page.isEnabled)} //Dont show deleted page
          renderItem={renderItem}
          numColumns={2}
        />
      )}
      <Pressable
        disabled={loading}
        onPress={() => checkDraftPages()}
        className="flex-row py-2 justify-center bg-gray-200  bg-gray-20  items-center"
      >
        <Ionicons
          name="ios-add-circle-outline"
          size={32}
          color={loading ? "gray" : "#3293fa"}
        />
        <Text
          className={clsx("text-[#3293fa]  font-Inter-bold", {
            "text-gray-500": loading,
          })}
        >
          {loading ? "Loading" : "Add Page"}
        </Text>
      </Pressable>
    </View>
  );
}
