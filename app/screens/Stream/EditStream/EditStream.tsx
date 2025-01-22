import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import clsx from "clsx";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAppSelector } from "shared/hooks/useRedux";
import { EditStreamRouteProp } from "shared/navigators/StreamStackNavigator";
import { Button, CustomKeyboardScrollView } from "app/components/ui";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  useDeleteStreamMutation,
  useUpdateStreamMutation,
} from "shared/apis/streams/streamsApi";
import { apiHandler } from "shared/util/handler";
import { LanguageList } from "shared/util/constants";

// params -> description, id, title, categoryId, coverImage, language
export default function EditStream() {
  const { params } = useRoute<EditStreamRouteProp>();
  const navigation = useNavigation();
  const [pickedImage, setPickedImage] = useState(null);
  const [title, setTitle] = useState(params.title);
  const [description, setDescription] = useState(params.description);
  const token = useAppSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(params.categoryId);
  const [selectedName, setSelectedName] = useState("Category");
  const [categoryId, setCategoryId] = useState([]);
  const [openCategory, setOpenCategory] = useState<boolean>(false);
  const [openLanguage, setOpenLanguage] = useState<boolean>(false);
  const [language, setLanguage] = useState<
    (typeof LanguageList)[keyof typeof LanguageList]
  >(params.language);
  const languages = useAppSelector((state) => state.util.languages);
  const [updateStream, { data, isLoading, error }] = useUpdateStreamMutation();
  const [
    deleteStream,
    { data: deleteData, isLoading: deleteLoading, error: deleteError },
  ] = useDeleteStreamMutation();

  useEffect(() => {
    apiHandler({
      data,
      error,
      showSuccess: true,
      onSuccess(_) {
        navigation.goBack();
      },
    });
  }, [data, error]);

  useEffect(() => {
    apiHandler({
      data: deleteData,
      error: deleteError,
      showSuccess: true,
      onSuccess(_) {
        navigation.goBack();
      },
    });
  }, [deleteData, deleteError]);

  const pickCoverImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (result.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }
    if (result.canceled) {
      return setPickedImage(null);
    }
    if (result.assets?.length > 0) {
      setPickedImage(result.assets[0].uri);
    }
  };

  async function updateCover() {
    let formData = new FormData();
    let localUri = pickedImage;
    let filename = pickedImage.split("/").pop();
    let type = "image/jpeg";
    // Add the image data to the form data
    formData.append("file", { uri: localUri, name: filename, type });
    await axios
      .put(
        `${process.env.EXPO_PUBLIC_API_URL}/s3/updateMedia/${params.coverImageUrl}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .catch((e) => console.log(e));
  }

  function deleteBook() {
    console.log(params.id);
    Alert.alert(
      "Are you sure?",
      "Are you sure you want to delete this masterpiece?",
      [
        {
          text: "Yes",
          onPress: () => deleteStream(params.id),
          style: "destructive",
        },
        {
          text: "No",
          isPreferred: true,
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  }

  function updateBook() {
    if (pickedImage) updateCover();
    updateStream({
      description,
      categoryId: selectedValue,
      language,
      title,
      _id: params.id,
    });
  }

  async function getAllCategories() {
    await axios
      .get(
        `${process.env.EXPO_PUBLIC_API_URL}/categories/getAllCategories?page=1&limit=100&sortBy=title:asc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const data = res.data.map((c) => {
          if (c._id === params.categoryId)
            setSelectedName(
              c.categoryName.charAt(0).toUpperCase() + c.categoryName.slice(1)
            );
          return {
            id: c._id,
            category:
              c.categoryName.charAt(0).toUpperCase() + c.categoryName.slice(1),
          };
        });
        data.unshift({
          id: null,
          category: "Select Category",
        });
        setCategoryId(data);
      })
      .catch((e) => console.log(e.message));
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <CustomKeyboardScrollView
      contentContainerStyle={{
        backgroundColor: "white",
        paddingHorizontal: 20,
        justifyContent: "space-between",
      }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        {params.coverImageUrl ? (
          <TouchableOpacity
            className="mx-auto justify-center rounded-lg "
            style={{ width: "100%" }}
            onPress={pickCoverImg}
          >
            <Image
              source={{ uri: `${process.env.S3}/${params.coverImageUrl}` }}
              style={{
                width: "100%",
                height: 350,
                borderRadius: 12,
                resizeMode: "contain",
                overflow: "hidden",
              }}
            />
          </TouchableOpacity>
        ) : pickedImage ? (
          <TouchableOpacity
            className="mx-auto justify-center rounded-lg "
            style={{ width: "100%" }}
            onPress={pickCoverImg}
          >
            <Image
              source={{ uri: pickedImage }}
              style={{
                width: "100%",
                height: 350,
                borderRadius: 12,
                resizeMode: "contain",
                overflow: "hidden",
              }}
            />
          </TouchableOpacity>
        ) : (
          <Pressable
            onPress={pickCoverImg}
            className="bg-textField justify-center border border-gray-300 rounded-lg radius-6"
            style={{ width: "100%", height: 350 }}
          >
            <Text className="text-center text-gray-400">Tap to pick cover</Text>
          </Pressable>
        )}

        <View className="flex-row items-center space-x-3 mt-4 bg-textField">
          <View className="flex-row border border-gray-300 rounded-lg mx-auto">
            <TextInput
              maxLength={32}
              onChangeText={(value) => setTitle(value)}
              placeholder="Stream Title"
              className="text-gray-500 px-2 py-3  flex-1 mx-4"
              placeholderTextColor={"#9CA3AF"}
              value={title}
            />
          </View>
        </View>
        <Text className="text-right text-xs text-gray-400">
          {title.length}/32
        </Text>
        <View className="flex-row items-center space-x-3 mt-0.5 bg-textField ">
          <View className="flex-row border border-gray-300 rounded-lg mx-auto">
            <TextInput
              maxLength={64}
              onChangeText={(value) => setDescription(value)}
              placeholder="Description"
              className="text-gray-500 px-2 py-3  flex-1 mx-4"
              placeholderTextColor={"#9CA3AF"}
              value={description}
            />
          </View>
        </View>
        <Text className="text-right text-xs text-gray-400">
          {description.length}/64
        </Text>
        <Pressable
          className="mt-0.5 border mx-auto border-gray-300 rounded-lg bg-textField"
          style={{ width: "100%", padding: 12, paddingHorizontal: 24 }}
          onPress={() => setOpenCategory(true)}
        >
          <Text style={{}}>{selectedName}</Text>
        </Pressable>
        <Pressable
          className="mt-4 border mx-auto border-gray-300 rounded-lg bg-textField"
          style={{ width: "100%", padding: 12, paddingHorizontal: 24 }}
          onPress={() => setOpenLanguage(true)}
        >
          <Text style={{}}>{language}</Text>
        </Pressable>
        {openCategory && (
          <Picker
            selectedValue={selectedValue}
            style={{
              width: "100%",
              backgroundColor: "#fff",
              height: 200,
              position: "absolute",
              bottom: 0,
            }}
            onValueChange={(itemValue) => {
              categoryId.find((item) => {
                if (item.id === itemValue) {
                  setSelectedName(item.category);
                }
              });
              setSelectedValue(itemValue);
              setOpenCategory(false);
            }}
          >
            {categoryId.map((item) => (
              <Picker.Item
                key={item.id}
                label={item.category}
                value={item.id}
                style={{ color: "#9CA3AF" }}
              />
            ))}
          </Picker>
        )}
        {openLanguage && (
          <Picker
            selectedValue={language}
            style={{
              width: "100%",
              backgroundColor: "#fff",
              height: 200,
              position: "absolute",
              bottom: 0,
            }}
            onValueChange={(itemValue) => {
              setLanguage(itemValue);
              setOpenLanguage(false);
            }}
          >
            {languages.map((item) => (
              <Picker.Item
                key={item}
                label={item}
                value={item}
                style={{ color: "#9CA3AF" }}
              />
            ))}
          </Picker>
        )}
      </View>
      <Button
        disabled={
          title.length == 0 ||
          loading ||
          selectedValue === null ||
          description === null ||
          isLoading
        }
        onPress={updateBook}
        label="Update Stream"
        className="mt-8"
        loading={isLoading}
      />
      <Button
        onPress={deleteBook}
        label="Delete Stream"
        className="mt-4 bg-red border-0"
        loading={deleteLoading}
      />
    </CustomKeyboardScrollView>
  );

  //   return (
  //     <SafeAreaView
  //       style={{
  //         // marginTop: StatusBar.currentHeight || 0,
  //         backgroundColor: "white",
  //         flex: 1,
  //       }}
  //     >
  //       <View className="ml-2 bg-white ">
  //         <Ionicons
  //           onPress={() => navigation.goBack()}
  //           name="chevron-back-sharp"
  //           size={32}
  //           color="#6687c4"
  //         />
  //       </View>

  //       <View>
  //         <View className="m-auto  ">
  //           <Text className="text-Primary font-Inter-bold text-2xl">
  //             Edit Stream
  //           </Text>
  //         </View>
  //         {pickedImage ? (
  //           <View className="mx-auto w-52 h-64 justify-center rounded-lg ">
  //             <Image
  //               source={{ uri: pickedImage }}
  //               className=" w-52 h-64 rounded-lg"
  //             />
  //           </View>
  //         ) : (
  //           <Pressable
  //             onPress={() => pickCoverImg()}
  //             className="mx-auto w-52 h-64 justify-center border border-gray-300 rounded-lg"
  //           >
  //             {/* TODO: UNCOMMENT BEFORE BUILD */}
  //             {/* <Image
  //               source={{
  //                 uri: `${process.env.EXPO_PUBLIC_API_URL}/s3/getMedia/${params.book.coverImageUrl}`,
  //               }}
  //               className=" w-52 h-64 rounded-lg"
  //             /> */}
  //             <Text className="text-center text-gray-400">
  //               Tap to change cover
  //             </Text>
  //           </Pressable>
  //         )}
  //       </View>

  //       <View className="flex-row items-center space-x-3 mt-2">
  //         <View className="flex-row border border-gray-300 rounded-lg w-[90%] mx-auto">
  //           <TextInput
  //             maxLength={32}
  //             onChangeText={(value) => setTitle(value)}
  //             placeholder={params.title}
  //             className="text-gray-500 px-2 py-3  flex-1 mx-4"
  //             placeholderTextColor={"#9CA3AF"}
  //           />
  //         </View>
  //       </View>
  //       <Text className="text-right w-[90%] text-xs text-gray-400">
  //         {title.length}/32
  //       </Text>
  //       <View className="flex-row items-center space-x-3 mt-0.5">
  //         <View className="flex-row border border-gray-300 rounded-lg w-[90%] mx-auto">
  //           <TextInput
  //             maxLength={64}
  //             onChangeText={(value) => setDescription(value)}
  //             placeholder={params.description}
  //             className="text-gray-500 px-2 py-3  flex-1 mx-4"
  //             placeholderTextColor={"#9CA3AF"}
  //           />
  //         </View>
  //       </View>
  //       <Text className="text-right w-[90%] text-xs text-gray-400">
  //         {description.length}/64
  //       </Text>
  //       <View className="mt-0.5 border mx-auto border-gray-300 rounded-lg px-3 w-[90%] ">
  //         <Picker
  //           selectedValue={selectedValue}
  //           style={{
  //             height: 50,
  //             width: "100%",
  //             borderWidth: 2,

  //             borderColor: "#9CA3AF",
  //           }}
  //           onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}
  //         >
  //           {categoryId.map((item) => (
  //             <Picker.Item
  //               key={item.id}
  //               label={item.category}
  //               value={item.id}
  //               style={{ color: "#9CA3AF" }}
  //             />
  //           ))}
  //         </Picker>
  //       </View>
  //       <Pressable
  //         disabled={loading}
  //         onPress={() => updateBook()}
  //         className={clsx(
  //           " mt-8 mx-auto bg-Primary w-[70%] items-center px-2 py-2 rounded-xl",
  //           {
  //             "bg-slate-400": loading,
  //           }
  //         )}
  //       >
  //         <Text className="text-white text-">Edit Stream</Text>
  //       </Pressable>
  //     </SafeAreaView>
  //   );
}
