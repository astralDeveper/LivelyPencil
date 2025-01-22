import { View, FlatList, Text, Pressable } from "react-native";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import RenderHTML from "react-native-render-html";
import { decode } from "he";
import { useWindowDimensions } from "react-native";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import DivRenderer from "../../../../components/DivRenderer";
import CustomImage from "../../../../components/CustomImage";
import { useAppSelector } from "shared/hooks/useRedux";
import { useNavigation } from "@react-navigation/native";
import { ProfileStackNavigatorProps } from "shared/navigators/ProfileStackNavigator";
import { Image } from "expo-image";
import { imageUrl, parseStringByDiv } from "shared/util/htmlParsers";

const UserPages = ({}) => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const token = useAppSelector((state) => state.auth.token);

  const [pages, setPages] = useState([]);
  const [loading, setloading] = useState(false);
  const navigation = useNavigation<ProfileStackNavigatorProps>();
  const { width, height } = useWindowDimensions();

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
        navigation.navigate("PageStack", {
          screen: "Details",
          params: { pageId: item._id },
        });
      }}
      className="w-[46%] h-72  bg-gray-50 radius-lg m-2 relative"
    >
      {/* {item.isEnabled && (
        <RenderHTML
          // tagsStyles={{
          //   img: {
          //     overflow: "hidden",
          //     height: 288,
          //     width: width / 2,
          //     objectFit: "cover",
          //   },
          //   div: { width: width / 2, overflow: "hidden" },
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
      )} */}
      {imageUrl(item.history.items[0].rawHtmlContent) ? (
        <Image
          source={{ uri: imageUrl(item.history.items[0].rawHtmlContent) ?? "" }}
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: 12,
          }}
          contentFit="cover"
        />
      ) : (
        <View
          style={{
            padding: 12,
          }}
        >
          {item.history.items[0].rawHtmlContent &&
            parseStringByDiv(item.history.items[0].rawHtmlContent).map(
              (item, index) => (
                <Text key={index} style={{ marginBottom: 16 }}>
                  {item}
                </Text>
              )
            )}
        </View>
      )}
    </Pressable>
  );

  async function updatePages() {
    setloading(true);
    if (token) {
      await axios
        .get(
          `${process.env.EXPO_PUBLIC_API_URL}/pages/getAllPagesByAuthorId?page=1&limit=500&sortBy=createdAt:desc&authorId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setPages(response.data.data);
        })
        .catch((e) => console.log("user profile", e))
        .finally(() => setloading(false));
    }
  }

  // const handleListScroll = (event) => {
  //   const y = event.nativeEvent.contentOffset.y;
  //   const contentHeight = event.nativeEvent.contentSize.height;
  //   const layoutHeight = event.nativeEvent.layoutMeasurement.height;

  //   if (y <= 0) {
  //     setParentScroll(true);
  //   }

  //   // if (y + layoutHeight >= contentHeight) {
  //   //   console.log("Reached the bottom");
  //   //   // You can set any other state or call any other function here
  //   // }
  //   if (y >= 100) {
  //     setParentScroll(true);
  //   }
  // };

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
        pages?.results?.length == 0 && (
          <Text className="mx-auto text-gray-500 mt-20 font-Inter-bold">
            No pages created yet
          </Text>
        )
      }
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      data={pages?.results?.filter((page) => page.isEnabled)}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={{ marginHorizontal: 20, overflow: "hidden" }}
      // onScroll={handleListScroll}
      scrollEventThrottle={4}
    />
  );
};

export default UserPages;
