import { useNavigation } from "@react-navigation/native";
import UseDebounce from "app/components/UseDebounce";
import { useEffect, useState } from "react";
import { useGetCategoriesWithAnalyticsQuery } from "shared/apis/categories/categoriesApi";
import { OnBoardingStackNavigatorProps } from "shared/navigators/OnBoardingStackNavigator";
import { ICategoriesWithAnalyticsResponse } from "shared/types/categories/categoriesResponse.type";
import { apiHandler } from "shared/util/handler";

let subscribedCategories: string[] = [];

const useSelectCategory = () => {
  const { data, error, isLoading } =
    useGetCategoriesWithAnalyticsQuery(undefined);
  const [searchInput, setSearchInput] = useState<string>("");
  const [categories, setCategories] =
    useState<ICategoriesWithAnalyticsResponse[]>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { navigate } = useNavigation<OnBoardingStackNavigatorProps>();
  const debouncedPageText = UseDebounce(searchInput, 100);

  useEffect(() => {
    apiHandler({
      data,
      error,
      onSuccess(response) {
        setCategories(response);
      },
    });
  }, [data, error]);

  useEffect(() => {
    if (searchInput === "") setCategories(data);
    else {
      setCategories(
        data.filter((item: ICategoriesWithAnalyticsResponse) =>
          item.categoryName.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
  }, [debouncedPageText]);

  function handleSubscribe(id: string) {
    if (subscribedCategories.includes(id))
      subscribedCategories = subscribedCategories.filter((item) => item !== id);
    else subscribedCategories.push(id);
    setSelectedCategories([...subscribedCategories]);
  }

  function handleNext() {
    navigate("FollowUsers", { selectedCategories });
  }

  return {
    isLoading,
    categories,
    searchInput,
    setSearchInput,
    handleSubscribe,
    handleNext,
    selectedCategories,
  };
};

export default useSelectCategory;
