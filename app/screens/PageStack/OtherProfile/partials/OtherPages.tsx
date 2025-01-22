import {
  View,
  FlatList,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import RenderHTML from "react-native-render-html";
import { decode } from "he";

import DivRenderer from "app/components/DivRenderer";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import CustomImage from "app/components/CustomImage";
import { useNavigation } from "@react-navigation/native";
import { HomeStackNavigatorProps } from "shared/navigators/HomeStackNavigator";
import { useAppSelector } from "shared/hooks/useRedux";

const OtherPages = ({ id }) => {
  const token = useAppSelector((state) => state.auth.token);
  const [pages, setPages] = useState([]);
  const navigation = useNavigation<HomeStackNavigatorProps>();
  const { width, height } = useWindowDimensions();
  const [loading, setloading] = useState(false);

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
      // onPress={() => console.log(decode(item.history.items[0].rawHtmlContent))}
      // style={{ width: width / 2, height: 288, overflow: "hidden" }}
      onPress={() =>
        navigation.navigate("Details", {
          bookId: item.bookId,
          ...item,
        })
      }
      className="w-1/2 h-72  bg-gray-50 border border-gray-300 
      relative"
    >
      {/* <View className="overflow-hidden"> */}
      {item.isEnabled && (
        <RenderHTML
          enableExperimentalBRCollapsing={true}
          // tagsStyles={{
          //   img: {
          //     overflow: "hidden",
          //     height: 288,
          //     width: width / 2,
          //     objectFit: "cover",
          //   },
          //   div: { height: 288, width: width / 2, overflow: "hidden" },
          // }}
          contentWidth={width}
          source={{
            // html: decode(item?.history?.items?.[0]?.rawHtmlContent),
            html: imgOnly(decode(item?.history?.items?.[0]?.rawHtmlContent)),
          }}
          renderers={{
            img: (htmlAttribs) => {
              const src = htmlAttribs.tnode.init.domNode.attribs;
              return <CustomImage htmlAttribs={src} forPages={true} />;
            },
            div: DivRenderer,
          }}
        />
      )}
      {/* </View> */}
    </Pressable>
  );

  async function updatePages() {
    setloading(true);
    await axios
      .get(
        `${process.env.EXPO_PUBLIC_API_URL}/pages/getAllPagesByAuthorId?page=1&limit=500&sortBy=createdAt:desc&authorId=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPages(response.data.data.results);
      })
      .catch((response) => console.log(response.message))
      .finally(() => setloading(false));
  }
  //EXP: If Otherpages loads incorrect pages then uncomment old code
  // useEffect(() => {
  //    updatePages()
  // }, [id]);

  useEffect(() => {
    const handleFocus = () => {
      updatePages();
    };
    const unsubscribe = navigation.addListener("focus", handleFocus);
    return unsubscribe;
  }, [navigation]);

  // Show loading while pages load
  if (loading) {
    return (
      <View className=" w-10 h-4 items-center m-auto">
        <LottieView resizeMode="cover" source={Load} autoPlay loop />
      </View>
    );
  }
  return (
    <FlatList
      ListEmptyComponent={
        pages?.length == 0 && (
          <Text className="mx-auto text-gray-500 mt-20 font-Inter-bold">
            No pages created yet
          </Text>
        )
      }
      scrollEnabled={false}
      data={pages.filter((page) => page.isEnabled)}
      renderItem={renderItem}
      numColumns={2}
      // horizontal={true}
      columnWrapperStyle={{
        marginVertical: 0.5,
      }}
    />
  );
};

export default OtherPages;
