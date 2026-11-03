import axios from "axios";

const ipAddress = process.env.EXPO_PUBLIC_MY_IP_ADDRESS;

export const axiosInstance = axios.create({
  //baseURL: "http://localhost:3000/api",
  baseURL: `http://${ipAddress}:3000/api`,
  withCredentials: true,
});
