import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import axios from "axios";
import store from "store";
// $&
// $&
import Ionicons from "@expo/vector-icons/Ionicons";
import { API_URL } from "@env";
import clsx from "clsx";
import { Picker } from "@react-native-picker/picker";

export default function EditBook() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [pickedImage, setPickedImage] = useState(null); // Image to show on screen
  const [title, setTitle] = useState(params?.book?.title);
  const [description, setDescription] = useState(params?.book?.description);
  const { currentUser } = store();
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedItem] = useState(params.book.categoryId);
  const [categoryId, setCategoryId] = useState([]);

  const pickCoverImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (result.granted === false) {
      alert("Permission to access camera roll is required!");
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
    console.log(pickedImage, filename);
    // Add the image data to the form data
    formData.append("file", { uri: localUri, name: filename, type });
    await axios
      .put(`${API_URL}/s3/updateMedia/${params.book.coverImageUrl}`, formData, {
        headers: {
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log("Cover Img Updated: ", response.data);
      })
      .catch((e) => console.log(e));
  }

  async function updateBook() {
    let data = JSON.stringify({
      _id: params.book._id,
      title,
      description,
      categoryId: selectedValue,
    });
    setLoading(true);
    await axios
      .put(`${API_URL}/books/updateBook`, data, {
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        console.log(response.data);
        pickedImage && updateCover();
        setLoading(false);
        navigation.goBack();
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  async function getAllCategories() {
    await axios
      .get(
        `${API_URL}/categories/getAllCategories?page=1&limit=100&sortBy=title:asc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.tokens.access.token}`,
          },
        }
      )
      .then((res) => {
        const data = res.data.map((c) => ({
          id: c._id,
          category:
            c.categoryName.charAt(0).toUpperCase() + c.categoryName.slice(1),
        }));
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
    <SafeAreaView
      style={{
        // marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <View className="ml-2 bg-white ">
        <Ionicons
          onPress={() => navigation.goBack()}
          name="chevron-back-sharp"
          size={32}
          color="#6687c4"
        />
      </View>

      <View>
        <View className="m-auto  ">
          <Text className="text-Primary font-Inter-bold text-2xl">
            Edit Stream
          </Text>
        </View>
        {pickedImage ? (
          <View className="mx-auto w-52 h-64 justify-center rounded-lg ">
            <Image
              source={{ uri: pickedImage }}
              className=" w-52 h-64 rounded-lg"
            />
          </View>
        ) : (
          <Pressable
            onPress={() => pickCoverImg()}
            className="mx-auto w-52 h-64 justify-center border border-gray-300 rounded-lg"
          >
            {/* TODO: UNCOMMENT BEFORE BUILD */}
            {/* <Image
              source={{
                uri: `${API_URL}/s3/getMedia/${params.book.coverImageUrl}`,
              }}
              className=" w-52 h-64 rounded-lg"
            /> */}
            <Text className="text-center text-gray-400">
              Tap to change cover
            </Text>
          </Pressable>
        )}
      </View>

      <View className="flex-row items-center space-x-3 mt-2">
        <View className="flex-row border border-gray-300 rounded-lg w-[90%] mx-auto">
          <TextInput
            maxLength={32}
            onChangeText={(value) => setTitle(value)}
            placeholder={params.book.title}
            className="text-gray-500 px-2 py-3  flex-1 mx-4"
            placeholderTextColor={"#9CA3AF"}
          />
        </View>
      </View>
      <Text className="text-right w-[90%] text-xs text-gray-400">
        {title.length}/32
      </Text>
      <View className="flex-row items-center space-x-3 mt-0.5">
        <View className="flex-row border border-gray-300 rounded-lg w-[90%] mx-auto">
          <TextInput
            maxLength={64}
            onChangeText={(value) => setDescription(value)}
            placeholder={params.book.description}
            className="text-gray-500 px-2 py-3  flex-1 mx-4"
            placeholderTextColor={"#9CA3AF"}
          />
        </View>
      </View>
      <Text className="text-right w-[90%] text-xs text-gray-400">
        {description.length}/64
      </Text>
      <View className="mt-0.5 border mx-auto border-gray-300 rounded-lg px-3 w-[90%] ">
        <Picker
          selectedValue={selectedValue}
          style={{
            height: 50,
            width: "100%",
            borderWidth: 2,

            borderColor: "#9CA3AF",
          }}
          onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}
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
      </View>
      <Pressable
        disabled={loading}
        onPress={() => updateBook()}
        className={clsx(
          " mt-8 mx-auto bg-Primary w-[70%] items-center px-2 py-2 rounded-xl",
          {
            "bg-slate-400": loading,
          }
        )}
      >
        <Text className="text-white text-">Edit Stream</Text>
      </Pressable>
    </SafeAreaView>
  );
}
