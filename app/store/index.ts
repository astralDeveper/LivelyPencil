import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import apiSlice from "app/shared/apis/apiSlice/apiSlice";
import authSlice from "app/store/slices/auth/authSlice";
import streamSlice from "./slices/stream/streamSlice";
import utilSlice from "./slices/util/utilSlice";
import socketSlice from "./slices/socket/socketSlice";
import { rtkQueryErrorLogger } from "shared/middleware/rtk-error";

const persistConfig = {
  key: "livelypencil",
  storage: AsyncStorage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSlice,
  stream: streamSlice,
  socket: socketSlice,
  util: utilSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
  // .concat(rtkQueryErrorLogger),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

// export const store2 = create((set) => ({
//   userSearchInput: "",
//   setUserSearchInput: (userSearchInput) => set({ userSearchInput }),
//   notification: false,
//   setNotification: (notification) => set({ notification }),
// }));

// const store = create((set) => ({
//   expoPushToken: "",
//   setExpoPushToken: (expoPushToken) => set({ expoPushToken }),
//   isAuth: false,
//   currentUser: [],

//   // ProfileImage
//   profileImage: "",
//   preview: false,
//   setPreview: (preview) => set({ preview }),

//   otherUser: [],
//   setOtherUser: (otherUser) => {
//     set({ otherUser });
//   },
//   // userSearchInput: "",
//   // setUserSearchInput: (userSearchInput) => set({ userSearchInput }),
//   userSearchFetchData: [],
//   setUserSearchFetchData: (userSearchFetchData) => set({ userSearchFetchData }),
//   pageSearchFetchData: [],
//   setPageSearchFetchData: (pageSearchFetchData) => set({ pageSearchFetchData }),
//   bookSearchFetchData: [],
//   setBookSearchFetchData: (bookSearchFetchData) => set({ bookSearchFetchData }),

//   // Check If image taken using camera
//   sourceCamera: false,
//   setSourceCamera: (sourceCamera) => set({ sourceCamera }),

//   // Search Page `Tab Index
//   index: 0,
//   setIndex: (index) => set({ index }),

//   //showOtherUserModal used to show others Profile
//   showOtherUserModal: false,
//   setShowOtherUserModal: (showOtherUserModal) => set({ showOtherUserModal }),

//   editorInstance: null,
//   setEditorInstance: (editorInstance) => set(() => ({ editorInstance })),
//   clearText: () =>
//     set((state) => {
//       state.editorInstance?.setHtml("");
//     }),
//   setProfileImage: (profileImage) => set({ profileImage }),
//   setIsAuth: (state) => set({ state }),

//   // setCurrentUser: async (currentUser) => {
//   //   await AsyncStorage.setItem("user", JSON.stringify(currentUser));

//   //   return set({ currentUser });
//   // },
//   setCurrentUser: (currentUser) => {
//     set({ currentUser });

//     AsyncStorage.setItem("user", JSON.stringify(currentUser)).catch((error) =>
//       console.log(error)
//     );
//   },
// }));

// export default store;
