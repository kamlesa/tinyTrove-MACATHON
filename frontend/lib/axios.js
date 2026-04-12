import axios from "axios";

const ipAddress = process.env.MY_IP_ADDRESS;

export const axiosInstance = axios.create({
  //baseURL: "http://localhost:3000/api",
<<<<<<< HEAD
  baseURL: "http://192.168.1.110:3000/api",
=======
  baseURL: "http://192.168.0.38:3000/api",
>>>>>>> 4c7b27109594767e3faf79b5601a7ee9286da954
  withCredentials: true,
});
