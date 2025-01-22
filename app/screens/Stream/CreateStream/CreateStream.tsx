import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StreamStackNavigatorProps } from "shared/navigators/StreamStackNavigator";
import { useAppSelector } from "shared/hooks/useRedux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, CustomKeyboardScrollView } from "app/components/ui";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ScrollView } from "react-native-gesture-handler";
import { useCreateStreamMutation } from "shared/apis/streams/streamsApi";
import { apiHandler } from "shared/util/handler";
import { LanguageList } from "shared/util/constants";

export default function CreateStream() {
  const navigation = useNavigation<StreamStackNavigatorProps>();
  const token = useAppSelector((state) => state.auth.token);

  const [pickedImage, setPickedImage] = useState(""); // Image to show on screen
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedName, setSelectedName] = useState("Category");
  const [categoryId, setCategoryId] = useState([]);
  const [openCategory, setOpenCategory] = useState<boolean>(false);
  const [openLanguage, setOpenLanguage] = useState<boolean>(false);
  const [language, setLanguage] = useState<
    (typeof LanguageList)[keyof typeof LanguageList] | null
  >(null);
  const languages = useAppSelector((state) => state.util.languages);
  const [createStream, { data, isLoading, error }] = useCreateStreamMutation();

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

  const insertImage = async () => {
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
      return;
    }
    if (result.assets?.length > 0) {
      setPickedImage(result.assets[0].uri);
    }
  };

  async function createBook() {
    if (
      title === "" ||
      !selectedValue ||
      !language ||
      description === "" ||
      pickedImage === ""
    )
      return Alert.alert("Error", "Please fill all the fields");

    let localUri = pickedImage;
    let filename = pickedImage.split("/").pop();
    let type = "image/jpeg";

    if (!filename) return Alert.alert("Error", "Please fill all the fields");
    createStream({
      file: { uri: localUri, name: filename, type },
      title,
      description,
      categoryId: selectedValue,
      language,
    });
  }
  async function update() {
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
        setCategoryId(data);
      })
      .catch((e) => console.log(e.message));
  }
  useEffect(() => {
    update();
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
      <View style={{ flex: 1 }}>
        {pickedImage ? (
          <View
            className="mx-auto justify-center rounded-lg "
            style={{ width: "100%" }}
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
          </View>
        ) : (
          <Pressable
            onPress={insertImage}
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
            />
          </View>
        </View>
        <Text className="text-right text-xs text-gray-400">
          {title.length}/32
        </Text>
        <View className="flex-row items-center space-x-3 mt-0.5 bg-textField">
          <View className="flex-row border border-gray-300 rounded-lg mx-auto">
            <TextInput
              maxLength={64}
              onChangeText={(value) => setDescription(value)}
              placeholder="Description"
              className="text-gray-500 px-2 py-3 flex-1 mx-4"
              placeholderTextColor={"#9CA3AF"}
            />
          </View>
        </View>
        <Text className="text-right text-xs text-gray-400">
          {description.length}/64
        </Text>
        {Platform.OS === "android" ? (
          <View className="border border-gray-300 rounded-lg bg-textField">
            {/* <Picker
              selectedValue={selectedValue}
              style={{
                width: "100%",
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
            </Picker> */}
            <Picker
  selectedValue={selectedValue}
  style={{
    width: "100%",
  }}
  onValueChange={(itemValue) => {
    if (itemValue !== null) {
      const selectedItem = categoryId.find((item) => item.id === itemValue);
      if (selectedItem) {
        setSelectedName(selectedItem.category);
      }
    }
    setSelectedValue(itemValue);
    setOpenCategory(false);
  }}
>
  {/* Default placeholder option */}
  <Picker.Item
    label="Please select a category"
    value={null}
    style={{ color: "#9CA3AF" }}
  />

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
        ) : (
          <Pressable
            className="mt-0.5 border mx-auto border-gray-300 rounded-lg bg-textField"
            style={{ width: "100%", padding: 12, paddingHorizontal: 24 }}
            onPress={() => setOpenCategory(!openCategory)}
          >
            <Text>{selectedName}</Text>
          </Pressable>
        )}
        {Platform.OS === "android" ? (
          <View className="border border-gray-300 rounded-lg bg-textField mt-5">
            {/* <Picker
              selectedValue={language}
              style={{
                width: "100%",
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
            </Picker> */}
            <Picker
  selectedValue={language}
  style={{
    width: "100%",
  }}
  onValueChange={(itemValue) => {
    setLanguage(itemValue);
    setOpenLanguage(false);
  }}
>
  {/* Default option "Please select a language" */}
  <Picker.Item
    label="Please select a language"
    value={null}
    style={{ color: "#9CA3AF" }}
  />
  
  {languages.map((item) => (
    <Picker.Item
      key={item}
      label={item}
      value={item}
      style={{ color: "#9CA3AF" }}
    />
  ))}
</Picker>

          </View>
        ) : (
          <Pressable
            className="mt-4 border mx-auto border-gray-300 rounded-lg bg-textField"
            style={{ width: "100%", padding: 12, paddingHorizontal: 24 }}
            onPress={() => setOpenLanguage(!openLanguage)}
          >
            <Text>{language ?? "Language"}</Text>
          </Pressable>
        )}
        {openCategory && Platform.OS === "ios" && (
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
        {openLanguage && Platform.OS === "ios" && (
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
        onPress={createBook}
        label="Create Stream"
        style={{ marginTop: 20 }}
        loading={isLoading}
        short
      />
    </CustomKeyboardScrollView>
  );
}
