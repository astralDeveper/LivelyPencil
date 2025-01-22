// import { Button, Heading, MySafeAreaContainer, Text } from "app/components/ui";
// import { FlatList, View, StyleSheet, Dimensions } from "react-native";
// import React, { useState } from "react";
// import { TouchableOpacity } from "react-native-gesture-handler";
// import Toast from "react-native-toast-message";
// import useEditProfile from "app/components/User/EditProfile/useEditProfile";
// import { useAppSelector } from "shared/hooks/useRedux";
// import Axios from "axios";
// import { useNavigation, useRoute } from "@react-navigation/native";

// export const Languages = [
//   { name: "All Languages" },
//   { name: "Arabic" },
//   { name: "Chinese" },
//   { name: "Danish" },
//   { name: "Dutch" },
//   { name: "English" },
//   { name: "Finnish" },
//   { name: "French" },
//   { name: "German" },
//   { name: "Hindi" },
//   { name: "Italian" },
//   { name: "Japanese" },
//   { name: "Korean" },
//   { name: "Norwegian" },
//   { name: "Portuguese" },
//   { name: "Russian" },
//   { name: "Spanish" },
//   { name: "Swedish" },
//   { name: "Turkish" },
// ];

// const SelectLanguage = (): JSX.Element => {
//   const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
//   const user = useAppSelector((state) => state.auth.user);
//   const token = useAppSelector((state) => state.auth.token);
// const { navigate } = useNavigation<OnBoardingStackNavigatorProps>();
//   // const {
//   //   params: { selectedCategories },
//   // } = useRoute<FollowUsersRouteProp>();
//   // Handle language selection
//   const handleSelectLanguage = (language: string) => {
//     setSelectedLanguage(language  == "All Languages" ? "" : language); // Save selected language in state
//   };

//   // Handle the next button press

//   const handleNext = async () => {
//     const userId = user?._id;
//     const userData = {
//       language: selectedLanguage,
//     };

//     // Check if a language is selected
//     if (selectedLanguage) { 
//       // You can perform actions like navigating to the next screen or saving the language
//     }

//     try {
//       const response = await Axios.put(
//         `https://api.livelypencil.com/dev/v1/users/updateUserById/${userId}`,
//         userData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Authenticate with the token
//           },
//         }
//       );
//       if (response?.data) {
//         console.log('Response data:', response.data);
//         navigate("SelectCategory");
//       } 
//     } catch (error) {
//       console.error("Error updating user:", error?.response?.data);
//       // throw error; // You might want to show an error message to the user instead of throwing
//     }
//   };
//   // console.log(token)
//   return (
//     <MySafeAreaContainer style={styles.container}>
//       <Heading style={styles.heading}>Please Select Language</Heading>
//       <Text style={styles.subheading}>Kindly choose at least one language</Text>


//       {Languages && Languages.length > 0 && (
//         <FlatList
//           data={Languages}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={[
//                 styles.languageItem,
//                 selectedLanguage === item.name && styles.selectedLanguageItem,
//               ]}
//               onPress={() => handleSelectLanguage(item.name)} // Set selected language
//             >
//               <Text
//                 style={[
//                   styles.languageText,
//                   selectedLanguage === item.name && styles.selectedLanguageText,
//                 ]}
//               >
//                 {item?.name}
//               </Text>
//             </TouchableOpacity>
//           )}
//           keyExtractor={(item, index) => index.toString()}
//           contentContainerStyle={styles.listContent}
//           ItemSeparatorComponent={() => <View style={styles.separator} />}
//           showsVerticalScrollIndicator={false}
//         />
//       )}

//       <Button
//         label="Next"
//         onPress={handleNext} // Trigger the next action
//         className={`${selectedLanguage ? "" : "bg-grey border-grey"}`}
//         disabled={!selectedLanguage} // Enable only if a language is selected
//       />
//     </MySafeAreaContainer>
//   );
// };

// const { height, width } = Dimensions.get("screen");
// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     backgroundColor: "#f9f9f9",
//     flex: 1,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   subheading: {
//     fontSize: 16,
//     marginBottom: 20,
//     color: "#666",
//   },
//   listContent: {
//     paddingBottom: 10,
//   },
//   languageItem: {
//     padding: 15,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     marginBottom: 10,
//     alignItems: "center",
//     width: width * 0.8,
//     alignSelf: "center",
//     paddingVertical: 20,
//     borderWidth: 1,
//     borderColor: "#8e8e8e",
//   },
//   selectedLanguageItem: {
//     backgroundColor: "#0076fc",
//   },
//   languageText: {
//     fontSize: 16,
//     color: "#0076fc",
//   },
//   selectedLanguageText: {
//     color: "#fff",
//   },
//   separator: {
//     height: 10,
//   },
// });

// export default SelectLanguage;

