import { IContactUsPayload } from "./../../types/user/user.type";
import { IUserFollowing } from "shared/types/user/userResponse.type";
import apiSlice from "../apiSlice/apiSlice";
import { IUpdateUserPayload } from "shared/types/user/user.type";
import {
  setCurrentUser,
  setUpdateFollowing,
} from "store/slices/auth/authSlice";
import { setLiveRooms } from "store/slices/socket/socketSlice";
import { Platform } from "react-native";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userAction: builder.mutation({
      query: ({
        id,
        action,
      }: {
        id: string;
        action: "follow" | "unfollow";
      }) => ({
        url: `/users/${action}/${id}`,
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          const id = Object.values(data)[0];
          if (typeof id === "string") dispatch(setUpdateFollowing(id));
        } catch (error) {
          console.error(error);
        }
      },
      invalidatesTags: ["Followings"],
    }),

    getFollowings: builder.query({
      query: (id: string) => ({
        url: `/users/getFollowingByUserId/${id}`,
        method: "GET",
      }),
      providesTags: (res) => {
        return res?.data.length
          ? [
              ...res?.data.map(({ _id }: IUserFollowing) => ({
                type: "Followings" as const,
                id: _id,
              })),
              "Followings",
            ]
          : ["Followings"];
      },
    }),

    getFollowers: builder.query({
      query: (id: string) => ({
        url: `/users/getFollowersByUserId/${id}`,
      }),
    }),

    updateUserById: builder.mutation({
      query: (data: IUpdateUserPayload) => ({
        url: `/users/updateUserById/${data.id}`,
        body: data.userData,
        method: "PUT",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setCurrentUser(data));
        } catch (error) {
          console.error(error);
        }
      },
    }),

    getLiveUsersRoom: builder.query({
      query: () => ({
        url: "/users/getAllPopularLivesForUser",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setLiveRooms(data));
        } catch (error) {
          console.error(error);
        }
      },
    }),

    contactUs: builder.mutation({
      query: (body: IContactUsPayload) => ({
        url: "/users/contactUs",
        body,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useUserActionMutation,
  useGetFollowingsQuery,
  useGetFollowersQuery,
  useUpdateUserByIdMutation,
  useLazyGetLiveUsersRoomQuery,
  useContactUsMutation,
} = userApi;

export default userApi;
