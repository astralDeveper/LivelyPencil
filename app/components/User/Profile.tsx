import { View, Pressable, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "react-native-collapsible-tab-view";
import * as Linking from "expo-linking";
import UsersProfileList from "app/components/User/UsersProfileList";
import PagesList from "app/components/Page/PagesList";
import StreamsList from "app/components/Streams/StreamsList";
import { IUser } from "shared/types/user/user.type";
import { PageList } from "shared/types/page/Page.type";
import { IStream } from "shared/types/stream/streamResponse.type";
import { ChevronLeft } from "react-native-feather";
import { Button, ListEmptyComponent, Text } from "../ui";
import SelectPageModal from "../Streams/SelectPageModal";
import { SelectedStream } from "shared/types/stream/streamList.type";
import SettingsIcon from "assets/svg/Stream/Setting";
import useSafeAreaInsets from "shared/hooks/useSafeArea";
import { useAppSelector } from "shared/hooks/useRedux";
import { StatusBar } from "expo-status-bar";
import { showIfNotCurrentUser } from "shared/util/commom";

const options = {
  year: "numeric",
  month: "short",
  day: "2-digit",
};

type ProfileProps<T extends boolean> = {
  currentUser: IUser;
  navigateToOtherPageFromPages: (id: string) => void;
  setSelectedStream: (id: string) => void;
  navigateToOtherProfile: (id: string) => void;
  pages: PageList[];
  streams: IStream[];
  userUrl: string;
  otherProfile: T;
  goBack?: T extends true ? () => void : undefined;
  handleFollowAction?: T extends true
    ? (id: string, action: "follow" | "unfollow") => void
    : undefined;
  actionLoading?: T;
  onEndReachedPages: () => void;
  onEndReachedStreams: () => void;
  selectedStream: SelectedStream;
  handleNavigationFromStream: (isLast: boolean) => void;
  navigateToSettings?: () => void;
  isVisible: boolean;
  closeSelectPageModal: () => void;
};

type ProfileHeaderProps<T extends boolean> = {
  currentUser: IUser;
  numFollowings: number;
  numFollowers: number;
  userUrl: string;
  otherProfile: T;
  goBack?: T extends true ? () => void : undefined;
  handleFollowAction?: T extends true
    ? (id: string, action: "follow" | "unfollow") => void
    : undefined;
  navigateToSettings?: () => void;
  actionLoading?: T;
};

function ProfileHeader<T extends boolean>({
  currentUser,
  userUrl,
  numFollowers,
  numFollowings,
  goBack,
  navigateToSettings,
  handleFollowAction,
  actionLoading,
}: ProfileHeaderProps<T>) {
  const joined = new Date(currentUser.createdAt);
  const isFollowing = useAppSelector((state) =>
    state.auth.user?.listofFollowing.includes(currentUser._id)
  );
 
const user = useAppSelector((state) => state.auth.user);
  return (
    <View className="bg-white flex-1 relative">
      <StatusBar backgroundColor="white" />
      {goBack && Platform.OS === "ios" && (
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0,0,0,0.2)",
            width: 30,
            height: 30,
            top: 10,
          }}
          className="z-40 left-[3%] p-2 items-center justify-center rounded-lg absolute"
          onPress={goBack}
        >
          <ChevronLeft width={28} height={28} color="white" />
        </TouchableOpacity>
      )}
      {navigateToSettings && (
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(0,0,0,0.2)",
            width: 30,
            height: 30,
            top: 10,
          }}
          className="z-40 right-[3%] p-2 items-center justify-center rounded-lg absolute"
          onPress={navigateToSettings}
        >
          <SettingsIcon
            color="#FFFFFF"
            strokeWidth={1.5}
            width={24}
            height={24}
          />
        </TouchableOpacity>
      )}
      {!currentUser?.coverImg ? (
        <Pressable
          // onPress={() => navigation.navigate("UserUpdate")}
          className="h-56 w-full bg-gray-700 justify-center items-center"
        >
          <Text className="text-center font-Inter-bold text-xl mt-10 text-white">
            Add Cover
          </Text>
        </Pressable>
      ) : (
        <Image
          style={{
            borderBottomRightRadius: 100, // adjust this value to curve only the bottom-right corner
            borderWidth: 4,
            borderColor: "white",
            marginTop: -50,
          }}
          cachePolicy="memory-disk"
          contentFit="cover"
          source={{
            uri:
             /\bfile\b/.test(currentUser?.coverImg)
              ? currentUser?.coverImg
              : `${process.env.S3}/${
                  currentUser.coverImg
                }?timestamp=${new Date().getTime()}`
        
          }}
          className="w-full h-56"
        />
      )}

      <Pressable
        // onPress={() => navigation.navigate("UserUpdate")}
        className="items-center"
      >
        <Image
          source={{
            uri: 
            // /\bfile\b/.test(currentUser.profilePicture)
            //   ? currentUser?.profilePicture
            //   : `${process.env.S3}/${
            //       currentUser?.profilePicture
            //     }?timestamp=${new Date().getTime()}`
            user?.profilePicture?.includes("file")
                    ? user?.profilePicture
                    : // : `${API_URL}/s3/getMedia/${
                      `${process.env.S3}/${
                        user?.profilePicture
                      }?timestamp=${new Date().getTime()}`,
            
          }}
          className="rounded-full w-24 h-24 border-2 border-brand  ml-1 mt-[-50] "
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </Pressable>
      <View className="flex-col justify-center items-center">
        <Text className="text-Black text-xl font-Inter-bold">
          {currentUser?.fullName}
        </Text>
        <Text className="text-xs my-2 text-gray-400 font-Inter-Black">
          @
          {currentUser?.nickName
            ? currentUser.nickName
            : currentUser?.email.split("@")[0]}
        </Text>
        <Text className=" text-sm text-gray-400 font-Inter-medium mx-auto px-20 text-center">
          {currentUser?.bio ? currentUser.bio : "Who am I?"}
        </Text>
        <Pressable className="my-2 flex-row items-center space-x-2">
          <Feather name="link" size={16} color="gray" />
          <Text
            onPress={() => Linking.openURL(userUrl)}
            className="text-blue-300 font-Inter-Black"
          >
            {userUrl}
          </Text>
        </Pressable>
        <Text className="font-Inter-medium text-gray-500 text-xs">
          <AntDesign name="calendar" size={16} color="gray" /> Joined{" "}
          {joined.toLocaleDateString("en-GB", options)}
        </Text>
        <View className="flex-row space-x-2 my-2">
          <View className="flex-row items-center ">
            <Text className="text-xs font-Inter-bold text-blue-600">
              {numFollowings}
            </Text>
            <Text className="text-xs font-Inter-bold"> Following</Text>
          </View>
          <View className="flex-row   items-center ">
            <Text className="text-xs font-Inter-bold text-blue-600">
              {numFollowers}
            </Text>
            <Text className="text-xs font-Inter-bold"> Followers</Text>
          </View>
        </View>
      </View>
      {showIfNotCurrentUser(currentUser._id) &&
        handleFollowAction &&
        (actionLoading || actionLoading === false) && (
          <Button
            label={isFollowing ? "Unfollow" : "Follow"}
            outlined={isFollowing ? true : false}
            short
            className="py-2 my-4"
            onPress={() =>
              handleFollowAction(
                currentUser._id,
                isFollowing ? "unfollow" : "follow"
              )
            }
            loading={actionLoading}
          />
        )}
    </View>
  );
}

