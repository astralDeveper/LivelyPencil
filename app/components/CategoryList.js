// // components
import clsx from "clsx";
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import store from "store";
import axios from "axios";
import { API_URL } from "@env";
import { ScrollView } from "react-native";
// $&
import { Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const CategoryList = () => {
  const { currentUser, setCurrentUser } = store();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [catList, setCatList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);

  async function update() {
    await axios
      .get(`${API_URL}/categories/getAllCategoriesWithAnalytics`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.tokens.access.token}`,
        },
      })
      .then((res) => {
        setOriginalCategories(res.data);
        setCategories(res.data);
      })
      .catch((e) =>
        Alert.alert("Server Error", "Could not load categories, Please retry", [
          {
            text: "Retry",
            onPress: () => navigation.replace("screens/Category"),
          },
        ])
      );
  }
  useEffect(() => {
    update();
  }, []);
  function sub(item) {
    if (!catList.includes(item._id)) {
      setCatList([...catList, item._id]);
      return;
    }

    const newList = catList.filter((obj) => obj != item._id);
    setCatList(newList);
  }

  async function updateCat() {
    let data = JSON.stringify({
      listofCategoryIds: catList,
    });
    let config = {
      method: "PUT",
      url: `${API_URL}/users/updateUserById/${currentUser.user.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.tokens.access.token}`,
      },
      data: data,
    };
    try {
      setLoading(true);
      await axios.request(config).then((response) => {});

      const udpatedUser = {
        ...currentUser,
        user: { ...currentUser.user, listofCategoryIds: catList },
      };

      setCurrentUser(udpatedUser);
      navigation.push("components/PopularUsers", { catList });
    } catch (e) {
      console.log("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}> */}
      <View className="flex-row mx-4 rounded-2xl bg-textField items-center">
        <AntDesign
          name="search1"
          size={24}
          color="black"
          style={{ marginLeft: 4 }}
        />

        <TextInput
          placeholder="Search Here..."
          className="ml-2   py-3 px-2 flex-1"
          onChangeText={(text) => {
            if (text === "") {
              setCategories(originalCategories); // Reset to original categories when search bar is cleared
            } else {
              const filteredCategories = categories.filter((item) =>
                item.categoryName.toLowerCase().includes(text.toLowerCase())
              );
              setCategories(filteredCategories);
            }
          }}
        />
      </View>
      <ScrollView className="">
        {categories.map((item, i) => (
          <View key={i} className="bg-textField mt-4 mx-4 rounded-2xl py-2">
            <View className=" flex-row   w-[95%] mx-auto  justify-between items-center   pt-0.5 border-gray-100 ">
              <View className="flex-row items-center space-x-4 ">
                <View className="   rounded-full border-2 border-brand  items-center">
                  <Image
                    source={{ uri: item.categoryImage }}
                    className="rounded-full h-16 w-16"
                    resizeMode="contain"
                  />
                </View>
                <View className="">
                  <Text className="  font-Inter-bold text-lg first-letter:capitalize">
                    {item.categoryName}
                  </Text>
                  <View className="flex-row justify-between mt-2  space-x-5">
                    <Text className="text-textColor2 text-sm font-Inter-black">
                      Stream:{" "}
                      <Text className="text-textColor1 font-Inter-bold text-sm">
                        {" "}
                        {item.numberOfBooks}
                      </Text>
                    </Text>
                    <Text>|</Text>
                    <Text className="text-textColor2 text-sm font-Inter-black">
                      Pages:{" "}
                      <Text className="text-textColor1 font-Inter-bold text-sm">
                        {item.numberOfPages}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <Pressable
              onPress={() => sub(item)}
              className={clsx(
                "rounded-full items-center border-brand border-2 w-[95%] self-center my-2",
                {
                  "bg-brand ": catList.includes(item._id),
                }
              )}
            >
              <Text
                className={clsx("p-2 text-sm font-Inter-bold text-brand ", {
                  "text-white": catList.includes(item._id),
                })}
              >
                {catList.includes(item._id) ? "Subscribed" : "Subscribe"}
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <View className=" items-center">
        <Pressable
          onPress={() => updateCat()}
          // className=" px-12 py-1 my-1  rounded-full mx-auto  bg-Primary"
          className={clsx(
            "w-[95%] py-2 items-center  rounded-full mx-auto  bg-brand",
            {
              hidden: catList.length < 1,
            }
          )}
        >
          <Text className="text-base text-white  font-Inter-bold">
            {loading ? <ActivityIndicator color="white" /> : "Next"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default CategoryList;
