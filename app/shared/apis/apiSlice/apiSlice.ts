import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "store/index";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: async (headers, { getState }) => {
      const states = getState() as RootState;
      const token = states.auth.token;
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token ?? ""}`);
      }

      return headers;
    },
    async responseHandler(response) {
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      return Promise.reject(data);
    },
  }),
  tagTypes: ["Pages", "Streams", "Followings", "DraftPages", "Notifications"],
  endpoints: (builder) => ({}),
});

export default apiSlice;
