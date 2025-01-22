import {
  setCurrentUser,
  setShowOtpModal,
  setUserLogIn,
} from "store/slices/auth/authSlice";
import apiSlice from "../apiSlice/apiSlice";
import {
  IForgotPasswordPayload,
  ILoginPayload,
  IRegisterPayload,
} from "shared/types/auth/authApi.type";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { setPagesLiked } from "store/slices/util/utilSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body: ILoginPayload) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(
            setUserLogIn({
              token: data.tokens.access.token,
              isLoggedIn: true,
              user: data.user,
            })
          );
        } catch (error) {
          Alert.alert("Login Failed", "Incorrect Email or Password");
          if (typeof error === "object" && error && "error" in error) {
            if (
              typeof error.error === "object" &&
              error.error &&
              "data" in error.error
            ) {
              // @ts-ignore
              const errorData = JSON.parse(error?.error?.data);
              if (errorData.code === 449) {
                dispatch(setShowOtpModal(true));
              }
            }
          }
          // console.error(error);
        }
      },
    }),

    // register: builder.mutation({
    //   query: (body: IRegisterPayload) => ({
    //     url: "/auth/register",
    //     method: "POST",
    //     body,
    //   }),
    //   async onQueryStarted(_, { queryFulfilled, dispatch }) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       dispatch(setShowOtpModal(true));
    //     } catch (error) {}
    //   },
    // }),

    register: builder.mutation({
      
      // query: (body: IRegisterPayload) => ({
      //   console.log("IRegisterPayload:", body),
      //   url: "/auth/register",
      //   method: "POST",
      //   body,
      // }),
      query: (body) => {
        console.log("IRegisterPayload:", body); // Logs the payload
        return {
          url: "/auth/register",
          method: "POST",
          body,
        };
      },
      
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        
        try {
          const { data } = await queryFulfilled;
          dispatch(setShowOtpModal(true));
        } catch (error) {}
      },
    }),



    forgotPassword: builder.mutation({
      query: (body: IForgotPasswordPayload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    updateMyProfile: builder.query({
      query: () => ({
        url: "/users/verifyToken",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(setCurrentUser(data.user));
        } catch (error) {
          console.error("error");
          console.error(error);
        }
      },
    }),

    getMyLikesList: builder.query({
      query: (id: string) => ({
        url: `/pages/getAllLikesOfUserByUserId/${id}`,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          const likedIds: string[] = [];
          data.map((item: unknown) => {
            if (
              item &&
              typeof item === "object" &&
              "_id" in item &&
              item._id &&
              typeof item._id === "string"
            )
              likedIds.push(item._id);
          });
          dispatch(setPagesLiked(likedIds));
        } catch (error) {
          console.error(error);
        }
      },
    }),

    verifyOtp: builder.mutation({
      query: (body: { email: string; otp: string }) => ({
        url: `/auth/verify-email?token=${body.otp}&email=${body.email}`,
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(
            setUserLogIn({
              token: data.tokens.access.token,
              isLoggedIn: true,
              user: data.user,
            })
          );
          dispatch(setShowOtpModal(false));
        } catch (error) {
          console.error(error);
        }
      },
    }),

    resendOtp: builder.mutation({
      query: (email: string) => ({
        url: `/auth/resend-verification-email?email=${email}`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useUpdateMyProfileQuery,
  useResendOtpMutation,
  useVerifyOtpMutation,
  useGetMyLikesListQuery,
} = authApi;

export default authApi;
