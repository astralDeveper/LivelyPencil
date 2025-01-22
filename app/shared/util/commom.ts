import { useAppSelector } from "shared/hooks/useRedux";

const showIfNotCurrentUser = (authorId: string) => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  // retrun true if not equal to
  return userId !== authorId;
};

export { showIfNotCurrentUser };
