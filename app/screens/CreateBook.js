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
import Ionicons from "@expo/vector-icons/Ionicons";
import { API_URL } from "@env";
import clsx from "clsx";
import { Picker } from "@react-native-picker/picker";
import { ToastAndroid } from "react-native";

// const categoryId = [
//   {
//     id: null,
//     category: "Select Category",
//   },
//   {
//     id: "6454930c0621eb48e4b60dc1",
//     category: "News",
//   },

//   {
//     id: "645493300621eb48e4b60dc4",
//     category: "Sports",
//   },
//   {
//     id: "645493a50621eb48e4b60dcd",
//     category: "Comics",
//   },
//   {
//     id: "645493b10621eb48e4b60dcf",
//     category: "Stories",
//   },
//   {
//     id: "64bd02d5dc65ae304c86d9ed",
//     category: "Business",
//   },
//   {
//     id: "6454939c0621eb48e4b60dcb",
//     category: "Magazine",
//   },
//   {
//     id: "6454935d0621eb48e4b60dc7",
//     category: "Education",
//   },
//   {
//     id: "645493630621eb48e4b60dc9",
//     category: "Health",
//   },
//   {
//     id: "64b7ec5c1e5b317f6feb65dd",
//     category: "Manga",
//   },
//   {
//     id: "64b7eddc1e5b317f6feb65df",
//     category: "Travel",
//   },
//   {
//     id: "64b7efa71e5b317f6feb65e1",
//     category: "Game",
//   },
//   {
//     id: "64b7eff41e5b317f6feb65e3",
//     category: "Movie",
//   },
//   {
//     id: "64d9f814b545945cfaa1f478",
//     category: "Food",
//   },
//   {
//     id: "64d9f846b545945cfaa1f47a",
//     category: "A.I",
//   },
//   {
//     id: "64d9f861b545945cfaa1f47c",
//     category: "History",
//   },
//   {
//     id: "64d9f878b545945cfaa1f47e",
//     category: "Tech",
//   },
//   {
//     id: "64d9f88ab545945cfaa1f480",
//     category: "Life",
//   },
//   {
//     id: "64d9f8b3b545945cfaa1f482",
//     category: "Science",
//   },
//   {
//     id: "650a60b065610918c4a3c575",
//     category: "Nature",
//   },
//   {
//     id: "650a60df65610918c4a3c577",
//     category: "Review",
//   },
//   {
//     id: "650a60f965610918c4a3c579",
//     category: "Fashion",
//   },
//   {
//     id: "650a611b65610918c4a3c57b",
//     category: "Shop",
//   },
//   {
//     id: "650a62b365610918c4a3c57f",
//     category: "Poem",
//   },
// ];
export default function CreateBook() {
  const navigation = useNavigation();
  const [pickedImage, setPickedImage] = useState(""); // Image to show on screen
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { currentUser } = store();
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedItem] = useState(null);
  const [categoryId, setCategoryId] = useState([]);
  console.log(categoryId);
  const insertImage = async () => {
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
      return;
    }
    if (result.assets?.length > 0) {
      setPickedImage(result.assets[0].uri);
    }
  };

  async function createBook() {
    setLoading(true);

    let formData = new FormData();
    let localUri = pickedImage;
    let filename = pickedImage.split("/").pop();
    let type = "image/jpeg";
    console.log(pickedImage, filename);
    // Add the image data to the form data
    formData.append("file", { uri: localUri, name: filename, type });
    formData.append("title", title);
    formData.append("categoryId", selectedValue);
    formData.append("description", description);
    await axios
      .post(`${API_URL}/books/createBook`, formData, {
        headers: {
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log(response.data);
        setLoading(false);
        navigation.goBack();
      })
      .catch((e) => ToastAndroid.show(e.message, ToastAndroid.SHORT));
  }
  async function update() {
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
        // First it get all data from all Categories then arrange it like this
        // {
        //   id: null,
        //   category: "Select Category",
        // },
        // {
        //   id: "6454930c0621eb48e4b60dc1",
        //   category: "News",
        // },

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
    update();
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
            Create Stream
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
            onPress={insertImage}
            className="mx-auto w-52 h-64 justify-center border border-gray-300 rounded-lg"
          >
            <Text className="text-center text-gray-400">Tap to pick cover</Text>
          </Pressable>
        )}
      </View>

      <View className="flex-row items-center space-x-3 mt-2">
        <View className="flex-row border border-gray-300 rounded-lg w-[90%] mx-auto">
          <TextInput
            maxLength={32}
            onChangeText={(value) => setTitle(value)}
            placeholder="Stream Title"
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
            placeholder="Description"
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
        disabled={
          title.length == 0 ||
          loading ||
          selectedValue === null ||
          description === null
        }
        onPress={() => createBook()}
        className={clsx(
          " mt-8 mx-auto bg-Primary w-[70%] items-center px-2 py-2 rounded-xl",
          {
            "bg-slate-400":
              title.length == 0 ||
              pickedImage.length == 0 ||
              loading ||
              selectedValue === null ||
              description.length == 0,
          }
        )}
      >
        <Text className="text-white text-">Create Stream</Text>
      </Pressable>
    </SafeAreaView>
  );
}
