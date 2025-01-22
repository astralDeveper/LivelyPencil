// import { useContext } from "react";
// import {
//   View,
//   FlatList,
//   Text,
//   ImageBackground,
//   Pressable,
//   Alert,
//   FlatListProps,
// } from "react-native";
// import { Tabs } from "react-native-collapsible-tab-view";
// import { SocketContext } from "screens/Socket/SocketProvider";
// import { IStream } from "shared/types/stream/streamResponse.type";
// import { bookIsLive } from "shared/util/handler";
// import { LiveBadge } from "../common/LiveBadge";

// interface StreamListProps
//   extends Omit<
//     Omit<FlatListProps<IStream>, "renderItem">,
//     "estimatedItemSize"
//   > {
//   navigateToPageDetails: (pageId: string, initialIndex?: number) => void;
//   isTab?: boolean;
// }

// export default function StreamsList(props: StreamListProps): JSX.Element {
//   const { liveBookRooms } = useContext(SocketContext);
  
//   function handlePress(item: IStream) {
//     props.navigateToPageDetails(item._id);
//   }

//   const renderItem = ({ item }: { item: IStream }) => {
// console.log("Toknow===>",item)
//     const isLive = liveBookRooms.includes(item._id.toString());
 
//     return (
//       <Pressable
//         onPress={() => handlePress(item)}
//         className="h-72 relative"
//         style={{
//           borderRadius: 8,
//           overflow: "hidden",
//           width: props.isTab ? "47%" : "48%",
//           marginTop: 8,
//           marginHorizontal: 4,
//         }}
//       >
//         <View className="absolute top-0 left-0 right-0 bottom-0 z-10" />

//         <ImageBackground
//           source={{ uri: `${process.env.S3}/${item.coverImageUrl}` }}
//           className="flex-1 bg-cover"
//         />

//         <View className="absolute top-0 left-0 right-0 bottom-0 z-50 flex-1 flex-col">
//           <View className="flex-col ml-auto bg-black/30 items-center px-2 -y-1 mt-2 justify-center -rotate-90 rounded-md">
//             <Text className=" text-white font-Inter-bold text-xs ">
//               {item.numberOfPages}
//             </Text>
//           </View>
//           {isLive && <LiveBadge />}
//           <View className="flex-1 flex-col items-center space-y-2 absolute bottom-0 right-0 left-0">
//             <Text className=" text-center font-Inter-bold text-white text-md bg-black/60 rounded-lg py-3 w-[100%] ">
//               {item.title}
//             </Text>
//           </View>
//         </View>

//         {/* {item.numberOfPages >= 1 && (
//         <View className="absolute z-50">
//           <PageMenu item={item} lastpage={item.numberOfPages} />
//         </View>
//       )} */}
//       </Pressable>
//     );
//   };

//   return (
//     <>
//       {props.isTab ? (
//         <Tabs.FlatList
//           showsVerticalScrollIndicator={false}
//           numColumns={2}
//           {...props}
//           // data={props.data}
//           data={
//             props.data?.sort(
//               (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//             )
//           }
//           renderItem={renderItem}
//         />
//       ) : (
//         <FlatList
//           showsVerticalScrollIndicator={false}
//           numColumns={2}
//           {...props}
//           // data={props.data}
//           data={
//             props.data?.sort(
//               (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//             )
//           }
//           renderItem={renderItem}
//         />
//       )}
//     </>
//   );
// }



// import { useContext, useEffect } from "react";
// import {
//   View,
//   FlatList,
//   Text,
//   ImageBackground,
//   Pressable,
//   Alert,
//   FlatListProps,
// } from "react-native";
// import { Tabs } from "react-native-collapsible-tab-view";
// import { SocketContext } from "screens/Socket/SocketProvider";
// import { IStream } from "shared/types/stream/streamResponse.type";
// import { LiveBadge } from "../common/LiveBadge";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// interface StreamListProps
//   extends Omit<
//     Omit<FlatListProps<IStream>, "renderItem">,
//     "estimatedItemSize"
//   > {
//   navigateToPageDetails: (pageId: string, initialIndex?: number) => void;
//   isTab?: boolean;
//   lib: string;
// }

// export default function StreamsList(props: StreamListProps): JSX.Element {
//   const {lib} = props
//   const { liveBookRooms } = useContext(SocketContext);
// const navigation = useNavigation()
//   useEffect(() => {
//     if (props.data && props.data.length === 0 && lib) {
//       Alert.alert(
//         "Info",
//         "No books/pages have been published in the selected language yet",
//         [
//           {
//             text: "OK",
//             onPress: () => navigation.pop(), // Navigate back on OK press
//           },
//         ],
//         { cancelable: false }
//       ); }
//   }, [props.data]);

//   function handlePress(item: IStream) {
//     props.navigateToPageDetails(item._id);
//   }

