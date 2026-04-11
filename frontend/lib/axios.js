import axios from "axios";

export const axiosInstance = axios.create({
  //baseURL: "http://localhost:3000/api",
  baseURL: "http://192.168.0.38:3000/api",
  withCredentials: true,
});
