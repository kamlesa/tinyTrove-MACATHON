import { authApi } from "./authApi";
import { axiosInstance } from "./axios";

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
    }
  },
};
