import { MasonryFlashList, MasonryFlashListProps } from "@shopify/flash-list";
import {
  FlatListProps,
  Platform,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Text } from "../ui";
import { Image } from "expo-image";
import { parseStringByDiv } from "shared/util/htmlParsers";
import { Tabs } from "react-native-collapsible-tab-view";
import { PageList } from "shared/types/page/Page.type";

interface PageListProps
  extends Omit<
    MasonryFlashListProps<PageList>,
    "renderItem" | "estimatedItemSize" | "onViewableItemsChanged" | "data"
  > {
  navigateToPageDetails: (pageId: string) => void;
  
  isTab?: boolean;
  data: PageList[];
}


export default function PagesList(props: PageListProps): JSX.Element {
  const { width } = useWindowDimensions();
  const { isTab = false } = props;
 

  const renderItem = ({ item }: { item: PageList }) => {
    return (
      <TouchableOpacity
        onPress={() => props.navigateToPageDetails(item.id)}
        className={`rounded-md relative`}
        style={{
          overflow: "hidden",
          width: isTab ? "47%" : "auto",
          maxHeight: isTab
            ? width * 0.7
            : item.index % 4 === 1
            ? width * 0.7 // first item from the top
            : item.index % 4 === 2
            ? width * 0.55 // second item from the top
            : item.index % 4 === 3
            ? width * 0.55
            : width * 0.69,
          backgroundColor: "#F8F8F8",
          marginTop: 8,
          marginHorizontal: 4,
        }}
      >
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              padding: 12,
            }}
          >
            {item.html &&
              parseStringByDiv(item.html).map((item, index) => (
                <Text key={index} style={{ marginBottom: 16 }}>
                  {item}
                </Text>
              ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      {isTab ? (
        <Tabs.FlatList
          {...props}
          numColumns={2}
          data={props.data}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={props.ListEmptyComponent}
        />
      ) : (
        <MasonryFlashList
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={268}
          extraData={true}
          onEndReachedThreshold={0.5}
          {...props}
          data={props.data}
        />
      )}
    </>
  );
}