//   const renderItem = ({ item }: { item: IStream }) => {
//     const isLive = liveBookRooms.includes(item._id.toString());

    


 

//     return (
//       <Pressable
//         onPress={() => handlePress(item)}
//         className="h-72 relative"
//         style={{
//           borderRadius: 8,
//           overflow: "hidden",
//           width: props.isTab ? "47%" : "48%",
//           marginTop: 8,
//           marginHorizontal: 4,
//         }}
//       >
//         <View className="absolute top-0 left-0 right-0 bottom-0 z-10" />

//         <ImageBackground
//           source={{ uri: `${process.env.S3}/${item.coverImageUrl}` }}
//           className="flex-1 bg-cover"
//         />

//         <View className="absolute top-0 left-0 right-0 bottom-0 z-50 flex-1 flex-col">
//           <View className="flex-col ml-auto bg-black/30 items-center px-2 -y-1 mt-2 justify-center -rotate-90 rounded-md">
//             <Text className=" text-white font-Inter-bold text-xs ">
//               {item.numberOfPages}
//             </Text>
//           </View>
//           {isLive && <LiveBadge />}
//           <View className="flex-1 flex-col items-center space-y-2 absolute bottom-0 right-0 left-0">
//             <Text className=" text-center font-Inter-bold text-white text-md bg-black/60 rounded-lg py-3 w-[100%] ">
//               {item.title}
//             </Text>
//           </View>
//         </View>
//       </Pressable>
//     );
//   };

//   if (props.data && props.data.length === 0) {
//     // Skip rendering list if there are no items
//     return null;
//   }

//   return (
//     <>
//       {props.isTab ? (
//         <Tabs.FlatList
//           showsVerticalScrollIndicator={false}
//           numColumns={2}
//           {...props}
//           data={props.data?.sort(
//             (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           )}
//           renderItem={renderItem}
//         />
//       ) : (
//         <FlatList
//           showsVerticalScrollIndicator={false}
//           numColumns={2}
//           {...props}
//           data={props.data?.sort(
//             (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           )}
//           renderItem={renderItem}
//         />
//       )}
//     </>
//   );
// }


// import { useContext, useEffect } from "react";
// import {
//   View,
//   FlatList,
//   Text,
//   ImageBackground,
//   Pressable,
//   Alert,
//   FlatListProps,
// } from "react-native";
// import { Tabs } from "react-native-collapsible-tab-view";
// import { SocketContext } from "screens/Socket/SocketProvider";
// import { IStream } from "shared/types/stream/streamResponse.type";
// import { LiveBadge } from "../common/LiveBadge";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// interface StreamListProps
//   extends Omit<
//     Omit<FlatListProps<IStream>, "renderItem">,
//     "estimatedItemSize"
//   > {
//   navigateToPageDetails: (pageId: string, initialIndex?: number) => void;
//   isTab?: boolean;
//   lib: string;
// }

// export default function StreamsList(props: StreamListProps): JSX.Element {
//   const { lib } = props;
//   const { liveBookRooms } = useContext(SocketContext);
//   const navigation = useNavigation();
  
   


//   useEffect(() => {
//     // Save the list data to AsyncStorage
//     const saveDataToAsyncStorage = async () => {
//       if (props.data && props.data.length > 0) {
//         try {
//           await AsyncStorage.setItem(
//             "flatlistData",
//             JSON.stringify(props.data)
//           );
//         } catch (error) {
//           console.error("Failed to save data to AsyncStorage:", error);
//         }
//       }
//     };

//     saveDataToAsyncStorage();
//   }, [props.data]);

//   useEffect(() => {
//     if (props.data && props.data.length === 0 && lib) {
//       Alert.alert(
//         "Info",
//         "No books/pages have been published in the selected language yet",
//         [
//           {
//             text: "OK",
//             onPress: () => navigation.pop(), // Navigate back on OK press
//           },
//         ],
//         { cancelable: false }
//       );
//     }
//   }, [props.data]);

//   function handlePress(item: IStream) {
//     props.navigateToPageDetails(item._id);
//     // console.log("object",item)

//   }
  
//   const renderItem = ({ item }: { item: IStream }) => {
//     const isLive = liveBookRooms.includes(item._id.toString());

// console.log("Booksrender",item)

//     return (
//       <Pressable
//         onPress={() => handlePress(item)}
//         className="h-72 relative"
//         style={{
//           borderRadius: 8,
//           overflow: "hidden",
//           width: props.isTab ? "47%" : "48%",
//           marginTop: 8,
//           marginHorizontal: 4,
//         }}
//       >
//         <View className="absolute top-0 left-0 right-0 bottom-0 z-10" />

//         <ImageBackground
//           source={{ uri: `${process.env.S3}/${item.coverImageUrl}` }}
//           className="flex-1 bg-cover"
//         />

