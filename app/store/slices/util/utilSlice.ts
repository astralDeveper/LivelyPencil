import { LanguageList } from "./../../../shared/util/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type IUtilSliceStates = {
  showSelectLanguageModal: boolean;
  languageSelected: (typeof LanguageList)[keyof typeof LanguageList];
  languages: (typeof LanguageList)[keyof typeof LanguageList][];
  pagesLiked: string[];
};

const initialState: IUtilSliceStates = {
  showSelectLanguageModal: false,
  languageSelected: "English",
  languages: Object.values(LanguageList),
  pagesLiked: [],
};

const utilSlice = createSlice({
  name: "utilSlice",
  initialState,
  reducers: {
    setShowSelectLanguageModal(state, { payload }: PayloadAction<boolean>) {
      state.showSelectLanguageModal = payload;
    },
    setSelectedLanguage(
      state,
      {
        payload,
      }: PayloadAction<(typeof LanguageList)[keyof typeof LanguageList]>
    ) {
      state.languageSelected = payload;
    },
    
    updateLanguages(
      state,
      {
        payload,
      }: PayloadAction<(typeof LanguageList)[keyof typeof LanguageList]>
    ) {
      state.languages = [
        payload,
        ...state.languages.filter((item) => item !== payload),
      ];
    },

    setPagesLiked(state, { payload }: PayloadAction<string[]>) {
      state.pagesLiked = payload;
    },
  },
});

export default utilSlice.reducer;

export const {
  setShowSelectLanguageModal,
  setSelectedLanguage,
  updateLanguages,
  setPagesLiked,
} = utilSlice.actions;
