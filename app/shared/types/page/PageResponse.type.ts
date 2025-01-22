export interface IGetPage {
  likesCount: number;
  commentsCount: number;
  repliesCount: number;
  isEnabled: boolean;
  isDraft: boolean;
  pageViewCount: number;
  _id: string;
  bookId: string;
  history: History;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  indexOfPage: number;
  pageNumber: number;
  pageShortCode: string;
  authorFullName: string;
  authorProfilePicture: string;
}

export interface IGetPageById {
  likesCount: number;
  commentsCount: number;
  repliesCount: number;
  isEnabled: boolean;
  isDraft: boolean;
  pageViewCount: number;
  _id: string;
  bookId: string;
  history: History[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  indexOfPage: number;
  pageNumber: number;
  pageShortCode: string;
  authorFullName: string;
  authorProfilePicture: string;
}

export interface History {
  versionNumber: number;
  createdDate: string;
  items: Item[];
}

export interface Item {
  media: Media;
  rawHtmlContent: string;
  type: string;
}

export interface Media {
  type: any;
  src: any;
  height: any;
  width: any;
}
