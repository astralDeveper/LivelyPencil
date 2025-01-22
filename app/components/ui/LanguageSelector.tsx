// import {
//   FlatList,
//   Modal,
//   Pressable,
//   TouchableOpacity,
//   TouchableOpacityProps,
//   View,
//   useWindowDimensions,
// } from "react-native";
// import Text from "./Text";
// import { Settings } from "react-native-feather";
// import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
// import {
//   setSelectedLanguage,
//   setShowSelectLanguageModal,
//   updateLanguages,
// } from "store/slices/util/utilSlice";
// import { useEffect, useState } from "react";
// import { LanguageList } from "shared/util/constants";
// import Button from "./Button";
// import Toast from "react-native-toast-message";
// import SettingsIcon from "assets/svg/Stream/Setting";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// interface LanguageItemProps extends TouchableOpacityProps {
//   isSelected: boolean;
//   label: string;
// }

// const LanguageItem = (props: LanguageItemProps): JSX.Element => {
//   return (
//     <TouchableOpacity
//       {...props}
//       className="p-4 my-2"
//       style={[
//         {
//           borderWidth: 1,
//           borderColor: props.isSelected ? "#0076FC" : "#909198",
//           borderRadius: 12,
//           backgroundColor: props.isSelected ? "#0076FC" : "#fff",
//         },
//         props.style,
//       ]}
//     >
//       <Text
//         style={{
//           color: props.isSelected ? "#fff" : "#909198",
//           fontFamily: "Inter-Medium",
//         }}
//       >
//         {props.label}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// const LanguageSelectModal = (): JSX.Element => {
//   const isVisible = useAppSelector(
//     (state) => state.util.showSelectLanguageModal
//   );
//   const languages = useAppSelector((state) => state.util.languages);
//   const selectedLanguage = useAppSelector(
//     (state) => state.util.languageSelected
//   );
//   const [selectedLanguageLocal, setSelectedLanguageLocal] =
//     useState(selectedLanguage);
//   const { width, height } = useWindowDimensions();
//   const dispatch = useAppDispatch();
//   const updatedLanguagess = ["All Languages", ...languages];
//   // const updatedLanguagess = [
//   //   { label: "All Languages", value: "" },
//   //   ...languages.map((language) => ({ label: language, value: language })),
//   // ];
  
//   function closeModal() {
//     dispatch(setShowSelectLanguageModal(false));
//   }

//   // function handleSave() {
//   //   dispatch(setSelectedLanguage(selectedLanguageLocal));
//   //   dispatch(updateLanguages(selectedLanguageLocal));
//   //   Toast.show({
//   //     type: "success",
//   //     text1: `Preferred language saved to ${selectedLanguageLocal}`,
//   //   });
//   //   dispatch(setShowSelectLanguageModal(false));
//   // }
//   useEffect(() => {
//     async function loadLanguage() {
//       try {
//         const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
//         if (savedLanguage) {
//           dispatch(setSelectedLanguage(savedLanguage));
//         }
//       } catch (error) {
//         console.error("Error loading language:", error);
//       }
//     }

//     loadLanguage();
//   }, [dispatch]);

//   async function handleSave() {
//     try {
//       await AsyncStorage.setItem("selectedLanguage", selectedLanguageLocal);
//       dispatch(setSelectedLanguage(selectedLanguageLocal));
//       dispatch(updateLanguages(selectedLanguageLocal));
//       Toast.show({
//         type: "success",
//         text1: `Preferred language saved to ${selectedLanguageLocal}`,
//       });
//       dispatch(setShowSelectLanguageModal(false));
//     } catch (error) {
//       console.error("Error saving language:", error);
//       Toast.show({
//         type: "error",
//         text1: "Failed to save language.",
//       });
//     }
//   }
  

//   function handleOnPress(
//     item: (typeof LanguageList)[keyof typeof LanguageList]
//   ) {
//     setSelectedLanguageLocal(item);
//   }

// //   function handleOnPress(
// //   item: (typeof LanguageList)[keyof typeof LanguageList]
// // ) {
// //   if (item === "All Languages") {
// //     setSelectedLanguageLocal("");
// //   } else {
// //     setSelectedLanguageLocal(item);
// //   }
// // }



//   return (
//     <Modal visible={isVisible} animationType="slide" transparent={true}>
//       <Pressable
//         style={{
//           position: "absolute",
//           width: isVisible ? width : 0,
//           height,
//           backgroundColor: "rgba(0,0,0,0.4)",
//           justifyContent: "center",
//         }}
//         onPress={closeModal}
//       >
//         <View
//           className="bg-white mx-6 px-4 pt-8 pb-4 rounded-lg"
//           style={{ maxHeight: Math.min(height * 0.7, 600) }}
//         >
//           <Text className="font-Inter-bold text-xl mb-2 text-Black">
//             Languages
//           </Text>
//           <FlatList
//             data={updatedLanguagess}
//             renderItem={({ item }) => (
//               <LanguageItem
//                 label={item}
//                 isSelected={item === selectedLanguageLocal}
//                 onPress={() => handleOnPress(item)}
//               />
//             )}
//             showsVerticalScrollIndicator={false}
//           />
//           <Button label="Save" className="mt-2" onPress={handleSave} />
//         </View>
//       </Pressable>
//     </Modal>
//   );
// };

