import { authApi } from "./authApi";
import { axiosInstance } from "./axios";

export const postApi = {
  // 1. Add userId as the FIRST argument here
  createPost: async (userId, image, description, location, tags) => {
    try {
      const response = await axiosInstance.post("/post/create-post", {
        userId, // 2. Add userId to the payload being sent
        image,
        description,
        location,
      });
      return response.data;
    } catch (err) {
      console.log("Create Post Error: ", err);
      // 3. CRITICAL: You must throw the error so your Post.js file knows it failed!
      throw err; 
    }
  },
};