//         <View className="absolute top-0 left-0 right-0 bottom-0 z-50 flex-1 flex-col">
//           <View className="flex-col ml-auto bg-black/30 items-center px-2 -y-1 mt-2 justify-center -rotate-90 rounded-md">
//             <Text className=" text-white font-Inter-bold text-xs ">
//               {item.numberOfPages}
//             </Text>
//           </View>
//           {isLive && <LiveBadge />}
//           <View className="flex-1 flex-col items-center space-y-2 absolute bottom-0 right-0 left-0">
//             <Text className=" text-center font-Inter-bold text-white text-md bg-black/60 rounded-lg py-3 w-[100%] ">
//               {item.title}
//             </Text>
//           </View>
//         </View>
//       </Pressable>
//     );
//   };

//   if (props.data && props.data.length === 0) {
//     // Skip rendering list if there are no items
//     return null;
//   }

//   return (
//     <>
//       {props.isTab ? (
//         <Tabs.FlatList
//           showsVerticalScrollIndicator={false}
//           numColumns={2}
//           {...props}
//           data={props.data?.sort(
//             (a, b) =>
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           )}
//           renderItem={renderItem}
//         />
//       ) : (
//         <FlatList
//           showsVerticalScrollIndicator={false}
//           numColumns={2}
//           {...props}
//           data={props.data?.sort(
//             (a, b) =>
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           )}
//           renderItem={renderItem}
//         />
//       )}
//     </>
//   );
// }


import { useContext, useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ImageBackground,
  Pressable,
  Alert,
  FlatListProps,
} from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { SocketContext } from "screens/Socket/SocketProvider";
import { IStream } from "shared/types/stream/streamResponse.type";
import { LiveBadge } from "../common/LiveBadge";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StreamListProps
  extends Omit<FlatListProps<IStream>, "renderItem"> {
  navigateToPageDetails: (pageId: string, initialIndex?: number) => void;
  isTab?: boolean;
  lib: string;
}

export default function StreamsList(props: StreamListProps): JSX.Element {
  const { lib } = props;
  const { liveBookRooms } = useContext(SocketContext);
  const navigation = useNavigation();
  
  // Local state for the data
  const [data, setData] = useState<IStream[]>(props.data || []);

  useEffect(() => {
    // Update local state when props.data changes
    if (props.data && props.data.length > 0) {
      setData(props.data);
    }
  }, [props.data]);

  useEffect(() => {
    // Save the list data to AsyncStorage when the data changes
    const saveDataToAsyncStorage = async () => {
      if (data && data.length > 0) {
        try {
          await AsyncStorage.setItem("flatlistData", JSON.stringify(data));
        } catch (error) {
          console.error("Failed to save data to AsyncStorage:", error);
        }
      }
    };

    saveDataToAsyncStorage();
  }, [data]);

  useEffect(() => {
    if (data.length === 0 && lib) {
      Alert.alert(
        "Info",
        "No books/pages have been published in the selected language yet",
        [
          {
            text: "OK",
            onPress: () => navigation.pop(),
          },
        ],
        { cancelable: false }
      );
    }
  }, [data, lib, navigation]);

  function handlePress(item: IStream) {
    props.navigateToPageDetails(item._id);
  }

  const renderItem = ({ item }: { item: IStream }) => {
    const isLive = liveBookRooms.includes(item._id.toString());

    return (
      <Pressable
        onPress={() => handlePress(item)}
        className="h-72 relative"
        style={{
          borderRadius: 8,
          overflow: "hidden",
          width: props.isTab ? "47%" : "48%",
          marginTop: 8,
          marginHorizontal: 4,
        }}
      >
        <View className="absolute top-0 left-0 right-0 bottom-0 z-10" />

        <ImageBackground
          source={{ uri: `${process.env.S3}/${item.coverImageUrl}` }}
          className="flex-1 bg-cover"
        />

        <View className="absolute top-0 left-0 right-0 bottom-0 z-50 flex-1 flex-col">
          <View className="flex-col ml-auto bg-black/30 items-center px-2 -y-1 mt-2 justify-center -rotate-90 rounded-md">
            <Text className=" text-white font-Inter-bold text-xs ">
              {item.numberOfPages}
            </Text>
          </View>
          {isLive && <LiveBadge />}
          <View className="flex-1 flex-col items-center space-y-2 absolute bottom-0 right-0 left-0">
            <Text className=" text-center font-Inter-bold text-white text-md bg-black/60 rounded-lg py-3 w-[100%] ">
              {item.title}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  if (data && data.length === 0) {
    return null;
  }

  return (
    <>
      {props.isTab ? (
        <Tabs.FlatList
          showsVerticalScrollIndicator={false}
          numColumns={2}
          {...props}
          data={data?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )}
          renderItem={renderItem}
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={2}
          {...props}
          data={data?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )}
          renderItem={renderItem}
        />
      )}
    </>
  );
}
