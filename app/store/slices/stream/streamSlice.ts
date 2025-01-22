import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ISearchSliceStates = {
  showSelectPageModal: boolean;
};

const initialState: ISearchSliceStates = {
  showSelectPageModal: false,
};

const streamSlice = createSlice({
  name: "streamSlice",
  initialState,
  reducers: {
    setShowSelectPageModal(state, { payload }: PayloadAction<boolean>) {
      state.showSelectPageModal = payload;
    },
  },
});

export default streamSlice.reducer;

export const { setShowSelectPageModal } = streamSlice.actions;