// export default function LanguageSelector(): JSX.Element {
//   const dispatch = useAppDispatch();

//   function handleOnPress() {
//     dispatch(setShowSelectLanguageModal(true));
//   }

//   return (
//     <>
//       <TouchableOpacity onPress={handleOnPress}>
//         <View className="flex-row items-center">
//           <Text className="mr-2">Language</Text>
//           <SettingsIcon />
//         </View>
//       </TouchableOpacity>
//       <LanguageSelectModal />
//     </>
//   );
// }



// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   Modal,
//   Pressable,
//   TouchableOpacity,
//   TouchableOpacityProps,
//   View,
//   useWindowDimensions,
// } from "react-native";
// import Text from "./Text";
// import Button from "./Button";
// import Toast from "react-native-toast-message";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
// import {
//   setSelectedLanguage,
//   setShowSelectLanguageModal,
//   updateLanguages,
// } from "store/slices/util/utilSlice";
// import SettingsIcon from "assets/svg/Stream/Setting";

// interface LanguageItemProps extends TouchableOpacityProps {
//   isSelected: boolean;
//   label: string;
// }

// const LanguageItem = (props: LanguageItemProps): JSX.Element => {
//   return (
//     <TouchableOpacity
//       {...props}
//       className="p-4 my-2"
//       style={[
//         {
//           borderWidth: 1,
//           borderColor: props.isSelected ? "#0076FC" : "#909198",
//           borderRadius: 12,
//           backgroundColor: props.isSelected ? "#0076FC" : "#fff",
//         },
//         props.style,
//       ]}
//     >
//       <Text
//         style={{
//           color: props.isSelected ? "#fff" : "#909198",
//           fontFamily: "Inter-Medium",
//         }}
//       >
//         {props.label}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// const LanguageSelectModal = (): JSX.Element => {
//   const isVisible = useAppSelector(
//     (state) => state.util.showSelectLanguageModal
//   );
//   const languages = useAppSelector((state) => state.util.languages);
//   const selectedLanguage = useAppSelector(
//     (state) => state.util.languageSelected
//   );
//   const [selectedLanguageLocal, setSelectedLanguageLocal] =
//     useState(selectedLanguage);
//   const { width, height } = useWindowDimensions();
//   const dispatch = useAppDispatch();
//   const updatedLanguages = ["All Languages", ...languages];

//   const closeModal = () => {
//     dispatch(setShowSelectLanguageModal(false));
//   };

//   // Synchronize selected language when the modal is opened
//   useEffect(() => {
//     async function syncSelectedLanguage() {
//       if (isVisible) {
//         try {
//           const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
//           if (savedLanguage) {
//             setSelectedLanguageLocal(savedLanguage);
//           } else {
//             setSelectedLanguageLocal(selectedLanguage);
//           }
//         } catch (error) {
//           console.error("Error syncing language:", error);
//         }
//       }
//     }
//     syncSelectedLanguage();
//   }, [isVisible, selectedLanguage]);

//   const handleSave = async () => {
//     try {
//       await AsyncStorage.setItem("selectedLanguage", selectedLanguageLocal);
//       dispatch(setSelectedLanguage(selectedLanguageLocal));
//       dispatch(updateLanguages(selectedLanguageLocal));
//       Toast.show({
//         type: "success",
//         text1: `Preferred language saved to ${selectedLanguageLocal}`,
//       });
//       closeModal();
//     } catch (error) {
//       console.error("Error saving language:", error);
//       Toast.show({
//         type: "error",
//         text1: "Failed to save language.",
//       });
//     }
//   };

//   const handleOnPress = (item: string) => {
//     setSelectedLanguageLocal(item);
//   };

//   return (
//     <Modal visible={isVisible} animationType="slide" transparent={true}>
//       <Pressable
//         style={{
//           position: "absolute",
//           width: isVisible ? width : 0,
//           height,
//           backgroundColor: "rgba(0,0,0,0.4)",
//           justifyContent: "center",
//         }}
//         onPress={closeModal}
//       >
//         <View
//           className="bg-white mx-6 px-4 pt-8 pb-4 rounded-lg"
//           style={{ maxHeight: Math.min(height * 0.7, 600) }}
//         >
//           <Text className="font-Inter-bold text-xl mb-2 text-Black">
//             Languages
//           </Text>
//           <FlatList
//             data={updatedLanguages}
//             renderItem={({ item }) => (
//               <LanguageItem
//                 label={item}
//                 isSelected={item === selectedLanguageLocal}
//                 onPress={() => handleOnPress(item)}
//               />
//             )}
//             keyExtractor={(item) => item}
//             showsVerticalScrollIndicator={false}
//           />
//           <Button label="Save" className="mt-2" onPress={handleSave} />
//         </View>
//       </Pressable>
//     </Modal>
//   );
// };