export default function Profile<T extends boolean>({
  currentUser,
  navigateToOtherProfile,
  pages,
  streams,
  userUrl,
  otherProfile,
  goBack,
  onEndReachedPages,
  onEndReachedStreams,
  navigateToOtherPageFromPages,
  setSelectedStream,
  handleNavigationFromStream,
  selectedStream,
  navigateToSettings,
  isVisible,
  closeSelectPageModal,
  actionLoading,
  handleFollowAction,
}: ProfileProps<T>): JSX.Element {
  const { top, bottom, left, right } = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: top,
        paddingBottom: bottom,
        paddingLeft: left,
        paddingRight: right,
      }}
    >
      <Tabs.Container
        renderHeader={() => (
          <ProfileHeader
            currentUser={currentUser}
            numFollowers={currentUser.listofFollowers.length}
            numFollowings={currentUser.listofFollowing.length}
            userUrl={userUrl}
            otherProfile={otherProfile}
            goBack={goBack}
            navigateToSettings={navigateToSettings}
            actionLoading={actionLoading}
            handleFollowAction={handleFollowAction}
          />
        )}
        headerHeight={200}
      >
        <Tabs.Tab
          name="Pages"
          label={() => <Text className="color-Black">Pages</Text>}
        >
          <View style={{ paddingHorizontal: 4 }}>
            <PagesList
              data={pages}
              navigateToPageDetails={navigateToOtherPageFromPages}
              isTab={true}
              ListEmptyComponent={() => (
                <ListEmptyComponent text="No pages created yet..." />
              )}
              onEndReached={() => {
                if (pages.length > 8) onEndReachedPages();
              }}
            />
          </View>
        </Tabs.Tab>
        <Tabs.Tab
          name="Streams"
          label={() => <Text className="color-Black">Streams</Text>}
        >
          <View style={{ paddingHorizontal: 4 }}>
            <StreamsList
              data={streams}
              navigateToPageDetails={setSelectedStream}
              isTab={true}
              ListEmptyComponent={() => (
                <ListEmptyComponent text="No streams created yet..." />
              )}
              onEndReached={() => {
                if (streams.length > 8) onEndReachedStreams();
              }}
            />
          </View>
        </Tabs.Tab>
        <Tabs.Tab
          name="Followers"
          label={() => <Text className="color-Black">Followers</Text>}
        >
          <UsersProfileList
            onPressNavigate={navigateToOtherProfile}
            userId={currentUser._id}
            isFollowersList={true}
            isTab={true}
            ListEmptyComponent={() => (
              <ListEmptyComponent text="No users followed, yet..." />
            )}
          />
        </Tabs.Tab>
        <Tabs.Tab
          name="Following"
          label={() => <Text className="color-Black">Following</Text>}
        >
          <UsersProfileList
            onPressNavigate={navigateToOtherProfile}
            userId={currentUser._id}
            isTab={true}
            ListEmptyComponent={() => (
              <ListEmptyComponent text="No users following yet..." />
            )}
          />
        </Tabs.Tab>
      </Tabs.Container>
      <SelectPageModal
        onPressNavigate={handleNavigationFromStream}
        title={selectedStream.title}
        visible={isVisible}
        closeModal={closeSelectPageModal}
      />
    </View>
  );
}
