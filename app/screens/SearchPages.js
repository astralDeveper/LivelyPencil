// Search Screen -> Pages

// components
import {
  View,
  FlatList,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import store from "store";
import { useState } from "react";
import RenderHTML from "react-native-render-html";
import { decode } from "he";
// $&
import { useWindowDimensions } from "react-native";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import DivRenderer from "../components/DivRenderer";
import CustomImage from "../components/CustomImage";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "shared/hooks/useRedux";
import useSWR from "swr";

const SearchPages = ({ id, searchLoader }) => {
  if (!id == 0) {
    return null;
  }

  // const { currentUser, pageSearchFetchData } = store();
  const token = useAppSelector((state) => state.auth.token);
  const { pageSearchFetchData, userSearchInput } = useAppSelector(
    (state) => state.search
  );
  // const { userSearchInput } = store2();
  const [limit, setLimit] = useState(10);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  //Note: If it has img don't show text just show that image , or if it has only text then show only text
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

  const SpanRenderer = (props) => {
    const { TDefaultRenderer } = props;

    return (
      <Text allowFontScaling={false}>
        <TDefaultRenderer {...props} />
      </Text>
    );
  };

  const renderItem = ({ item }) => (
    <Pressable
      // key={item.id}
      onPress={() =>
        navigation.navigate("PageSystem", {
          bookId: item.bookId,
          indexNumber: item.indexOfPage,
          fromPage: "Search",
        })
      }
      className=" w-1/2 h-72  bg-gray-50 border border-gray-300 
      relative"
    >
      {item?.isEnabled && (
        <RenderHTML
          // key={item?._id}
          // tagsStyles={{
          //   h1: {
          //     color: "#262626",
          //     fontSize: 12,
          //     paddingVertical: 5,
          //     paddingHorizontal: 10,
          //     fontWeight: "normal",
          //   },
          //   img: {
          //     overflow: "hidden",
          //     height: 288,
          //     width: width / 2,
          //     objectFit: "cover",
          //   },
          //   div: { width: width / 2, overflow: "hidden" },
          //   span: { marginLeft: 10, marginRight: 10, fontSize: 16 },
          // }}
          contentWidth={width / 2}
          source={{
            html: imgOnly(decode(item?.history?.items[0]?.rawHtmlContent)),
          }}
          renderers={{
            img: (htmlAttribs) => {
              const src = htmlAttribs.tnode.init.domNode.attribs;
              return <CustomImage htmlAttribs={src} forPages={true} />;
            },
            div: DivRenderer,
            span: SpanRenderer,
          }}
        />
      )}
    </Pressable>
  );

  async function updatePages(limit) {
    const res = await axios
      .get(
        `${API_URL}/pages/getAllExistingPages?page=1&limit=${limit}&sortBy=createdAt:desc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((e) => console.log(e));
    return res.data;
  }
  const { data, isValidating, isLoading } = useSWR("/searchPages", () =>
    updatePages(limit)
  );

  if (searchLoader) {
    return (
      <ActivityIndicator color="#6687c4" style={{ marginTop: 10 }} size={50} />
    );
  }
  return (
    // <View className="flex-1 bg-white">
    <FlatList
      showsVerticalScrollIndicator={false}
      // data={data?.results?.filter((page) => page.isEnabled)}
      data={
        userSearchInput == ""
          ? data?.results?.filter((page) => page.isEnabled)
          : pageSearchFetchData?.results?.filter((page) => page.isEnabled)
      }
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={{
        marginVertical: 0,
        marginHorizontal: 0,
      }}
      onEndReached={() => {
        setLimit((prev) => prev + 10);
        mutate("/searchPages");
      }}
      ListEmptyComponent={
        pageSearchFetchData?.results?.filter((page) => page.isEnabled).length ==
          0 && (
          <View className=" h-screen  items-center">
            <Text className="text-gray-400 ">No pages found</Text>
          </View>
        )
      }
      refreshing={isLoading}
      onRefresh={() => mutate("/searchPages")}
      ListFooterComponent={
        //Note: userSearchInput and totalResults more than 4 then is perform isValidating condition. It was to fix the loading appears beneath 1 page.
        (userSearchInput == "" && data?.totalResults > 4) & isValidating && (
          <View className="h-5 items-center  z-50 bg-white">
            <LottieView
              resizeMode="cover"
              source={Load}
              autoPlay
              loop
              style={{
                height: 30,
                justifyContent: "center",
              }}
            />
          </View>
        )
      }
    />
    // </View>
  );
};

export default SearchPages;
