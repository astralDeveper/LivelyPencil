import { LanguageList } from "shared/util/constants";
import { IUserFile } from "../auth/authApi.type";

export interface IUpdateStreamPayload extends Partial<IStreamPayload> {
  _id: string;
}

export interface IStreamPayload {
  file: IUserFile;
  description: string;
  title: string;
  categoryId: string;
  language: (typeof LanguageList)[keyof typeof LanguageList];
}

export interface IStream {
  numberOfPages: number;
  isEnabled: boolean;
  _id: string;
  title: string;
  categoryId:
    | string
    | {
        _id: string;
        categoryName: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        categoryImage: string;
      };
  description: string;
  listOfPageIds: Array<ListOfPageId>;
  authorId:
    | string
    | {
        verified: boolean;
        role: string;
        isEmailVerified: boolean;
        listofCategoryIds: string[];
        listofFollowers: string[];
        listofFollowing: string[];
        pushNotificationtokensList: string[];
        notificationMode: any[]; // Adjust this type accordingly if you have more information about this field
        _id: string;
        fullName: string;
        email: string;
        nickName: string;
        profilePicture: string;
        createdAt: string;
        updatedAt: string;
        coverImg: string;
        bio: string;
        link: string;
        id: string;
      };
  coverImageUrl: string;
  bookShortCode: string;
  createdAt: string;
  updatedAt: string;
  language: (typeof LanguageList)[keyof typeof LanguageList];
}

export interface ListOfPageId {
  pageId: string;
  isEnabled: boolean;
}
