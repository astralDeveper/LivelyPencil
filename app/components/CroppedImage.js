import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { API_URL } from "@env";
import axios from "axios";

export async function CroppedImage(
  aspectRatio,
  currentUser,
  pageText,
  setPageText,
  richText,
  size,
  liveBookSocket,
  page,
  onImageAdded
  // setPickImgFlag
) {
  const handleChange = (data) => {
    liveBookSocket.emit("page_updated", {
      bookId: page.bookId,
      authorId: currentUser.user.id,
      data: data,
    });
  };

  if ((pageText.match(/<img /g) || []).length == "1") {
    Alert.alert("Limit Reached", "Media is taking almost 70% of text space");
    return;
  }
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: aspectRatio ? true : false,

    // For Full Size we don't need ascpect ration so we need || undefined
    aspect: aspectRatio || undefined,
  });

  if (result.granted === false) {
    alert("Permission to access camera roll is required!");
    return;
  }
  if (result.canceled) {
    return;
  }

  let formData = new FormData();
  let localUri = result.assets[0].uri;
  let filename = localUri.split("/").pop();

  // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  // Add the image data to the form data
  formData.append("file", { uri: localUri, name: filename, type });
  axios({
    method: "post",
    url: `${API_URL}/s3/addMedia`,
    data: formData,
    headers: {
      Authorization: `Bearer ${currentUser.tokens.access.token}`, // assuming it's a Bearer token
      "Content-Type": "multipart/form-data",
    },
  })
    .then(function (response) {
      // const imageUrl = `${API_URL}/s3/getMedia/` + response.data.fileKey;
      const imageUrl = `${process.env.S3}/` + response.data.fileKey;
      const combinedHTML = `<img class="${size}" src="${imageUrl}" style="width:100%"/>`;
      handleChange(pageText + combinedHTML);
      if (pageText.length >= 4) {
        // If user insert image on same line then we close that line using </div>
        richText.current?.insertHTML("</div>");
      }
      richText.current?.insertHTML(combinedHTML);
      // if (size != "full" && pageText == "") { removing page text experiment
      if (size != "full") {
        richText.current?.insertHTML(
          `<div style='color:gray'>Write Something...</div>`
        );
      } else {
        richText.current?.insertHTML("<span></span>");
        handleChange(combinedHTML);
      }
    })
    .finally(() => richText?.current?.dismissKeyboard())

    .catch(function (error) {
      console.log(error);
    });
}

export default CroppedImage;
