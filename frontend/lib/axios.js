import axios from "axios";

export const axiosInstance = axios.create({
  //baseURL: "http://localhost:3000/api",
  baseURL: "http://192.168.0.139:3000/api",
  withCredentials: true,
});
