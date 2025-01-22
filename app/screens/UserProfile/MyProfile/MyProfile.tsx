import { TouchableOpacity, View } from "react-native";
import useMyProfile from "./useMyProfile";
import Profile from "app/components/User/Profile";
import SettingsIcon from "assets/svg/Stream/Setting";
import SelectPageModal from "app/components/Streams/SelectPageModal";

export default function MyProfile() {
  const {
    currentUser,
    navigateToOtherProfile,
    userUrl,
    pages,
    streams,
    onPagesEndReached,
    onStreamsEndReached,
    navigateToOtherPageFromPages,
    setSelectedStream,
    handleNavigationFromStream,
    selectedStream,
    navigateToSettings,
    closeSelectPageModal,
    isSelectPageModalVisible,
  } = useMyProfile();

  if (!currentUser) return null;

  return (
    <>
    <Profile
      pages={pages}
      streams={streams}
      currentUser={currentUser}
      userUrl={userUrl}
      navigateToOtherProfile={navigateToOtherProfile}
      otherProfile={false}
      onEndReachedPages={onPagesEndReached}
      onEndReachedStreams={onStreamsEndReached}
      navigateToOtherPageFromPages={navigateToOtherPageFromPages}
      setSelectedStream={setSelectedStream}
      handleNavigationFromStream={handleNavigationFromStream}
      selectedStream={selectedStream}
      navigateToSettings={navigateToSettings}
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
