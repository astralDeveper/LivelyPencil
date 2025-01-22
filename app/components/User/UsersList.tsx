import {
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  Pressable,
  View,
} from "react-native";
import { IUserListDisplay } from "shared/types/user/user.type";
import { Text } from "../ui";
import { Image } from "expo-image";
import UserListItemButton from "./UsersListItemButton";
import { Tabs } from "react-native-collapsible-tab-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UsersListProps
  extends Omit<FlatListProps<IUserListDisplay>, "data" | "renderItem"> {
  data: IUserListDisplay[];
  onPressNavigate: (id: string) => void;
  isTab?: boolean;
}

export default function UsersList(props: UsersListProps): JSX.Element {
  const { data, onPressNavigate, isTab = false } = props;


  // const renderItem = ({ item }: ListRenderItemInfo<IUserListDisplay>) => (
   
  //   <View
  //     className="rounded-xl p-4 justify-between items-center"
  //     style={{
  //       borderWidth: 1,
  //       borderColor: "rgba(0,0,0,0.05)",
  //       width: "49%",
  //       marginRight: "2%",
  //       marginBottom: 20,
  //       alignItems: "center",
  //     }}
  //   >
  //     <View className="items-center justify-center">
  //       <Pressable onPress={() => onPressNavigate(item._id)}>
  //         <Image
  //           source={{ uri: `${process.env.S3}/${item.profilePicture}` }}
  //           style={{
  //             width: 60,
  //             aspectRatio: 1,
  //             borderRadius: 10000,
  //           }}
  //           cachePolicy="none"
  //         />
  //       </Pressable>
  //       <Text className="font-Inter-bold color-Black">{item.fullName}</Text>
  //       <Text
  //         style={{
  //           width: 200,
  //           textAlign: "center",
  //           marginTop: 4,
  //           marginBottom: 8,
  //         }}
  //         className="color-textColor2"
  //       >
  //         @{item.nickName}
  //       </Text>
  //     </View>
  //     <UserListItemButton id={item._id} />
  //   </View>
  // );
  const renderItem = ({ item }: ListRenderItemInfo<IUserListDisplay>) => {
console.log("renderitem",item)
    return (
      <View
        className="rounded-xl p-4 justify-between items-center"
        style={{
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.05)",
          width: "49%",
          marginRight: "2%",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <View className="items-center justify-center">
          <Pressable 
          // onPress={() => {
          //   onPressNavigate(item._id)

          //   }}
          onPress={async () => {
            try {
              // Save item ID to AsyncStorage
              await AsyncStorage.setItem('ProfileselectedItemId', item._id);
        
              // Navigate after saving
              onPressNavigate(item._id);
            } catch (error) {
              console.error('Failed to save item ID to AsyncStorage:', error);
            }
          }}
            >
            {/* <Image
              source={{ uri:
                 `${process.env.S3}/${item.profilePicture}` 
                // item?.profilePicture
            
            }}
              style={{
                width: 60,
                aspectRatio: 1,
                borderRadius: 10000,
              }}
              cachePolicy="none"
            /> */}
            <Image
  source={{
    uri: item?.profilePicture?.startsWith("http")
      ? item.profilePicture
      : `${process.env.S3}/${item.profilePicture}`,
  }}
  style={{
    width: 60,
    aspectRatio: 1,
    borderRadius: 10000,
  }}
  cachePolicy="none"
/>

          </Pressable>
          <Text className="font-Inter-bold color-Black">{item.fullName}</Text>
          <Text
            style={{
              width: 200,
              textAlign: "center",
              marginTop: 4,
              marginBottom: 8,
            }}
            className="color-textColor2"
          >
            @{item.nickName}
          </Text>
        </View>
        <UserListItemButton id={item._id} />
      </View>
    );
  };
  

  return (
    <>
      {!isTab ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={{
            marginHorizontal: 20,
            marginTop: 20,
          }}
          extraData={true}
          maxToRenderPerBatch={6}
          initialNumToRender={6}
          {...props}
          data={data}
          renderItem={renderItem}
          
        />
        
      ) : (
        <Tabs.FlatList
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={{
            marginHorizontal: 20,
            marginTop: 20,
          }}
          extraData={true}
          maxToRenderPerBatch={6}
          initialNumToRender={6}
          {...props}
          data={data}
          renderItem={renderItem}
        />
      )}
    </>
  );
}
