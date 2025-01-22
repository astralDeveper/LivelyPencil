import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StatusBar,
  ToastAndroid,
  useWindowDimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Pressable } from "react-native";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import LottieView from "lottie-react-native";
import Load from "assets/svg/Load.json";
import clsx from "clsx";
import * as MediaLibrary from "expo-media-library";
import { UserUpdateCategories } from "./UserUpdateCategories";
// $&
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import { setCurrentUser } from "store/slices/auth/authSlice";

export default function UserUpdate() {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  // const { currentUser, setCurrentUser } = store();
  const currentUser = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName);
  const [nickName, setNickName] = useState(currentUser?.nickName);
  const [bio, setBio] = useState(currentUser?.bio);
  const [link, setLink] = useState("");
  const dispatch = useAppDispatch();

  const [categories, setCategories] = useState([]);

  const [selected, setSelected] = useState(currentUser?.listofCategoryIds);

  const handleNickName = (text: string) => {
    // Regular expression to match only letters and numbers
    const regex = /^[A-Za-z0-9]*$/;

    // If the text matches the regex, update the state; otherwise, reset to empty string
    if (regex.test(text)) {
      setNickName(text);
    } else {
      setNickName((prev) => prev);
    }
  };

  const UpdatePhoto = async (localUrl: string) => {
    setLoading(true); 
    const formData = new FormData();
    formData.append("file", {
      uri: localUrl,
      type: "image/jpeg",
      name: `${localUrl.split("/").pop()}`,
    });
    await axios
      .post(
        `${process.env.EXPO_PUBLIC_API_URL}/users/updateUserProfileImage`,
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res.data);

        const updateUser = {
          ...currentUser,
          user: {
            ...currentUser,
            profilePicture: localUrl,
          },
        };

        dispatch(setCurrentUser(updateUser));
        setLoading(false);
      })
      .catch((e) => {
        //Fallback
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
        console.log("upload prpfile image", e);
        setLoading(false);
      });
  };

  //Update user
  const UpdateUser = async () => {
    setLoading(true);
    let data = JSON.stringify({
      nickName,
      listofCategoryIds: selected,
      fullName,
      bio,
      link,
    });

    await axios
      .put(
        `${process.env.EXPO_PUBLIC_API_URL}/users/updateUserById/${currentUser?.id}`,
        data,
        {
          maxBodyLength: Infinity,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);

        const updateUser = {
          ...currentUser,

          user: {
            ...currentUser,
            listofCategoryIds: selected,
            fullName,
            nickName,
            bio,
            link,
          },
        };
        dispatch(setCurrentUser(updateUser));
        setLoading(false);
      })
      .catch((e) => {
        // Check if the error response exists and has data
        if (e.response && e.response.data && e.response.data.message) {
          ToastAndroid.show(e.response.data.message, ToastAndroid.SHORT);
        } else {
          // Fallback to a more generic error message if the specific message is not available
          ToastAndroid.show(
            "An error occurred: " + e.message,
            ToastAndroid.SHORT
          );
          console.log("User Update: ", e);
        }
        setLoading(false);
      });
  };

  async function pickImage() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (result.assets?.length > 0) {
      // setLocalImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
      await UpdatePhoto(result.assets[0].uri);
    }
  }

  const uploadCover = async (localUrl: string) => {
    setLoading(true);
    //Upload to S3
    let formData = new FormData();
    formData.append("file", {
      uri: localUrl,
      type: "image/jpeg",
      name: `${localUrl.split("/").pop()}`,
    });

    await axios
      .post(
        `${process.env.EXPO_PUBLIC_API_URL}/users/updateUserCoverImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        const updateUser = {
          ...currentUser,

          user: {
            ...currentUser,
            coverImg: localUrl,
          },
        };
        dispatch(setCurrentUser(updateUser));
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
        setLoading(false);
      });

    //Update use Details
  };

  const pickCover = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    if (result.assets?.length > 0) {
      // setLocalImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
      await uploadCover(result.assets[0].uri);
    }
  };

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
          value: c._id,
          label:
            c.categoryName.charAt(0).toUpperCase() + c.categoryName.slice(1),
        }));

        setCategories(data);
      })
      .catch((e) => console.log(e.message));
  }

  useEffect(() => {
    getAllCategories();
    async function requestMediaLibraryPermission() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need media library permissions to make this work!"
        );
      }
    }
    requestMediaLibraryPermission();
  }, []);
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        // marginTop: StatusBar.currentHeight || 0,
        flex: 1,
        height,
        position: "relative",
      }}
    >
      {/* Header */}

      {/* Body */}
      <ScrollView>
        {/* Top Back button / edit button*/}
        <View className="flex-row justify-between w-full z-40 absolute justify-end">
          <Feather
            name="edit"
            size={28}
            color="white"
            style={{ marginRight: 10 }}
          />
        </View>
        {!currentUser?.coverImg ? (
          <Pressable onPress={pickCover} className="h-36  w-full bg-gray-700 ">
            <Text className=" text-center font-Inter-bold text-xl justify-center mt-10 text-white ">
              Add Cover
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={pickCover} className="relative">
            {loading && (
              <View className=" absolute -bottom-4 left-1/2 w-12 h-5 ">
                <LottieView resizeMode="cover" source={Load} autoPlay loop />
              </View>
            )}
            <Image
              cachePolicy="memory-disk"
              contentFit="cover"
              source={{
                uri: currentUser?.coverImg.includes("file")
                  ? currentUser?.coverImg
                  : // : `${process.env.EXPO_PUBLIC_API_URL}/s3/getMedia/${
                    `${process.env.S3}/${
                      currentUser?.coverImg
                    }?timestamp=${new Date().getTime()}`,
              }}
              className="w-full h-36 "
            />
          </Pressable>
        )}
        <Pressable
          onPress={pickImage}
          className="absolute rounded-full self-start ml-2 mt-[60] border-4 border-white"
        >
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            source={{
              uri: currentUser?.profilePicture.includes("file")
                ? currentUser?.profilePicture
                : // : `${process.env.EXPO_PUBLIC_API_URL}/s3/getMedia/${
                  `${process.env.S3}/${
                    currentUser?.profilePicture
                  }?timestamp=${new Date().getTime()}`,
            }}
            className="w-24 h-24 rounded-full "
          />
        </Pressable>

        <View className=" flex-row ml-5 mt-4 space-x-5 items-center">
          <Text className="text-sm font-Inter-Black">Change Name</Text>
          <TextInput
            onChangeText={(value) => setFullName(value)}
            className=" font-Inter-medium flex-1 border p-1 border-Primary/40 rounded-md pl-5 text-gray-500 mx-5"
            defaultValue={currentUser?.fullName}
          />
        </View>
        <View className="flex-row ml-5 mt-2 space-x-8 items-center">
          <Text className="text-sm font-Inter-Black">Change Nick</Text>
          <TextInput
            // onChangeText={(value) => setNickName(value)}
            style={{ color: "#6687c4" }}
            value={nickName}
            onChangeText={handleNickName}
            className=" font-Inter-medium flex-1 border p-1 border-Primary/40 rounded-md pl-5 text-gray-500 mx-5"
            defaultValue={
              currentUser?.nickName
                ? currentUser?.nickName
                : currentUser?.email.split("@")[0]
            }
          />
        </View>
        <View className=" flex-row ml-5 mt-2 space-x-10 items-center ">
          <Text className=" text-sm font-Inter-Black">Change Bio</Text>
          <TextInput
            onChangeText={(value) => setBio(value)}
            multiline
            maxLength={240}
            className="relative font-Inter-medium flex-1 border p-1 border-Primary/40 rounded-md pl-5 text-gray-500 mx-5"
            defaultValue={currentUser?.bio ? currentUser?.bio : "About you"}
          />
        </View>

        <View className=" flex-row ml-5 mt-2 space-x-8 items-center ">
          <Text className=" text-sm font-Inter-Black">Change URL</Text>
          <TextInput
            onChangeText={(value) => setLink(value)}
            multiline
            maxLength={40}
            className="relative font-Inter-medium flex-1 border p-1 border-Primary/40 rounded-md pl-5 text-gray-500 mx-5"
            defaultValue={"livelypencil.com"}
          />
        </View>
        <Pressable
          disabled={loading}
          onPress={UpdateUser}
          className={clsx(
            "mx-40 items-center w-32 bg-Primary  rounded-2xl   py-0.5 mt-4",
            {
              "bg-white border-Primary border-2": loading,
            }
          )}
        >
          <Text className="text-white text-base font-Inter-bold ">
            {loading ? (
              <View className="flex-1 w-8 h-5 items-center">
                <LottieView resizeMode="cover" source={Load} autoPlay loop />
              </View>
            ) : (
              "Update"
            )}
          </Text>
        </Pressable>
        <UserUpdateCategories
          setSelected={setSelected}
          selected={selected}
          categories={categories}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
