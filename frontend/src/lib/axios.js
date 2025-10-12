 import axios from "axios";

 export const axiosInstance = axios.create({
    baseURL: "https://gingle-chat.onrender.com/api",
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZlYzIyNjFiMDdiY2Y1ODkxYmZmYjciLCJpYXQiOjE3NTYwNjI0MTcsImV4cCI6MTc1NjY2NzIxN30.kXjYw9VhuCiao5gQfJg_oOrj65TdnQqarwJ8V7JZAvo`
    },
    withCredentials: true,
 });