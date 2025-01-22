import {
  Button,
  Heading,
  IconTextInput,
  MySafeAreaContainer,
  Text,
} from "app/components/ui";
import { Search as SearchIcon } from "assets/svg/BottomTab/Search";
import useSelectCategory from "./useSelectCategory";
import { FlatList, View, useWindowDimensions } from "react-native";
import React, { useCallback, useState } from "react";
import { Loading } from "app/components";
import { Image } from "expo-image";
import Separator from "app/components/ui/HorizontalSectionSeparator";
import { ICategoriesWithAnalyticsResponse } from "shared/types/categories/categoriesResponse.type";

interface CategoryItemProps
  extends Omit<ICategoriesWithAnalyticsResponse, "numberOfAuthors"> {
  handleSubscribe: (id: string) => void;
  isSelected: boolean;
}

function areCategoryItemPropsEqual(
  oldProps: CategoryItemProps,
  newProps: CategoryItemProps
): boolean {
  return oldProps.isSelected === newProps.isSelected;
}

const CategoryItem = React.memo(
  ({
    _id,
    categoryImage,
    categoryName,
    numberOfBooks,
    numberOfPages,
    handleSubscribe,
    isSelected,
  }: CategoryItemProps): JSX.Element => {
    const { width } = useWindowDimensions();

    function hanldeOnPress() {
      handleSubscribe(_id);
    }

    return (
      <View className="py-2 px-4 bg-textField mt-4">
        <View className="flex-row justify-between">
          <Image
            source={{ uri: categoryImage }}
            style={{
              width: width * 0.17,
              aspectRatio: 1,
              borderRadius: 100,
              maxWidth: 100,
            }}
          />
          <View className="flex-1 ml-4 justify-between">
            <Heading>
              {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
            </Heading>
            <View className="flex-row justify-between pr-6">
              <Text>
                Stream: <Heading className="text-sm">{numberOfBooks}</Heading>
              </Text>
              <Separator />
              <Text>
                Pages: <Heading className="text-sm">{numberOfPages}</Heading>
              </Text>
            </View>
          </View>
        </View>
        <Button
          label={isSelected ? "Unsubscribe" : "Subscribe"}
          outlined={!isSelected}
          className="py-2 mt-4"
          onPress={hanldeOnPress}
        />
      </View>
    );
  },
  areCategoryItemPropsEqual
);

const NextButton = ({
  subscribedCategories,
  handleNext,
}: {
  subscribedCategories: string[];
  handleNext: () => void;
}): JSX.Element => {
  return (
    <Button
      label="Next"
      onPress={handleNext}
      className={`${
        subscribedCategories.length === 0 && "bg-grey border-grey"
      }`}
      disabled={subscribedCategories.length === 0}
    />
  );
};

const SelectCategory = (): JSX.Element => {
  const {
    categories,
    isLoading,
    searchInput,
    setSearchInput,
    handleNext,
    handleSubscribe,
    selectedCategories,
  } = useSelectCategory();

  const renderItem = useCallback(
    ({ item }: { item: ICategoriesWithAnalyticsResponse }) => {
      return (
        <CategoryItem
          key={item._id}
          {...item}
          handleSubscribe={handleSubscribe}
          isSelected={selectedCategories.includes(item._id)}
        />
      );
    },
    [selectedCategories]
  );

  if (isLoading) return <Loading />;

  return (
    <MySafeAreaContainer style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
      <Heading>Subscribe Categories</Heading>
      <Text className="mb-4">Kindly choose at least one category</Text>
      <IconTextInput
        value={searchInput}
        onChangeText={setSearchInput}
        placeholder="Search keyword"
        Icon={<SearchIcon />}
      />
      {categories && categories.length > 0 && (
        <FlatList
          data={categories}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
          extraData={true}
        />
      )}
      <NextButton
        handleNext={handleNext}
        subscribedCategories={selectedCategories}
      />
    </MySafeAreaContainer>
  );
};

export default SelectCategory;
