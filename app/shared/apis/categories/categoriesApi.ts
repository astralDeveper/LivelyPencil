import apiSlice from "../apiSlice/apiSlice";

const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoriesWithAnalytics: builder.query({
      query: () => ({
        url: "/categories/getAllCategoriesWithAnalytics",
      }),
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: "/categories/getAllCategories",
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetCategoriesWithAnalyticsQuery, useGetAllCategoriesQuery } =
  categoriesApi;

export default categoriesApi;
