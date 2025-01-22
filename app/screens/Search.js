import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Books from "./Books";
import Users from "./Users";
import SearchPages from "./SearchPages";
import store from "store";
import axios from "axios";
import { API_URL } from "@env";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import { store2 } from "store";
import UseDebounce from "../components/UseDebounce";

export default function Search() {
  // const [index, setIndex] = useState(0);
  const { index, setIndex } = store();
  const [searchLoader, setSearchLoader] = useState(false);
  const { setUserSearchInput, userSearchInput } = store2();
  const renderScene = SceneMap({
    pages: () => <SearchPages id={index} searchLoader={searchLoader} />,
    //Note: If we provide Component of User then there will be rendering issues. e.g follow button will re-render whole component
    // pages: SearchPages,
    users: Users,
    // books: Books,
    books: () => <Books id={index} />,
  });
  const debouncedPageText = UseDebounce(userSearchInput, 1000);

  const [routes] = useState([
    { key: "pages", title: "Pages" },
    { key: "users", title: "Users" },
    { key: "books", title: "Streams" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      android_ripple={{ color: "white", borderless: true }}
      indicatorStyle={{ backgroundColor: "#6687C4" }} // Change the indicator color
      style={{ backgroundColor: "white" }} // Change the TabBar color
      labelStyle={{
        color: "black",
        fontWeight: "bold",
      }} // Change Tab label color and font weight
      renderLabel={(
        { route, focused, color } // Custom label rendering
      ) => (
        <Text
          className="text-xs font-Inter-bold"
          style={{
            color: focused ? "#6687C4" : "black",
            fontSize: 15,
          }}
        >
          {route.title}
        </Text>
      )}
    />
  );
  const {
    setUserSearchFetchData,
    currentUser,
    setPageSearchFetchData,
    setBookSearchFetchData,
  } = store();

  async function search() {
    await axios
      .get(
        `${API_URL}/users/getPopularUsers?limit=5&fullName=${userSearchInput}&sortBy=createdAt:desc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },
        }
      )
      .then((res) => setUserSearchFetchData(res.data))
      .catch((e) => console.log(e.message));

    try {
      setSearchLoader(true);
      await axios
        .get(
          `${API_URL}/books/getAllBooks?title=${userSearchInput}&page=1&limit=3&sortBy=createdAt:desc`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser.tokens.access.token}`,
            },
          }
        )
        .then((res) => setBookSearchFetchData(res.data))
        .catch((e) => console.log(e.message));
    } catch (error) {
      console.log(error.message);
    } finally {
      setSearchLoader(false);
    }

    await axios
      .get(
        `${API_URL}/pages/getAllExistingPages?page=1&limit=2&searchValue=${userSearchInput}&sortBy=createdAt:desc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },
        }
      )
      .then((res) => setPageSearchFetchData(res.data))
      .catch((e) => console.log(e.message));

    //play drop sound
  }
  // useEffect(() => {
  //   //NOTE: TO CLEAR SEARCH INPUT IF PAGE CHANGED & clear searched page/book/user when user move from page
  //   setUserSearchInput("");
  //   setPageSearchFetchData([]);
  //   setUserSearchFetchData([]);
  //   setBookSearchFetchData([]);
  // }, [index]);
  useEffect(() => {
    if (debouncedPageText && userSearchInput != "") {
      search();
    }
  }, [debouncedPageText]);
  console.log("🍎Search Screen 🍎");

  const handleUserSearch = (val) => {
    setUserSearchInput(val);
  };

  return (
    //Search Bar Row
    <SafeAreaView
      style={{
        backgroundColor: "white",
        flex: 1,
        // marginTop: StatusBar.currentHeight || 0,
      }}
    >
      <View className="flex-row mx-2">
        <View className="flex-1 flex-row items-center border border-gray-300 space-x-2 pl-2  rounded-lg  ">
          <Ionicons name="search" size={20} color="gray" />

          <TextInput
            value={userSearchInput}
            onChangeText={(e) => handleUserSearch(e)}
            placeholder="Search Keyword"
            className=" font-Inter-Black flex-1 "
            onSubmitEditing={search}
          />
          <Pressable
            onPress={() => handleUserSearch("")}
            className="rotate-180 mr-2 px-4  py-2 "
          >
            <Entypo name="circle-with-cross" size={28} color="lightgray" />
          </Pressable>
        </View>
      </View>
      {/* Breadcrumb section */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
}
