import { axiosInstance } from "./axios";

// The signed-in user is taken from the session token, so no userId is sent.
export const postApi = {
  createPost: async (image, description, location, tags) => {
    try {
      const response = await axiosInstance.post("/post/create-post", {
        image,
        description,
        location,
        tags,
      });
      return response.data;
    } catch (err) {
      console.log("Create Post Error: ", err);
      // Re-throw so the Post page knows it failed
      throw err;
    }
  },
  createCommunity: async (
    name,
    description,
    photoUrl,
    bannerUrl,
    tags,
    themeColor
  ) => {
    try {
      const response = await axiosInstance.post("/post/create-community", {
        name: name,
        description: description,
        photo_url: photoUrl,
        banner_url: bannerUrl,
        tags: tags,
        theme_color: themeColor
      });

      return response.data;

    } catch (err) {
      console.log("Create Community Error: ", err);
      throw err;
    }
  },
  createTag: async (name, description, photoUrl, communityId) => {
    const response = await axiosInstance.post("/post/create-tag", {
      name,
      description,
      photo_url: photoUrl,
      communityId,
    });
    return response.data;
  },
  // bucket: "Posts" | "ProfilePictures". Returns the image's public URL.
  uploadImage: async (bucket, base64) => {
    const response = await axiosInstance.post("/post/upload-image", { bucket, base64 });
    return response.data.url;
  },
};
