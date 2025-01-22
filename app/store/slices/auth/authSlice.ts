import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "shared/types/user/user.type";

type IAuthSliceStates = {
  user: IUser | null;
  token: string | null;
  isLoggedIn: boolean;
  showOnBoarding: boolean;
  notificationToken: string | null;
  showOtpModal: boolean;
  profileImageUrl: string | null;
  unverifiedEmail: string | null;
};

const initialState: IAuthSliceStates = {
  user: null,
  token: null,
  showOnBoarding: true,
  isLoggedIn: false,
  showOtpModal: false,
  profileImageUrl: null,
  unverifiedEmail: null,
  notificationToken: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUserLogIn(
      state,
      {
        payload,
      }: PayloadAction<{ token: string; isLoggedIn: boolean; user: IUser }>
    ) {
      state.isLoggedIn = payload.isLoggedIn;
      state.token = payload.token;
      state.user = payload.user;
    },
    setShowOnBoarding(state, { payload }: PayloadAction<boolean>) {
      state.showOnBoarding = payload;
    },
    setNotificationToken(state, { payload }: PayloadAction<string>) {
      state.notificationToken = payload;
    },
    setShowOtpModal(state, { payload }: PayloadAction<boolean>) {
      state.showOtpModal = payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    setCurrentUser(state, { payload }: PayloadAction<IUser>) {
      state.user = payload;
    },
    setProfileImage(state, { payload }: PayloadAction<string | null>) {
      state.profileImageUrl = payload;
    },
    setUnverifiedEmail(state, { payload }: PayloadAction<string>) {
      state.unverifiedEmail = payload;
    },
    setUpdateFollowing(state, { payload }: PayloadAction<string>) {
      if (state.user?.listofFollowing.includes(payload))
        // Already following
        state.user = {
          ...state.user,
          listofFollowing: state.user.listofFollowing.filter(
            (id) => id !== payload
          ),
        };
      else if (state.user?.listofFollowing)
        state.user = {
          ...state.user,
          listofFollowing: [...state.user.listofFollowing, payload],
        };
    },
    setListOfCategoryIds(state, { payload }: PayloadAction<string>) {
      if (state.user?.listofCategoryIds.includes(payload)) {
        state.user.listofCategoryIds = state.user.listofCategoryIds.filter(
          (item) => item !== payload
        );
      } else if (state.user?.listofCategoryIds) {
        state.user.listofCategoryIds = [
          ...state.user.listofCategoryIds,
          payload,
        ];
      }
    },
  },
});

export default authSlice.reducer;

export const {
  setUserLogIn,
  setShowOnBoarding,
  setShowOtpModal,
  logout,
  setCurrentUser,
  setProfileImage,
  setUnverifiedEmail,
  setUpdateFollowing,
  setListOfCategoryIds,
  setNotificationToken,
} = authSlice.actions;
