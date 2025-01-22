export interface INotification {
  bodyText: string;
  read: boolean;
  _id: string;
  notificationType: NotificationType;
  userId: string;
  title: string;
  data: unknown;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export enum NotificationType {
  BOOKLIVE = "Book_live",
  NEW_COMMENT = "New_Comment",
  NEW_REPLY = "New_Reply",
  NEW_COMMENT_LIKE = "New_Comment_Like",
  NEW_REPLY_LIKE = "New_Reply_Like",
  PAGE_LIKE = "Page_Like",
  PAGE_PUBLISHED = "Page_Published",
  NEW_FOLLOW = "New_Follow",
}
