// // components
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  Pressable,
  FlatList,
} from "react-native";

import { Image } from "expo-image";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
// $&
import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "@env";
import store from "store";
import { useState } from "react";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import { useNavigation } from "@react-navigation/native";
// For Date in statics
const options = {
  year: "numeric",
  month: "short",
  day: "2-digit",
};
const BookList = () => {
  const navigation = useNavigation();
  const { currentUser } = store();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function update() {
    setLoading(true);
    const res = await axios
      .get(
        `${API_URL}/books/getAllBooksByAuthor?populate=${currentUser.user.id}&sortBy=createdAt:desc&limit=100`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },
        }
      )
      .finally(() => {
        setLoading(false);
      });
    setData(res.data.results);
  }
  //Delete Book
  async function deleteBook(id) {
    await axios
      .delete(`${API_URL}/books/deleteBook/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })

      .catch(({ message }) => console.log(message));
    update();
  }

  const renderItem = ({ item }) => {
    return (
      <View>
        <Pressable
          onPress={() => navigation.navigate("BookPages", { book: item })}
        >
          <View className="bg-white m-2 p-4 justify-between  flex-row items-center ">
            <View className="rounded-full  justify-center items-center">
              <Image
                cachePolicy="memory-disk"
                source={{
                  // uri: `${API_URL}/s3/getMedia/${
                  uri: `${process.env.S3}/${
                    item.coverImageUrl + "?" + new Date()
                  }`,
                }}
                className="w-28 h-28"
              />
            </View>
            <View className="w-[50%] ">
              <Text className="text-[#087FFF] font-Inter-bold text-lg">
                {item.title}
              </Text>
              <Text className="text-sm font-Inter-Black">
                {item?.description}
              </Text>
            </View>
            <View>
              <FontAwesome5
                name="edit"
                size={24}
                color="#087FFF"
                // Moving to other screen and also passing data
              />
            </View>
          </View>
        </Pressable>
        {/* Card Bottom */}
        <View className="flex-row justify-between mx-2">
          <Pressable
            onPress={() => navigation.navigate("EditBook", { book: item })}
            className="flex-row items-center space-x-1"
          >
            <Feather name="settings" size={16} color="black" />
            <Text>Stream Settings</Text>
          </Pressable>
          <View>
            <Text
              onPress={() => {
                const created = new Date(item?.createdAt);
                const updated = new Date(item?.updatedAt);
                Alert.alert(
                  "Stream Statics",
                  `Total Pages : ${
                    item?.numberOfPages
                  }\nCreated : ${created.toLocaleDateString(
                    "en-GB",
                    options
                  )}\nUpdated : ${updated.toLocaleDateString("en-GB", options)}`
                );
              }}
            >
              View Stream Statics
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // const { data, isValidating } = useSWR("/Booklist", () => update());
  useEffect(() => {
    const handleFocus = () => {
      update();
    };
    //Note: This will track user focus and execute update function when ever user is focusing this component
    const unsubscribe = navigation.addListener("focus", handleFocus);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View className="w-10 h-4 items-center m-auto">
        <LottieView resizeMode="cover" source={Load} autoPlay loop />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "white",
      }}
    >
      {/* Header */}

      <View className=" flex-row justify-between mt-2 mx-5 border-b border-gray-300 pb-3 ">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="bookshelf" size={24} color="gray" />
          <Text
            onPress={() => console.log(currentUser)}
            className="font-Inter-medium text-lg text-gray-500"
          >
            Streams
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("CreateBook")}
          className="flex-row items-center"
        >
          <Ionicons name="add-circle" size={24} color="#087FFF" />
          <Text className=" text-md text-gray-500 font-Inter-bold">
            Create Stream
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        ListEmptyComponent={
          data?.length == 0 && (
            <Text className="mx-auto text-gray-500 mt-20 font-Inter-bold">
              No Stream created yet
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
};

export default BookList;
// // // components
// import {
//   View,
//   Text,
//   SafeAreaView,
//   StatusBar,
//   Alert,
//   Pressable,
//   useWindowDimensions,
//   RefreshControl,
//   ScrollView,
// } from "react-native";
// import { Image } from "expo-image";
// import {
//   MaterialCommunityIcons,
//   Ionicons,
//   FontAwesome5,
//   Feather,
//   AntDesign,
// } from "@expo/vector-icons";
// $&
// import { useEffect } from "react";
// import axios from "axios";
// import { API_URL } from "@env";
// import store from "store";
// import { useState } from "react";

// import useSWR, { mutate } from "swr";

// // For Date in statics
// const options = {
//   year: "numeric",
//   month: "short",
//   day: "2-digit",
// };
// const BookList = () => {
//   const { height } = useWindowDimensions("window");
//   const navigation = useNavigation();
//   const { currentUser } = store();
//   const [data, setData] = useState([]);
//   async function update() {
//     const res = await axios.get(
//       `${API_URL}/books/getAllBooksByAuthor?populate=${currentUser.user.id}&sortBy=createdAt:desc&limit=100`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentUser.tokens.access.token}`,
//         },
//       }
//     );
//     setData(res.data.results);
//   }
//   //Delete Book
//   async function deleteBook(id) {
//     await axios
//       .delete(`${API_URL}/books/deleteBook/${id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentUser.tokens.access.token}`,
//         },
//       })

//       .catch(({ message }) => console.log(message));
//     update();
//   }

//   // const { data, isValidating } = useSWR("/Booklist", () => update());
//   useEffect(() => {
//     const handleFocus = () => {
//       update();
//     };
//     //Note: This will track user focus and execute update function when ever user is focusing this component
//     const unsubscribe = navigation.addListener("focus", handleFocus);
//     return unsubscribe;
//   }, [navigation]);

//   console.log("💙 Book Pages Screen 💙");
//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         // marginTop: StatusBar.currentHeight || 0,
//         backgroundColor: "white",
//       }}
//     >
//       {/* Header */}
//       <ScrollView
//         // refreshControl={<RefreshControl refreshing={isValidating} />}
//         style={{ height }}
//         // onEnded={() => mutate()}
//       >
//         <View className=" flex-row justify-between mt-2 mx-5 border-b border-gray-300 pb-3 ">
//           <View className="flex-row items-center">
//             <MaterialCommunityIcons name="bookshelf" size={24} color="gray" />
//             <Text className="font-Inter-medium text-lg text-gray-500">
//               Streams
//             </Text>
//           </View>
//           <Pressable
//             onPress={() => navigation.navigate("CreateBook")}
//             className="flex-row items-center"
//           >
//             <Ionicons name="add-circle" size={24} color="#087FFF" />
//             <Text className=" text-md text-gray-500 font-Inter-bold">
//               Create Stream
//             </Text>
//           </Pressable>
//         </View>

//         {data?.map((obj) => (
//           <View key={obj._id}>
//             {/* Body */}
//             {/* Card */}
//             <View>
//               <Pressable
//                 onPress={() => navigation.navigate("BookPages", { book: obj })}
//               >
//                 <View className="bg-white m-2 p-4 justify-between  flex-row items-center ">
//                   <View className="rounded-full  justify-center items-center">
//                     <Image
//                       source={{
//                         uri:
//                           obj.coverImageUrl &&
//                           `${API_URL}/s3/getMedia/${obj.coverImageUrl}`,
//                       }}
//                       cachePolicy="none"
//                       contentFit="cover"
//                       className="h-28 w-28"
//                     />
//                   </View>
//                   <View className="w-[50%] ">
//                     <Text className="text-[#087FFF] font-Inter-bold text-lg">
//                       {obj.title}
//                     </Text>
//                     <Text className="text-sm font-Inter-Black">
//                       {obj?.description}
//                     </Text>
//                   </View>
//                   <View>
//                     <FontAwesome5
//                       name="edit"
//                       size={24}
//                       color="#087FFF"
//                       // Moving to other screen and also passing data
//                     />
//                   </View>
//                 </View>
//               </Pressable>
//               {/* Card Bottom */}
//               <View className="flex-row justify-between mx-2">
//                 <Pressable
//                   // onPress={() => navigation.navigate("EditBook")}
//                   onPress={() => console.log(obj)}
//                   className="flex-row items-center space-x-1"
//                 >
//                   <Feather name="settings" size={16} color="black" />
//                   <Text>Stream Settings</Text>
//                 </Pressable>
//                 <View>
//                   <Text
//                     onPress={() => {
//                       const created = new Date(obj?.createdAt);
//                       const updated = new Date(obj?.updatedAt);
//                       Alert.alert(
//                         "Stream Statics",
//                         `Total Pages : ${
//                           obj?.numberOfPages
//                         }\nCreated : ${created.toLocaleDateString(
//                           "en-GB",
//                           options
//                         )}\nUpdated : ${updated.toLocaleDateString(
//                           "en-GB",
//                           options
//                         )}`
//                       );
//                     }}
//                   >
//                     View Book Statics
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//       {/* Card End */}
//     </SafeAreaView>
//   );
// };

// export default BookList;
