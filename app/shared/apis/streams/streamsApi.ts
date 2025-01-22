import { LanguageList, RESULTS_LIMIT } from "shared/util/constants";
import apiSlice from "../apiSlice/apiSlice";
import {
  IStream,
  IStreamPayload,
  IUpdateStreamPayload,
} from "shared/types/stream/streamResponse.type";
import { Alert } from "react-native";

type GetStreamByCategoryParams = {
  id: string;
  language: (typeof LanguageList)[keyof typeof LanguageList];
  
};


const streamsApi = apiSlice.injectEndpoints({
  
  endpoints: (builder) => ({
    
    // getStreamsByCategory: builder.query({
    //   query: (data: GetStreamByCategoryParams) => ({
        
    //     url: `/books/getBooksByCategoryId?page=1&limit=300&sortBy=createdAt:desc&categoryId=${data.id}&language=${data.language}`,
    //   }),
    // }),

    getStreamsByCategory: builder.query({
      query: (data: GetStreamByCategoryParams) => {
        // console.log("Language selected:", data.language); // Log the value of data.language
        return {
          url: `/books/getBooksByCategoryId?page=1&limit=300&sortBy=createdAt:desc&categoryId=${data.id}&language=${data.language == "All Languages" ? "" : data.language }`,
        };
      },
    }),
    
    
    
    
    createStream: builder.mutation({
      query: (body: IStreamPayload) => {
        let bodyFormData = new FormData();
        bodyFormData.append("file", body.file);
        bodyFormData.append("title", body.title);
        bodyFormData.append("language", body.language);
        bodyFormData.append("description", body.description);
        bodyFormData.append("categoryId", body.categoryId);
        
        return {
          url: "/books/createBook",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: bodyFormData,
          method: "POST",
          
        };
        
      },
      
      invalidatesTags: [{ type: "Streams", id: "LIST" }],
    }),
    
    getStreamsByAuthorId: builder.query({
      query: ({ id, page }: { id: string; page: number }) => ({
        url: `/books/getAllBooksByUserId?page=${page}&limit=${RESULTS_LIMIT}&sortBy=title:asc&authorId=${id}`,
      }),
      providesTags: (result) => {
        return result &&
        typeof result === "object" &&
        "results" in result &&
          Array.isArray(result.results)
          ? [
              ...result.results.map(({ id }: { id: string }) => ({
                type: "Streams",
                id,
              })),
              { type: "Streams", id: "LIST" }, // Explicitly add LIST tag for full list invalidation
            ]
          : [{ type: "Streams", id: "LIST" }];
      },
    }),
    getMyStreams: builder.query({
      query: ({ id, page }: { id: string; page: number }) => ({
        url: `/books/getAllBooksByUserId?page=${page}&limit=${RESULTS_LIMIT}&sortBy=title:asc&authorId=${id}`,
      }),
      providesTags: (result) => {
        return result &&
          typeof result === "object" &&
          "results" in result &&
          Array.isArray(result.results)
          ? [
              ...result.results.map(({ id }: { id: string }) => ({
                type: "Streams",
                id,
              })),
              { type: "Streams", id: "LIST" }, // Explicitly add LIST tag for full list invalidation
            ]
          : [{ type: "Streams", id: "LIST" }];
      },
    }),

    updateStream: builder.mutation({
      query: (body: IUpdateStreamPayload) => {
        return {
          url: "/books/updateBook",
          body,
          method: "PUT",
        };
      },
      invalidatesTags: ["Streams"],
    }),

    deleteStream: builder.mutation({
      query: (id: string) => ({
        url: `/books/deleteBook/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Streams" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetStreamsByCategoryQuery,
  useGetStreamsByAuthorIdQuery,
  useGetMyStreamsQuery,
  useCreateStreamMutation,
  useUpdateStreamMutation,
  useDeleteStreamMutation,
} = streamsApi;

export default streamsApi;
