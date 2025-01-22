import PageDiscussion from "./PageDiscussion";
import { useRoute } from "@react-navigation/native";
import { DiscussionRouteProp } from "shared/navigators/PageStackNavigator";

export default function Discussion() {
  const { params } = useRoute<DiscussionRouteProp>();

  return (
    <>
      <PageDiscussion
        bookRef={params.bookId}
        pageRef={params.pageId}
        pageShortCode={params.pageShortCode}
        totalComments={params.totalComments}
      />
    </>
  );
}
