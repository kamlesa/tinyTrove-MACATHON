import axios from "axios";

export const axiosInstance = axios.create({
  //baseURL: "http://localhost:3000/api",
  baseURL: "http://118.139.43.145:3000/api",
  withCredentials: true,
});