export interface IUser {
  verified: boolean;
  role: string;
  isEmailVerified: boolean;
  listofCategoryIds: string[];
  listofFollowers: string[];
  listofFollowing: string[];
  pushNotificationtokensList: any[];
  notificationMode: any[];
  _id: string;
  fullName: string;
  email: string;
  nickName: string;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
  coverImg: string;
  bio: string;
  id: string;
  link?: string;
}

export interface IUserListDisplay {
  _id: string;
  profilePicture: string;
  nickName: string;
  fullName: string;
}

export interface IUserCategoryData {
  _id: string;
  categoryName: string;
}

export interface IUpdateUserPayload {
  id: string;
  userData: {
    nickName?: string;
    listofCategoryIds?: string[];
    fullName?: string;
    bio?: string;
    link?: string;
  };
}

export interface IConnectedUser {
  email: string;
  fullName: string;
  online: boolean;
  penName: string;
  profilePicture: string;
  role: string;
  socketId: string;
  sub: string;
}

export interface ILiveUser {
  fullName: string;
  email: string;
  photo: string;
  _id: string;
  title: string;
  coverImageUrl: string;
  bookShortCode: string;
}

export interface IContactUsPayload {
  subject: string;
  message: string;
}
