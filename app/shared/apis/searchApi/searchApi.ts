import { ISearchPayload } from "shared/types/search/searchParams.type";
import apiSlice from "../apiSlice/apiSlice";
import { RESULTS_LIMIT } from "shared/util/constants";


const searchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchUsers: builder.query({
      query: ({ input, page }: ISearchPayload) => ({
        url: `/users/getPopularUsers?page=${page}&limit=${RESULTS_LIMIT}&sortBy=createdAt:desc&fullName=${input}`,
      }),
    }),

    searchStreams: builder.query({
      query: ({ input, page, category, language }: ISearchPayload) => ({
        url: `/books/getAllBooks?title=${input}&page=${page}&limit=${RESULTS_LIMIT}&sortBy=createdAt:desc${
          typeof category === "string" && `&category=${category}`
        }&language=${language == "All Languages" ? "" : language}`,
      }),
    }), 

    searchPages: builder.query({
      query: ({ input, page, category, language }: ISearchPayload) => ({
        url: `/pages/getAllExistingPages?page=${page}&limit=10&sortBy=createdAt:desc&searchValue=${input}&language=${language}${
          typeof category === "string" ? `&category=${category}` : ``
        }`,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useSearchUsersQuery,
  useSearchPagesQuery,
  useSearchStreamsQuery,
  useLazySearchPagesQuery,
  useLazySearchStreamsQuery,
  useLazySearchUsersQuery,
} = searchApi;

export default searchApi;