import React, { useState } from "react";
import { Button, Heading, MySafeAreaContainer, Text } from "app/components/ui";
import { FlatList, View, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "shared/hooks/useRedux";

export const Languages = [
  { name: "All Languages", value: "" },
  { name: "Arabic", value: "Arabic" },
  { name: "Chinese", value: "Chinese" },
  { name: "Danish", value: "Danish" },
  { name: "Dutch", value: "Dutch" },
  { name: "English", value: "English" },
  { name: "Finnish", value: "Finnish" },
  { name: "French", value: "French" },
  { name: "German", value: "German" },
  { name: "Hindi", value: "Hindi" },
  { name: "Italian", value: "Italian" },
  { name: "Japanese", value: "Japanese" },
  { name: "Korean", value: "Korean" },
  { name: "Norwegian", value: "Norwegian" },
  { name: "Portuguese", value: "Portuguese" },
  { name: "Russian", value: "Russian" },
  { name: "Spanish", value: "Spanish" },
  { name: "Swedish", value: "Swedish" },
  { name: "Turkish", value: "Turkish" },
];

const SelectLanguage = (): JSX.Element => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(""); // Default to "All Languages" (value = "")
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const { navigate } = useNavigation();

  // Handle language selection
  const handleSelectLanguage = (languageValue: string) => {
    setSelectedLanguage(languageValue);
  };

  // Handle the next button press
  const handleNext = async () => {
    const userId = user?._id;
    const userData = {
      language: selectedLanguage,
    };

    try {
      const response = await Axios.put(
        `https://api.livelypencil.com/dev/v1/users/updateUserById/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authenticate with the token
          },
        }
      );
      if (response?.data) {
        console.log("Response data:", response.data);
        navigate("SelectCategory");
      }
    } catch (error) {
      console.error("Error updating user:", error?.response?.data);
    }
  };

  return (
    <MySafeAreaContainer style={styles.container}>
      <Heading style={styles.heading}>Please Select Language</Heading>
      <Text style={styles.subheading}>Kindly choose at least one language</Text>

      {Languages && Languages.length > 0 && (
        <FlatList
          data={Languages}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.languageItem,
                selectedLanguage === item.value && styles.selectedLanguageItem,
              ]}
              onPress={() => handleSelectLanguage(item.value)} // Set selected language
            >
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage === item.value && styles.selectedLanguageText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* <Button
        label="Next"
        onPress={handleNext} // Trigger the next action
        className={`${selectedLanguage ? "" : "bg-grey border-grey"}`}
        disabled={!selectedLanguage} // Enable only if a language is selected
      /> */}
      <Button
  label="Next"
  onPress={handleNext}
  className={`${selectedLanguage !== null ? "" : "bg-grey border-grey"}`}
  disabled={selectedLanguage === null} // Only disable if selectedLanguage is null
/>

    </MySafeAreaContainer>
  );
};

const { height, width } = Dimensions.get("screen");
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subheading: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  listContent: {
    paddingBottom: 10,
  },
  languageItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
    alignItems: "center",
    width: width * 0.8,
    alignSelf: "center",
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#8e8e8e",
  },
  selectedLanguageItem: {
    backgroundColor: "#0076fc",
  },
  languageText: {
    fontSize: 16,
    color: "#0076fc",
  },
  selectedLanguageText: {
    color: "#fff",
  },
  separator: {
    height: 10,
  },
});

export default SelectLanguage;



{
  /* <NextButton
          handleNext={handleNext}
          subscribedCategories={selectedCategories}
        /> */
}
{
  /* <IconTextInput
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Search keyword"
          Icon={<SearchIcon />}
        /> */
}
// const {
//   categories,
//   isLoading,
//   searchInput,
//   setSearchInput,
//   handleNext,
//   handleSubscribe,
//   selectedCategories,
// } = useSelectCategory();

// const renderItem = useCallback(
//   ({ item }: { item: ICategoriesWithAnalyticsResponse }) => {
//     return (
//       <CategoryItem
//         key={item._id}
//         {...item}
//         handleSubscribe={handleSubscribe}
//         isSelected={selectedCategories.includes(item._id)}
//       />
//     );
//   },
//   [selectedCategories]
// );

// if (isLoading) return <Loading />;

//   interface CategoryItemProps
//     extends Omit<ICategoriesWithAnalyticsResponse, "numberOfAuthors"> {
//     handleSubscribe: (id: string) => void;
//     isSelected: boolean;
//   }

//   function areCategoryItemPropsEqual(
//     oldProps: CategoryItemProps,
//     newProps: CategoryItemProps
//   ): boolean {
//     return oldProps.isSelected === newProps.isSelected;
//   }

//   const CategoryItem = React.memo(
//     ({
//       _id,
//       categoryImage,
//       categoryName,
//       numberOfBooks,
//       numberOfPages,
//       handleSubscribe,
//       isSelected,
//     }: CategoryItemProps): JSX.Element => {
//       const { width } = useWindowDimensions();

//       function hanldeOnPress() {
//         handleSubscribe(_id);
//       }

//       return (
//         <View className="py-2 px-4 bg-textField mt-4">
//           <View className="flex-row justify-between">
//             <Image
//               source={{ uri: categoryImage }}
//               style={{
//                 width: width * 0.17,
//                 aspectRatio: 1,
//                 borderRadius: 100,
//                 maxWidth: 100,
//               }}
//             />
//             <View className="flex-1 ml-4 justify-between">
//               <Heading>
//                 {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
//               </Heading>
//               <View className="flex-row justify-between pr-6">
//                 <Text>
//                   Stream: <Heading className="text-sm">{numberOfBooks}</Heading>
//                 </Text>
//                 <Separator />
//                 <Text>
//                   Pages: <Heading className="text-sm">{numberOfPages}</Heading>
//                 </Text>
//               </View>
//             </View>
//           </View>
//           <Button
//             label={isSelected ? "Unsubscribe" : "Subscribe"}
//             outlined={!isSelected}
//             className="py-2 mt-4"
//             onPress={hanldeOnPress}
//           />
//         </View>
//       );
//     },
//     areCategoryItemPropsEqual
//   );

//   const NextButton = ({
//     subscribedCategories,
//     handleNext,
//   }: {
//     subscribedCategories: string[];
//     handleNext: () => void;
//   }): JSX.Element => {
//     return (
//       <Button
//         label="Next"
//         onPress={handleNext}
//         className={`${
//           subscribedCategories.length === 0 && "bg-grey border-grey"
//         }`}
//         disabled={subscribedCategories.length === 0}
//       />
//     );
//   };
