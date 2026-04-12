import axios from "axios";

const ipAddress = process.env.MY_IP_ADDRESS;

export const axiosInstance = axios.create({
  //baseURL: "http://localhost:3000/api",
  baseURL: "http://118.139.64.252:3000/api",
  withCredentials: true,
});
