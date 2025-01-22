import { IUserFile } from "shared/types/auth/authApi.type";
import apiSlice from "../apiSlice/apiSlice";
import { setCurrentUser } from "store/slices/auth/authSlice";

const userFileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateCoverImage: builder.mutation({
      query: (body: IUserFile) => {
        let bodyFormData = new FormData();
        bodyFormData.append("file", body);
        return {
          url: "/users/updateUserCoverImage",
          body: bodyFormData,
          formData: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          method: "POST",
        };
      },
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

    updateProfileImage: builder.mutation({
      query: (body: IUserFile) => {
        let bodyFormData = new FormData();
        bodyFormData.append("file", body);
        return {
          url: "/users/updateUserProfileImage",
          body: bodyFormData,
          formData: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          method: "POST",
        };
      },
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

    // addMedia: builder.mutation({
    //   query: (body: IUserFile) => {
    //     let bodyFormData = new FormData();
    //     bodyFormData.append("file", body);
    //     return {
    //       url: "/s3/addMedia/",
    //       body: bodyFormData,
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     };
    //   },
    // }),
    addMedia: builder.mutation({
  query: (body) => {
    let bodyFormData = new FormData();
    bodyFormData.append("file", body);
    return {
      url: "/s3/addMedia/",
      body: bodyFormData,
      method: "POST",
      responseHandler: (response) => response.text(), // Override for this endpoint
    };
  },
}),

  }),
  overrideExisting: true,
});

export const {
  useUpdateCoverImageMutation,
  useUpdateProfileImageMutation,
  useAddMediaMutation,
} = userFileApi;

export default userFileApi;
