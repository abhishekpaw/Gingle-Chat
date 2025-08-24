 import axios from "axios";

 export const axiosInstance = axios.create({
    baseURL: "https://gingle-chat.onrender.com/api",
    withCredentials: true,
 });