export interface IUserFollowing {
  _id: string;
  email: string;
  fullName: string;
  profilePicture: string;
  coverImg?: string;
  totalFollowers: number;
  totalFollowings: number;
  createdAt: string;
  nickName: string;
}
