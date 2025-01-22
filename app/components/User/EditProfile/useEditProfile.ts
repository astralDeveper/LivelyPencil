import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { useGetAllCategoriesQuery } from "shared/apis/categories/categoriesApi";
import {
  useUpdateCoverImageMutation,
  useUpdateProfileImageMutation,
} from "shared/apis/user/userFileApi";
import { apiHandler } from "shared/util/handler";
import { IUserCategoryData } from "shared/types/user/user.type";
import { useAppSelector } from "shared/hooks/useRedux";
import { useUpdateUserByIdMutation } from "shared/apis/user/userApi";

interface PreferredCategories extends IUserCategoryData {
  isSelected: boolean;
}

const useEditProfile = () => {
  const [categories, setCategories] = useState<PreferredCategories[]>([]);
  const userSelectedCategories = useAppSelector(
    (state) => state.auth.user?.listofCategoryIds
  );
  const userId = useAppSelector((state) => state.auth.user?.id);
  const { data: categoriesData, error: categoriesError } =
    useGetAllCategoriesQuery(undefined);
  const [
    uploadCover,
    { data: coverData, error: coverError, isLoading: coverLoading },
  ] = useUpdateCoverImageMutation();
  const [
    updateProfilePicture,
    {
      data: profileImageData,
      error: profileImageError,
      isLoading: profileImageLoading,
    },
  ] = useUpdateProfileImageMutation();
  const [updateUser, { data, isLoading, error }] = useUpdateUserByIdMutation();

  const validationSchema = Yup.object().shape({
    nickName: Yup.string().required("Username is required"),
    fullName: Yup.string().required("Name is required"),
    bio: Yup.string(),
    url: Yup.string(),
  });

  useEffect(() => {
    apiHandler({
      data: categoriesData,
      error: categoriesError,
      onSuccess(response) {
        if (Array.isArray(response)) {
          const newCategories: PreferredCategories[] = [];
          response.map((item) => {
            newCategories.push({
              _id: item._id,
              categoryName: item.categoryName,
              isSelected: userSelectedCategories?.includes(item._id) ?? false,
            });
          });
          setCategories(newCategories);
        }
      },
    });
  }, [categoriesData, categoriesError]);


console.log("object",categoriesData)

  useEffect(() => {
    apiHandler({
      data: coverData,
      error: coverError,
      showSuccess: true,
    });
  }, [coverData, coverError]);

  useEffect(() => {
    apiHandler({
      data,
      error,
      showSuccess: true,
    });
  }, [data, error]);

  useEffect(() => {
    apiHandler({
      data: profileImageData,
      error: profileImageError,
      showSuccess: true,
    });
  }, [profileImageData, profileImageError]);

  async function pickCover() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    if (result?.assets && result.assets.length > 0) {
      await uploadCover({
        name: `${result.assets[0].uri.split("/").pop()}`,
        type: "image/jpeg",
        uri: result.assets[0].uri,
      });
    }
  }

  async function pickImage() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (result?.assets && result.assets?.length > 0) {
      // setLocalImage(result.assets[0].uri);
      updateProfilePicture({
        name: `${result.assets[0].uri.split("/").pop()}`,
        type: "image/jpeg",
        uri: result.assets[0].uri,
      });
    }
  }

  function updatePreferredCategories(id: string) {
    const newCategories = categories.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          isSelected: !item.isSelected,
        };
      } else return item;
    });
    setCategories(newCategories);
  }

  function updateUserData(values: {
    nickName: string;
    bio: string;
    fullName: string;
    url: string;
  }) {
    if (userId)
      updateUser({
        id: userId,
        userData: {
          ...values,
          listofCategoryIds: categories.map((item) => item._id),
        },
      });
  }

  return {
    pickCover,
    coverLoading,
    pickImage,
    profileImageLoading,
    validationSchema,
    updateUserData,
    categories,
    updatePreferredCategories,
    isLoading,
  };
};

export default useEditProfile;
