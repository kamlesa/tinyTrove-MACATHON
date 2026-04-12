import axios from "axios";

export const axiosInstance = axios.create({
  //baseURL: "http://localhost:3000/api",
  baseURL: "http://192.168.1.115:3000/api",
  withCredentials: true,
});
