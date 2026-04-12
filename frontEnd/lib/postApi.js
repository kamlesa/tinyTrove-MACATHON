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
  createCommunity: async (
    userId, 
    name, 
    description, 
    photoUrl, 
    bannerUrl, 
    tags, 
    themeColor
  ) => {
    try {
      // Make sure this URL matches exactly what is in your Express backend!
      const response = await axiosInstance.post("/post/create-community", {
        userId: userId,
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
  createTag: async (userId, name, description, photoUrl) => {
    try {
      const response = await axiosInstance.post("/post/create-tag", {
        userId,        // CRITICAL: The backend needs this to pass the safety check
        name,
        description,   // Matches 'description' in your req.body
        photo_url: photoUrl, // Maps camelCase to the 'photo_url' the backend expects
      });
      return response.data;
    } catch (err) {
      console.log("Create Tag Error: ", err);
      // Always throw the error so your UI can show an Alert to the user
      throw err; 
    }
  },
};