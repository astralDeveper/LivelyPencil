import { IGetPageById } from "shared/types/page/PageResponse.type";
import apiSlice from "../apiSlice/apiSlice";
import { IUpdatePagePayload } from "shared/types/page/Page.type";

const pageEditorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPagesIncludingDraftByStream: builder.query({
      query: ({ id, page }: { id: string; page: number }) => ({
        url: `/pages/getAllPagesIncludingDraftByBookId?page=${page}&bookId=${id}&limit=30`,
      }),
      providesTags: (res) => {
        return res?.data?.results?.length
          ? [
              ...res?.data?.results?.map(({ _id }: IGetPageById) => ({
                type: "DraftPages" as const,
                id: _id,
              })),
              "DraftPages",
            ]
          : ["DraftPages"];
      },
    }),

    insertPage: builder.mutation({
      query: (body: {
        bookId: string;
        items: { type: "html"; rawHtmlContent: string }[];
      }) => ({
        url: "/pages/insertpage",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Pages", "DraftPages"],
    }),

    deletePage: builder.mutation({
      query: (id: string) => ({
        url: `/pages/deletePage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pages"],
    }),

    deleteDraftPage: builder.mutation({
      query: (id: string) => ({
        url: `/pages/deleteDraftPagePermenantly/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DraftPages"],
    }),

    getAllPagesOfBook: builder.query({
      query: ({ id, page }: { id: string; page: number }) => ({
        url: `pages/getAllPages?page=${page}&limit=30&sortBy=createdAt&bookId=${id}`,
      }),
      providesTags: (res) => {
        if (
          res &&
          typeof res === "object" &&
          "data" in res &&
          typeof res.data === "object" &&
          "bookId" in res.data &&
          typeof res.data.bookId === "string"
        )
          return [{ id: res.data.bookId, type: "Pages" as const }, "Pages"];
        else return ["Pages"];
      },
    }),

    updatePage: builder.mutation({
      query: (body: IUpdatePagePayload) => ({
        url: "/pages/updatePage",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Pages", "DraftPages"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useDeleteDraftPageMutation,
  useDeletePageMutation,
  useGetAllPagesIncludingDraftByStreamQuery,
  useInsertPageMutation,
  useGetAllPagesOfBookQuery,
  useUpdatePageMutation,
} = pageEditorApi;

export default pageEditorApi;
