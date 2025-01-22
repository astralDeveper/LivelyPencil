export type ILoginPayload = {
  email: string;
  password: string;
  pushNotificationTokens: [string | null];
};

export type IRegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  pushNotificationTokens?: string[];
  file?: IUserFile;
};

export type IUserFile = { uri: string; name: string; type: string };

export type IForgotPasswordPayload = {
  email: string;
};
