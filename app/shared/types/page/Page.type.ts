export type PageList = {
  html: string;
  id: string;
  imageUrl: string | null;
  isEnabled: boolean;
  index: number;
  indexOfPage: number;
};

export type IUpdatePagePayload = {
  _id: string;
  isDraft: "true" | "false";
  rawHtmlContent: string;
};