// const LanguageSelector = (): JSX.Element => {
//   const dispatch = useAppDispatch();

//   const handleOnPress = () => {
//     dispatch(setShowSelectLanguageModal(true));
//   };

//   return (
//     <>
//       <TouchableOpacity onPress={handleOnPress}>
//         <View className="flex-row items-center">
//           <Text className="mr-2">Language</Text>
//           <SettingsIcon />
//         </View>
//       </TouchableOpacity>
//       <LanguageSelectModal />
//     </>
//   );
// };

// export default LanguageSelector;



import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  useWindowDimensions,
} from "react-native";
import Text from "./Text";
import Button from "./Button";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "shared/hooks/useRedux";
import {
  setSelectedLanguage,
  setShowSelectLanguageModal,
  updateLanguages,
} from "store/slices/util/utilSlice";
import SettingsIcon from "assets/svg/Stream/Setting";

interface LanguageItemProps extends TouchableOpacityProps {
  isSelected: boolean;
  label: string;
}

const LanguageItem = (props: LanguageItemProps): JSX.Element => {
  return (
    <TouchableOpacity
      {...props}
      className="p-4 my-2"
      style={[
        {
          borderWidth: 1,
          borderColor: props.isSelected ? "#0076FC" : "#909198",
          borderRadius: 12,
          backgroundColor: props.isSelected ? "#0076FC" : "#fff",
        },
        props.style,
      ]}
    >
      <Text
        style={{
          color: props.isSelected ? "#fff" : "#909198",
          fontFamily: "Inter-Medium",
        }}
      >
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

const LanguageSelectModal = (): JSX.Element => {
  const isVisible = useAppSelector(
    (state) => state.util.showSelectLanguageModal
  );
  const languages = useAppSelector((state) => state.util.languages);
  const selectedLanguage = useAppSelector(
    (state) => state.util.languageSelected
  );
  const [selectedLanguageLocal, setSelectedLanguageLocal] =
    useState(selectedLanguage);
  const { width, height } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const updatedLanguages = ["All Languages", ...languages];

  const closeModal = () => {
    dispatch(setShowSelectLanguageModal(false));
  };

  // Synchronize selected language when the modal is opened
  useEffect(() => {
    async function syncSelectedLanguage() {
      if (isVisible) {
        try {
          const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
          if (savedLanguage) {
            setSelectedLanguageLocal(savedLanguage);
          } else {
            setSelectedLanguageLocal(selectedLanguage);
          }
        } catch (error) {
          console.error("Error syncing language:", error);
        }
      }
    }
    syncSelectedLanguage();
  }, [isVisible, selectedLanguage]);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("selectedLanguage", selectedLanguageLocal);
      dispatch(setSelectedLanguage(selectedLanguageLocal));
      dispatch(updateLanguages(selectedLanguageLocal));
      Toast.show({
        type: "success",
        text1: `Preferred language saved to ${selectedLanguageLocal}`,
      });
      closeModal();
    } catch (error) {
      console.error("Error saving language:", error);
      Toast.show({
        type: "error",
        text1: "Failed to save language.",
      });
    }
  };

  const handleOnPress = (item: string) => {
    setSelectedLanguageLocal(item);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <Pressable
        style={{
          position: "absolute",
          width: isVisible ? width : 0,
          height,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
        }}
        onPress={closeModal}
      >
        <View
          className="bg-white mx-6 px-4 pt-8 pb-4 rounded-lg"
          style={{ maxHeight: Math.min(height * 0.7, 600) }}
        >
          <Text className="font-Inter-bold text-xl mb-2 text-Black">
            Languages
          </Text>
          <FlatList
            data={updatedLanguages}
            renderItem={({ item }) => (
              <LanguageItem
                label={item}
                isSelected={item === selectedLanguageLocal}
                onPress={() => handleOnPress(item)}
              />
            )}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
          />
          <Button label="Save" className="mt-2" onPress={handleSave} />
        </View>
      </Pressable>
    </Modal>
  );
};

const LanguageSelector = (): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadPersistedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
        if (savedLanguage) {
          dispatch(setSelectedLanguage(savedLanguage));
        }
      } catch (error) {
        console.error("Error loading persisted language:", error);
      }
    };

    loadPersistedLanguage();
  }, [dispatch]);

  const handleOnPress = () => {
    dispatch(setShowSelectLanguageModal(true));
  };

  return (
    <>
      <TouchableOpacity onPress={handleOnPress}>
        <View className="flex-row items-center">
          <Text className="mr-2">Language</Text>
          <SettingsIcon />
        </View>
      </TouchableOpacity>
      <LanguageSelectModal />
    </>
  );
};

export default LanguageSelector;
