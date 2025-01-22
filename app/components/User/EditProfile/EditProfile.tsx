import {
  Platform,
  Pressable,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useAppSelector } from "shared/hooks/useRedux";
import LottieView from "lottie-react-native";
import { Image } from "expo-image";
import { Button, ErrorText, Text } from "app/components/ui";
import Load from "assets/svg/Load.json";
import useEditProfile from "./useEditProfile";
import { useRef, useState } from "react";
import { Formik } from "formik";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { Check, ChevronDown, ChevronLeft, XCircle } from "react-native-feather";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Languages } from "screens/OnBoarding/For_Language/SelectLanguage";

interface ProfileTextInputProps extends TextInputProps {
  label: string;
  containerStyle?: ViewStyle;
  error?: string;
}

type CategoryItemProps = {
  name: string;
  onPress: (id: string) => void;
  isSelected: boolean;
  id: string;
};

type EditPrfileProps = {
  goBack?: () => void;
};

const BackButton = ({ goBack }: { goBack: () => void }) => {
  const { top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "rgba(0,0,0,0.2)",
        width: 30,
        height: 30,
        padding: 4,
        borderRadius: 12,
        position: "absolute",
        top: top < 20 ? height * 0.05 : top + 10,
        left: "5%",
        zIndex: 40,
      }}
      onPress={goBack}
    >
      <ChevronLeft width={24} height={24} color="#fff" strokeWidth={2} />
    </TouchableOpacity>
  );
};

const ProfileTextInput = (props: ProfileTextInputProps) => {
  const [isFocused, setFocus] = useState<boolean>(false);

  const onFocus = () => setFocus(true);

  const onBlur = () => setFocus(false);
  
  return (
    <View className="mb-6">
      <View
        className="flex-row items-center bg-textField p-2 rounded-lg py-4"
        style={[
          { borderWidth: 1, borderColor: isFocused ? "#909198" : "#F8F8F8" },
          props.containerStyle,
        ]}
      >
        <Text className="text-sm font-Inter-Black font-normal mr-4">
          {props.label}
        </Text>
        <TextInput
          {...props}
          onFocus={onFocus}
          onBlur={onBlur}
          className="text-sm font-Inter-Black font-normal flex-1"
          style={[
            {
              color: isFocused ? "#000" : "#909198",
              marginTop: -6,
            },
            props.style,
          ]}
          textAlignVertical="top"
          textAlign="right"
        />
      </View>
      {props.error && (
        <ErrorText className="text-xs font-Inter-bold text-right mt-2">
          {props.error}
        </ErrorText>
      )}
    </View>
  );
};

const CoverImage = () => {
  const coverImage = useAppSelector((state) => state.auth.user?.coverImg);
  const { pickCover, coverLoading } = useEditProfile();
  
  return (
    <>
      {!coverImage ? (
        <Pressable
          onPress={pickCover}
          className="h-56 w-full bg-gray-700 justify-center items-center"
        >
          <Text className=" text-center font-Inter-bold text-xl mt-10 text-white ">
            Add Cover
          </Text>
        </Pressable>
      ) : (
        <Pressable onPress={pickCover} className="relative">
          {coverLoading ? (
            <View
              className="h-56"
              style={{ width: "14%", alignSelf: "center" }}
            >
              <LottieView resizeMode="contain" source={Load} autoPlay loop />
            </View>
          ) : (
            <Image
              cachePolicy="memory-disk"
              contentFit="cover"
              source={{
                uri: /\bfile\b/.test(coverImage)
                  ? coverImage
                  : `${process.env.S3}/${coverImage}`,
              }}
              className="w-full h-56"
            />
          )}
        </Pressable>
      )}
    </>
  );
};

const ProfilePicture = () => {
  const user = useAppSelector((state) => state.auth.user);

  const profilePicture = useAppSelector(
    (state) => state.auth.user?.profilePicture
  );
  const { pickImage, profileImageLoading } = useEditProfile();
   return (
    <TouchableOpacity
      onPress={pickImage}
      className="rounded-full self-center mt-[-40] bg-textField"
    >
      {profileImageLoading ? (
        <View className="w-24 h-24 items-center justify-center">
          <View className="w-24 h-8">
            <LottieView resizeMode="contain" source={Load} autoPlay loop />
          </View> 
        </View>
      ) : (
        <Image
          cachePolicy="memory-disk"
          contentFit="cover"
          source={{
            uri:

            //   profilePicture 
            //  &&
            //   /\bfile\b/.test(profilePicture)
            //     ? profilePicture
            //     : `${process.env.S3}/${profilePicture}`  
               
  
            user?.profilePicture?.includes("file")
            ? user?.profilePicture
            : // : `${API_URL}/s3/getMedia/${
              `${process.env.S3}/${
                user?.profilePicture
              }?timestamp=${new Date().getTime()}`,
            
          }}
          className="w-24 h-24 rounded-full "
        />
      )}
    </TouchableOpacity>
  );
};

