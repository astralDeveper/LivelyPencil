import { LanguageList } from "shared/util/constants";

export interface ISearchPayload {
  input: string;
  page: number;
  category?: string | null;
  language: (typeof LanguageList)[keyof typeof LanguageList];
}
