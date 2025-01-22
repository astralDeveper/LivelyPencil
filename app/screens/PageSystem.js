import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import VerticalPager from "./VerticalPager";
// $&
import axios from "axios";
import { API_URL } from "@env";
import store from "store";
// $&

const PageSystem = () => {
  const params = useLocalSearchParams();
  const { currentUser } = store();
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [currentUserLikedPages, setCurrentUserLikedPages] = useState(null);

  // This api returns all likes either made on page/comment i will get all pages ids that are liked and pass it to verticalPager
  async function checkLikes() {
    const res = await axios
      .get(
        `${API_URL}/pages/getAllLikesOfUserByUserId/${currentUser.user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },
        }
      )
      .then((res) => {
        const likesList = res.data
          .filter((item) => item.documentType === "page")
          .map((page) => page.documentRef);

        setCurrentUserLikedPages(likesList);
      })
      .catch((e) => console.log(e));
  }

  async function getAllPages() {
    await axios
      .get(
        `${API_URL}/pages/getAllPages?page=1&bookId=${params.bookId}&limit=500`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },
        }
      )
      .then((resp) => setData(resp.data))
      .catch((e) => {
        Alert.alert(
          "Page Deleted",
          "This page has been Deleted",
          [{ text: "ok", onPress: () => navigation.goBack() }],
          { cancelable: false }
        );
      });
  }
  useEffect(() => {
    checkLikes();
    getAllPages();

    return () => {
      setData(null);
    };
  }, [params.bookId]); // User in Search book click page and then click avatar to visit other user profile he will see other user profile and stuff. but when he click page he will see same old page he was seeing before.

  return (
    <View className="flex-1 bg-white">
      <VerticalPager
        data={data}
        setData={setData}
        lastpage={params.lastpage}
        indexNumber={params.indexNumber}
        currentUserLikedPages={currentUserLikedPages}
        setCurrentUserLikedPages={setCurrentUserLikedPages}
      />
    </View>
  );
};

export default PageSystem;
