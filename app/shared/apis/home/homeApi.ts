import { RESULTS_LIMIT } from "shared/util/constants";
import apiSlice from "../apiSlice/apiSlice";

const homeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPagesOfFollowingUsers: builder.query({
      query: (page: number) => ({
        url: `/pages/getAllPagesOfFollowingUsers?page=${page}&limit=${RESULTS_LIMIT}&sortBy=createdAt:dsc&searchValue=`,
      }),
      providesTags: ["Pages"],
    }),

    getOtherProfile: builder.query({
      query: (id: string) => ({
        url: `/users/getUserById/${id}`,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetAllPagesOfFollowingUsersQuery, useGetOtherProfileQuery } =
  homeApi;

export default homeApi;
