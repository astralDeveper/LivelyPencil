import { IGetPageById } from "shared/types/page/PageResponse.type";
import apiSlice from "../apiSlice/apiSlice";
import { RESULTS_LIMIT } from "shared/util/constants";

const pageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPageById: builder.query({
      query: (id: string) => ({
        url: `/pages/getPageById/${id}`,
      }),
      keepUnusedDataFor: 0.1,
    }),

    getPagesByAuthor: builder.query({
      query: ({ id, page }: { id: string; page: number }) => ({
        url: `/pages/getAllPagesByAuthorId?page=${page}&limit=${RESULTS_LIMIT}&sortBy=createdAt:desc&authorId=${id}`,
      }),
    }),

    getAllComments: builder.query({
      query: (id: string) => ({
        url: `/pages/getAllCommentsByPageId/${id}?sortBy=createdAt:desc&limit=5`,
      }),
    }),

    pageAction: builder.mutation({
      query: ({ id, action }: { id: string; action: "like" | "unlike" }) => ({
        url: `/pages/${action}Page/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Pages", "DraftPages"],
    }),

    incrementPageCount: builder.mutation({
      query: (id: string) => ({
        url: `/pages/newPageViewCount/${id}`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPageByIdQuery,
  useGetPagesByAuthorQuery,
  useGetAllCommentsQuery,
  usePageActionMutation,
  useLazyGetPageByIdQuery,
  useIncrementPageCountMutation,
} = pageApi;

export default pageApi;
