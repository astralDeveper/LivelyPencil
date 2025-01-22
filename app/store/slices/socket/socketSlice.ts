import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IConnectedUser, ILiveUser } from "shared/types/user/user.type";

type ISearchSliceStates = {
  liveUsers: IConnectedUser[]; // To get profile images and user id
  liveRooms: ILiveUser[]; // To get live stream data
};

const initialState: ISearchSliceStates = {
  liveUsers: [],
  liveRooms: [],
};

const socketSlice = createSlice({
  name: "socketSlice",
  initialState,
  reducers: {
    setLiveUsers(state, { payload }: PayloadAction<IConnectedUser[]>) {
      state.liveUsers = payload;
    },
    setLiveRooms(state, { payload }: PayloadAction<ILiveUser[]>) {
      state.liveRooms = payload;
    },
  },
});

export default socketSlice.reducer;

export const { setLiveUsers, setLiveRooms } = socketSlice.actions;
