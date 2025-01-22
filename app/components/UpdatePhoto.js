import { API_URL } from "@env";
import store from "store";
// Infer the type of the image
const UpdatePhoto = async () => {
  const { profileImage, currentUser } = store();
  let localUri = profileImage;
  let filename = localUri.split("/").pop();
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  // Upload the image using the fetch and FormData APIs
  let formData = new FormData();
  // Assume "photo" is the name of the form field the server expects
  formData.append("photo", { uri: localUri, name: filename, type });

  return await fetch(`${API_URL}/s3/updateMedia/`, {
    method: "PUT",
    body: formData,
    headers: {
      "content-type": "multipart/form-data",
      Authorization: `Bearer ${currentUser.tokens.access.token}`,
      ...data.getHeaders(),
    },
    data: formData,
  });
};

export default UpdatePhoto;
