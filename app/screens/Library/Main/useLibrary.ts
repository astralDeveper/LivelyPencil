import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetCategoriesWithAnalyticsQuery } from "shared/apis/categories/categoriesApi";
import { useAppSelector } from "shared/hooks/useRedux";
import { LanguageList } from "shared/util/constants";
import { apiHandler } from "shared/util/handler";

const useLibrary = () => {
  const { data, error, isLoading } =
    useGetCategoriesWithAnalyticsQuery(undefined);
  const [categoriesData, setCategoriesData] = useState([]);
 const selectedLanguage = useAppSelector(
    (state) => state.util.languageSelected
  );

// console.log("data",selectedLanguage)





  useEffect(() => {
    apiHandler({
      data,
      error,
      onSuccess(res) {
        let newData = [...res];
        newData?.sort((a, b) => b.numberOfBooks - a.numberOfBooks);
        setCategoriesData(newData);
      },
    });
  }, [data, error])
 

  return {
    isLoading,
    data: categoriesData,
  };
};

export default useLibrary;
