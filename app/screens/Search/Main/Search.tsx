import { View, FlatList, TouchableOpacity } from "react-native";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Search as SearchIcon } from "assets/svg/BottomTab/Search";
import useSearch, { SearchSections } from "./useSearch";
import AnimatedSectionSelector from "app/components/ui/AnimatedSectionSelector";
import UsersList from "app/components/User/UsersList";
import PagesList from "app/components/Page/PagesList";
import StreamsList from "app/components/Streams/StreamsList";
import { Loading } from "app/components";
import {
  IconTextInput,
  ListEmptyComponent,
  MySafeAreaContainer,
  Text,
} from "app/components/ui";
import SelectPageModal from "app/components/Streams/SelectPageModal";
import { CategoriesList } from "shared/util/constants";
import useStream from "screens/Stream/Main/useStream";
import useStreams from "screens/Library/Streams/useStreams";


type SelectCategoryListProps = {
  selectedCategory: string | null;
  setSelectedCategory: Dispatch<SetStateAction<string | null>>;
};

const SelectCategoryList = ({
  selectedCategory,
  setSelectedCategory,
}: SelectCategoryListProps): JSX.Element => {
  return (
    <View>
      <FlatList
        data={Object.keys(CategoriesList)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              marginHorizontal: 8,
            }}
            onPress={() => {
              if (item !== selectedCategory) setSelectedCategory(item);
              else setSelectedCategory(null);
            }}
          >
            <Text
              style={{
                color: "#336699",
                fontFamily:
                  item === selectedCategory ? "Inter-Bold" : "Inter-Medium",
              }}
            >
              #{item}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        horizontal
      />
    </View>
  );
};

export default function Search() {
  const {
    activeSection,
    setActiveSection,
    sectionsList,
    searchInput,
    setSearchInput,
    handleSearch,
    searchedUsers,
    onPressUserNavigate,
    searchedPages,
    onPressPageNavigate,
    searchedStreams,
    isLoading,
    onPagesEndReached,
    onStreamsEndReached,
    onUsersEndReached,
    onPressStreamNavigate,
    handlePageSelectionNavigation,
    selectedStream,
    selectedCategory,
    setSelectedCategory,
    closeSelectPageModal,
    isSelectPageModalVisible,
  } = useSearch();
 


  useEffect(() => {
    console.log("searchedStreams updated: ", searchedStreams);
  }, [searchedStreams]); 


  return (
    <MySafeAreaContainer>
      <View className="mx-4">
        {/* <View className="flex-1 flex-row items-center border border-gray-300 space-x-2 pl-2  rounded-lg  ">
          <SearchIcon />
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="Search Keyword"
            className=" font-Inter-Black flex-1 "
            onSubmitEditing={handleSearch}
            style={{ fontFamily: "Inter-Medium" }}
            autoCapitalize="none"
          />
          <Pressable
            onPress={() => setSearchInput("")}
            className="rotate-180 mr-2 px-4  py-2 "
          >
            <Entypo name="circle-with-cross" size={28} color="lightgray" />
          </Pressable>
        </View> */}
        <IconTextInput
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Search Keyword"
          onSubmitEditing={handleSearch}
          eraseText={() => setSearchInput("")}
          Icon={<SearchIcon />}
        />
      </View>
      <AnimatedSectionSelector
        data={sectionsList}
        activeItem={activeSection}
        setActiveItem={setActiveSection}
      />
      {activeSection.value === SearchSections.users ? null : (
        <SelectCategoryList
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      {isLoading ? (
        <Loading />
      ) : activeSection.value === SearchSections.users ? (
        <UsersList
          data={searchedUsers}
          onPressNavigate={onPressUserNavigate}
          onEndReached={() => {
            if (searchedUsers?.length > 8) onUsersEndReached();
          }}
          ListEmptyComponent={() => (
            <ListEmptyComponent text="No users found" />
          )}
        />
      ) : activeSection.value === SearchSections.pages ? (
        <View style={{ paddingHorizontal: 4, flex: 1, minWidth: 200 }}>
          <PagesList
            data={searchedPages}
            navigateToPageDetails={onPressPageNavigate}
            onEndReached={() => {
              if (searchedPages.length > 8) onPagesEndReached();
            }}
            ListEmptyComponent={() => (
              <ListEmptyComponent text="Pages Not Found" />
            )}
            // onScrollEndDrag={onPagesEndReached}
          />
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 4 }}>
          <StreamsList
            data={searchedStreams}
            navigateToPageDetails={onPressStreamNavigate}
            isTab={false}
            onEndReached={() => {
              if (searchedStreams.length > 8) onStreamsEndReached();
            }}
            ListEmptyComponent={() => (
              <ListEmptyComponent text="Stream Not Found" />
            )}
          />
        </View>
      )}
     
      <SelectPageModal
        onPressNavigate={handlePageSelectionNavigation}
        selectedStream={selectedStream}
        title={selectedStream.title}
        visible={isSelectPageModalVisible}
        closeModal={closeSelectPageModal}
      />
       {/* <LiveModal
        onPressNavigate={handlePageSelectionNavigation}
        selectedStream={selectedStream}
        title={selectedStream.title}
        visible={streamValu}
        closeModal={closeSelectPage}
         /> */}
    </MySafeAreaContainer>
  );
}
