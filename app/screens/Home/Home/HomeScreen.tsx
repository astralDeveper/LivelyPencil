import {
  RefreshControl,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import useHomeScreen from "./useHomeScreen";
import { Loading } from "app/components";
import { HandleRefresh, Text } from "app/components/ui";
import { LiveBroadCasters } from "app/components/LiveBroadCasters";
import PagesList from "app/components/Page/PagesList";

const HomeScreen = (): JSX.Element => {
  const {
    navigateToPageDetails,
    isLoading,
    onResultsEnd,
    pages,
    handleRefetch,
  } = useHomeScreen();
  const { width, height } = useWindowDimensions();

  if (isLoading) return <Loading />;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        overflow: "hidden",
        paddingHorizontal: 4,
      }}
    >
      <PagesList
        data={pages}
        onEndReached={onResultsEnd}
        extraData={true}
        ListHeaderComponent={() => <LiveBroadCasters />}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              width,
              height,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text className="font-Inter-bold text-xl">
              Nothing to show ...yet
            </Text>
            <Text className="mt-4 font-Inter-bold text-xl text-center px-6 mb-40">
              Please follow streams and users from category
            </Text>
          </View>
        )}
        navigateToPageDetails={navigateToPageDetails}
        refreshControl={<HandleRefresh refetch={handleRefetch} />}
      />
    </View>
  );
};

export default HomeScreen;
