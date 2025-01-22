import UsersList from "app/components/User/UsersList";
import { Button, Heading, MySafeAreaContainer, Text } from "app/components/ui";
import { TouchableOpacity, View } from "react-native";
import { ChevronLeft } from "react-native-feather";
import useFollowUsers from "./useFollowUsers";
import { Loading } from "app/components";

const FollowUsers = (): JSX.Element => {
  const {
    incrementPageNumber,
    isLoading,
    users,
    handleNext,
    goBack,
    updateLoading,
  } = useFollowUsers();

  if (isLoading) return <Loading />;

  return (
    <MySafeAreaContainer style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          className="p-1 rounded-lg mr-2"
          style={{ backgroundColor: "#F7F8F8" }}
          onPress={goBack}
        >
          <ChevronLeft color="#4B4B4B" />
        </TouchableOpacity>
        <Heading>Popular Publishers</Heading>
      </View>
      <Text className="mb-4">
        Browse popular publishers based on the categories you follow.
      </Text>
      <UsersList
        data={users}
        onEndReached={incrementPageNumber}
        onPressNavigate={() => {}}
        contentContainerStyle={{ marginTop: 10 }}
      />
      <Button label="Next" onPress={handleNext} loading={updateLoading} />
    </MySafeAreaContainer>
  );
};

export default FollowUsers;
