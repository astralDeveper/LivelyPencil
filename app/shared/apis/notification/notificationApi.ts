import { RESULTS_LIMIT } from "shared/util/constants";
import apiSlice from "../apiSlice/apiSlice";

const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: (pageNumber: number) => ({
        url: `/notification/getAllNotifications?limit=${RESULTS_LIMIT}&page=${pageNumber}`,
      }),
      providesTags: ["Notifications"],
    }),
    markAsReadNotification: builder.mutation({
      query: (id: string) => ({
        url: `/notification/markAsRead/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllNotificationsQuery,
  useMarkAsReadNotificationMutation,
} = notificationApi;

export default notificationApi;
