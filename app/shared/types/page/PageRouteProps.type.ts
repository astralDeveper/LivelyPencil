export interface IPageDetails {
  pageIds: string[];
  initialIndex?: number;
  inverted?: boolean;
}

export interface IPageDiscussion {
  bookId: string;
  pageId: string;
  pageShortCode: string;
  totalComments: number;
}