const CategoryItem = ({
  isSelected,
  name,
  onPress,
  id,
}: CategoryItemProps): JSX.Element => {
  return (
    <TouchableOpacity
      style={{
        paddingVertical: 12,
        marginBottom: 8,
        borderBottomWidth: 0.5,
        borderColor: "#909198",
        borderRadius: 8,
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onPress={() => onPress(id)}
    >
      <Text className="font-Inter-Medium text-lg text-Black">
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Text>
      {isSelected && <Check color="green" />}
    </TouchableOpacity>
  );
};

const PreferredCategories = () => {
  const bottomModalRef = useRef<BottomSheetModal>(null);
  const { categories, updatePreferredCategories } = useEditProfile();
  function openModal() {
    bottomModalRef.current?.present();
  }

  return (
    <>
      <Text className="font-Inter-bold text-Black text-lg">Categories</Text>
      <TouchableOpacity
        onPress={openModal}
        className="bg-textField p-2 rounded-lg mb-6 py-4 flex-row justify-between items-center"
      >
        <Text>Select Categories</Text>
        <ChevronDown color="#949494" />
      </TouchableOpacity>
      <View className="flex-row" style={{ flexWrap: "wrap" }}>
        {categories.map((item) => {
          if (item.isSelected)
            return (
              <TouchableOpacity
                key={item._id}
                className="px-3 py-1 bg-textField mr-4 rounded-lg mb-4 flex-row items-center justify-between"
                onPress={() => updatePreferredCategories(item._id)}
              >
                <Text className="mr-3">
                  {item.categoryName.charAt(0).toUpperCase() +
                    item.categoryName.slice(1)}
                </Text>
                <XCircle color="#949494" width={16} height={16} />
              </TouchableOpacity>
            );
        })}
      </View>
      <BottomSheetModal
        snapPoints={["70%"]}
        ref={bottomModalRef}
        handleIndicatorStyle={{ width: "30%", backgroundColor: "#949494" }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={1}
            disappearsOnIndex={-1}
          />
        )}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 20, paddingBottom: 20 }}
        >
          {categories.map((item) => (
            <CategoryItem
              id={item._id}
              name={item.categoryName}
              isSelected={item.isSelected}
              onPress={updatePreferredCategories}
              key={item._id}
            />
          ))}
        </ScrollView>
      </BottomSheetModal>
    </>
  );
};



const UserDetailsInputs = () => {
  const { validationSchema, updateUserData, isLoading } = useEditProfile();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [openLanguage, setOpenLanguage] = useState<boolean>(false);
  // const [language, setLanguage] = useState()

  console.log(currentUser?.language)

  return (
    <Formik
      initialValues={{
        fullName: currentUser?.fullName ?? "",
        nickName: currentUser?.nickName ?? "",
        bio: currentUser?.bio ?? "",
        url: currentUser?.link ?? "",
        language:currentUser?.language ?? "",
      }}
      onSubmit={(values) => updateUserData(values)}
      validationSchema={validationSchema}
      validateOnChange={false}
    >
      {({ handleChange, handleSubmit, values, errors }) => (
        <View>
          <ProfileTextInput
            label="Username"
            value={values.nickName}
            onChangeText={(text) => handleChange("nickName")(text)}
            placeholder="@example"
            error={errors.nickName}
          />
          <ProfileTextInput
            label="Name"
            value={values.fullName}
            onChangeText={(text) => handleChange("fullName")(text)}
            placeholder="Name"
            error={errors.fullName}
          />
          <ProfileTextInput
            label="Bio"
            value={values.bio}
            onChangeText={(text) => handleChange("bio")(text)}
            placeholder="Your bio"
            error={errors.bio}
          />
          <ProfileTextInput
            label="URL"
            value={values.url}
            onChangeText={(text) => handleChange("url")(text)}
            placeholder="Your url"
            error={errors.url}
          />
      {Platform.OS === "android" ? (
             <View className="rounded-lg bg-textField mb-5">
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
     selectedValue={values?.language}
     style={{
       width: "100%",
     }}
     onValueChange={(itemValue) => {
      handleChange("language")(itemValue)
       setOpenLanguage(false);
     }}
   >
     {/* Default option "Please select a language" */}
     <Picker.Item
       label="Please select a language"
       value={null}
       style={{ color: "#9CA3AF" }}
      
     />
     {Languages.map((item) => (
       <Picker.Item
         key={item}
         label={item?.name}
         value={item?.value}
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
          <PreferredCategories />
          <Button
            label="Save"
            onPress={() => handleSubmit()}
            loading={isLoading}
          />
        </View>
      )}
    </Formik>
  );
};

export default function EditProfile({ goBack }: EditPrfileProps): JSX.Element {
  const { top } = useSafeAreaInsets();
  return (
    <KeyboardAwareScrollView
      style={{ position: "relative" }}
      contentContainerStyle={{ paddingTop: top }}
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
    >
      {goBack && <BackButton goBack={goBack} />}
      <CoverImage />
      <ProfilePicture />
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <UserDetailsInputs />
      </View>
    </KeyboardAwareScrollView>
  );
}
