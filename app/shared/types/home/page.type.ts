export interface IGetFollowersPageResponse {
  results: Result[];
}

export interface Result {
  _id: string;
  likesCount: number;
  commentsCount: number;
  repliesCount: number;
  isEnabled: boolean;
  isDraft: boolean;
  pageViewCount: number;
  bookId: string;
  history: History;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  indexOfPage: number;
  pageNumber: number;
  pageShortCode: string;
  bookName: string;
  bookShortCode: string;
  authorEmail: string;
  authorFullName: string;
  authorNickName: string;
  authorProfilePicture: string;
}

export interface History {
  versionNumber: number;
  createdDate: Date;
  items: Item[];
}

export interface Item {
  media: Media;
  rawHtmlContent: string;
  type: Type;
}

export interface Media {
  type: null;
  src: null;
  height: null;
  width: null;
}

export enum Type {
  HTML = "html",
}
