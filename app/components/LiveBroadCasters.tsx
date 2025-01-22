import { View, Text, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useContext } from "react";
import {
  SocketContext,
  SocketContextType,
} from "../screens/Socket/SocketProvider";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "shared/hooks/useRedux";
import { HomeStackNavigatorProps } from "shared/navigators/HomeStackNavigator";
import { IConnectedUser, ILiveUser } from "shared/types/user/user.type";

export const LiveBroadCasters = () => {
  const { liveBookSocket } = useContext(SocketContext) as SocketContextType;
  const navigation = useNavigation<HomeStackNavigatorProps>();
  const liveUsers = useAppSelector((state) => state.socket.liveUsers);
  const liveRooms = useAppSelector((state) => state.socket.liveRooms);
  const userId = useAppSelector((state) => state.auth.user?._id);

  const livebroadCasters: (ILiveUser & IConnectedUser)[] = liveRooms.reduce(
    (acc: (ILiveUser & IConnectedUser)[], item1) => {
      const item2 = liveUsers.find((item) => item.email === item1.email);
      if (item2) {
        acc.push({ ...item1, ...item2 }); // Merge properties of both objects
      }
      return acc;
    },
    []
  );

  function handleJoin(item: ILiveUser & IConnectedUser) {
    liveBookSocket.emit("join_live_book", {
      bookId: item._id,
      userId,
    }); 
    navigation.navigate("PageStack", {
      screen: "Preview",
      params: {
        shortCode: item?.fullName,
        coverImageUrl: item.coverImageUrl,
        id: item._id,
        title: item.title,
      },
      
    });
  }

  if (livebroadCasters.length === 0) return null;

  // console.log("livebroadCasters",livebroadCasters)

  return (
    <View>
      {
        <View className="flex-row space-x-0.5 py-2">
          <ScrollView horizontal>
            {livebroadCasters?.map((user, index) => (
              <View style={{
                paddingHorizontal:10
              }}>
              <Pressable
                onPress={() => handleJoin(user)}
                className="  border-purple-600 border-4 rounded-full"
                key={index}
              >
                <Text className="bg-purple-600 rounded-full font-Inter-Black text-white text-xs z-20 absolute px-2 bottom-0">
                  Live
                </Text>
                <Image
                  source={
                    // /\bfile\b/.test(user.profilePicture)
                    //   ? user.profilePicture
                    //   : `${process.env.S3}/${user.profilePicture}`
                    user?.profilePicture?.startsWith("http")
      ? user.profilePicture
      : `${process.env.S3}/${user.profilePicture}`
                  }
                  className=" rounded-full w-16 h-16  "
                />
              </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      }
    </View>
  );
};

