import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUserAuthStore = create((set) => ({
  addUser: async (data) => {
    try {
      console.log("Adding user");
      const res = await axiosInstance.post("/user-auth/create");
      //console.log(res.data);
    } catch (err) {
      console.log("error message", err);
    }
  },
}));
