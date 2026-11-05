import { axiosInstance } from "./axios";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const authApi = {
  signIn: async (email, password) => {
    const response = await axiosInstance.post("/user-auth/sign-in", {
      email,
      password,
    });
    return response.data;
  },

  signUp: async (email, password, username, displayName) => {
    const response = await axiosInstance.post("/user-auth/sign-up", {
      email,
      password,
      username,
      displayName,
    });
    return response.data;
  },

  signOut: async () => {
    const response = await axiosInstance.post("/user-auth/sign-out");
    return response.data;
  },

  getProfile: async (userId) => {
    const response = await axiosInstance.get(`/user-auth/profile/${userId}`);
    return response.data;
  },

  getPosts: async (userId) => {
    const response = await axiosInstance.get(`/user-auth/posts/${userId}`);
    return response.data;
  },

  getUserCommunities: async (userId) => {
    const response = await axiosInstance.get(`/user-auth/communities/${userId}`);
    return response.data;
  },

  joinCommunity: async (userId, communityId) => {
  const response = await axiosInstance.post("/user-auth/join-community", { userId, communityId });
  return response.data;
  },

  leaveCommunity: async (userId, communityId) => {
    const response = await axiosInstance.post("/user-auth/leave-community", { userId, communityId });
    return response.data;
  },
};
