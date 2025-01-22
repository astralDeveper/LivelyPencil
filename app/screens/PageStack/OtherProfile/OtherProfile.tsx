import Profile from "app/components/User/Profile";
import useOtherProfile from "./useOtherProfile";
import { Loading } from "app/components";
import SelectPageModal from "app/components/Streams/SelectPageModal";

export default function OtherProfile() {
  const {
    currentUser,
    navigateToOtherProfile,
    userUrl,
    pages,
    streams,
    isLoading,
    goBack,
    onPagesEndReached,
    onStreamsEndReached,
    navigateToOtherPageFromPages,
    setSelectedStream,
    handleNavigationFromStream,
    selectedStream,
    closeSelectPageModal,
    isSelectPageModalVisible,
    actionLoading,
    handleFollowAction,
  } = useOtherProfile();

  if (!currentUser) return null;

  if (isLoading) return <Loading />;

  return (
    <>
    <Profile
      pages={pages}
      streams={streams}
      currentUser={currentUser}
      userUrl={userUrl}
      navigateToOtherPageFromPages={navigateToOtherPageFromPages}
      setSelectedStream={setSelectedStream}
      navigateToOtherProfile={navigateToOtherProfile}
      otherProfile={true}
      goBack={goBack}
      handleFollowAction={handleFollowAction}
      actionLoading={actionLoading}
      onEndReachedPages={onPagesEndReached}
      onEndReachedStreams={onStreamsEndReached}
      handleNavigationFromStream={handleNavigationFromStream}
      selectedStream={selectedStream}
      closeSelectPageModal={closeSelectPageModal}
      isVisible={isSelectPageModalVisible}
    />
  <SelectPageModal
    onPressNavigate={handleNavigationFromStream}
    selectedStream={selectedStream}
    title={selectedStream.title}
    visible={isSelectPageModalVisible}
    closeModal={closeSelectPageModal}
  />
  </>
  );
}
