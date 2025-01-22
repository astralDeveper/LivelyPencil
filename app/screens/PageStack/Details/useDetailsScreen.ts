import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useGetPageByIdQuery,
  useIncrementPageCountMutation,
  usePageActionMutation,
} from "shared/apis/page/pageApi";
import { PageStackNavigatorProps } from "shared/navigators/PageStackNavigator";
import { IGetPageById } from "shared/types/page/PageResponse.type";
import { apiHandler } from "shared/util/handler";
import he from "he";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import { useUserActionMutation } from "shared/apis/user/userApi";
import { ViewabilityConfig } from "react-native";
import { ViewToken } from "@shopify/flash-list";
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { setPagesLiked } from "store/slices/util/utilSlice";

export const useDetailsScreenAction = (authorId: string, pageId: string) => {
  const listOfFollowing = useAppSelector(
    (state) => state.auth.user?.listofFollowing
  );

  const [isFollowing, setIsFollowing] = useState<boolean>(
    listOfFollowing !== undefined && listOfFollowing.includes(authorId)
  );

  const [
    userAction,
    { data: actionData, error: actionError, isLoading: actionLoading },
  ] = useUserActionMutation();

  useEffect(() => {
    apiHandler({
      data: actionData,
      error: actionError,
      showSuccess: true,
      onSuccess(_) {
        setIsFollowing(!isFollowing);
      },
    });
  }, [actionData, actionError]);

  function handleFollowAction() {
    if (isFollowing) userAction({ action: "unfollow", id: authorId });
    else userAction({ action: "follow", id: authorId });
  }

  console.log("actionData",actionData)

  return {
    handleFollowAction,
    actionLoading,
    isFollowing,
  };
};

const useDetailsScreenItem = (pageId: string) => {

  const { navigate } = useNavigation<PageStackNavigatorProps>();
  const [pageDetails, setPageDetails] = useState<IGetPageById | null>(null);
  const [html, setHtml] = useState<string>("");
  const pageLikedIds = useAppSelector((state) => state.util.pagesLiked);
  const [isLiked, setIsLiked] = useState<boolean>(
    pageLikedIds.includes(pageId)
  );

  
  const pageLikeCounts = useRef(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const dispatch = useAppDispatch();

  const { data, error, isLoading } = useGetPageByIdQuery(pageId);
  const [pageAction, { data: pageActionData, error: pageActionError }] =
    usePageActionMutation(); 

  const doubleTapRef = useRef();

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: Math.max(scale.value, 0) }],
    };
  });

  const onDoubleTap = useCallback(() => {
    if (isLiked) return;
    scale.value = withSpring(1, undefined, (isFinished) => {
      if (isFinished) {
        scale.value = withDelay(500, withSpring(0));
      }
    });
    if (!isLiked) handleLikePress();
  }, [isLiked]);

  const onSingleTap = useCallback(() => {
    opacity.value = withTiming(0, undefined, (isFinished) => {
      if (isFinished) {
        opacity.value = withDelay(500, withTiming(1));
      }
    });
  }, [isLiked]);

  useEffect(() => {
    apiHandler({
      data,
      error,
      onSuccess(response) {
        setPageDetails(response.data);
        pageLikeCounts.current = response.data.likesCount;
        setHtml(he.decode(response.data?.history[0].items[0].rawHtmlContent));
      },
    });
  }, [data, error]);

  useEffect(() => {
    apiHandler({
      data: pageActionData,
      error: pageActionError,
    });
  }, [pageActionData, pageActionError]);

  const navigateToDiscussion = () => {
    if (!pageDetails) return;
    navigate("Discussion", {
      bookId: pageDetails?.bookId,
      pageId,
      pageShortCode: pageDetails?.pageShortCode,
      totalComments: pageDetails?.commentsCount,
    });
  };

  const navigateToOtherProfile = (id: string) =>
    navigate("OtherProfile", { id });

  function handleLikePress() {
    if (isLiked) {
      dispatch(setPagesLiked(pageLikedIds.filter((id) => pageId !== id)));
      pageAction({
        action: "unlike",
        id: pageId,
      });
      pageLikeCounts.current--;
      setIsLiked(false);
    } else {
      dispatch(setPagesLiked([...pageLikedIds, pageId]));
      pageAction({
        action: "like",
        id: pageId,
      });
      pageLikeCounts.current++;
      setIsLiked(true);
    }
  }

  return {
    pageDetails,
    authorFullName: pageDetails?.authorFullName ?? "",
    authorProfilePicture: pageDetails?.authorProfilePicture ?? "",
    navigateToDiscussion,
    isLoading,
    html,
    navigateToOtherProfile,
    doubleTapRef,
    onDoubleTap,
    rStyle,
    onSingleTap,
    isLiked,
    handleLikePress,
    likesCount: pageLikeCounts.current,
  };
};

export const usePageViewed = (pageIds: string[]) => {
  const hasViewedPage = useRef<string[]>([]).current;
  const [incrementCount] = useIncrementPageCountMutation();

  const onViewableItemsChanged = ({
    viewableItems,
    changed,
  }: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    if (
      viewableItems &&
      viewableItems.length > 0 &&
      typeof viewableItems[0].index === "number"
    ) {
      if (!hasViewedPage.includes(pageIds[viewableItems[0].index])) {
        hasViewedPage.push(pageIds[viewableItems[0].index]);
        incrementCount(pageIds[viewableItems[0].index]);
      }
    }
  };

  return {
    onViewableItemsChanged,
  };
};

export default useDetailsScreenItem;
