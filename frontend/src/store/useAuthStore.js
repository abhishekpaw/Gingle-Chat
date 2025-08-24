import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const SOCKET_URL = "https://gingle-chat.onrender.com";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    //setOnlineUsers: (users) => set({ onlineUsers: users }),
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [], // <-- Add this line
    socket: null,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data})
            get().connectSocket();  // Connect to socket after checking auth
        } catch (error) {
            console.log("Error in checkAuth:",error);
            set({authUser:null});
        } finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true});

        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({ authUser: res.data});
            toast.success("Account created successfully");
            get().connectSocket(); 
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isSigningUp: false});
        }
    },

    login: async(data) => {
        set({isLoggingIng : true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser: res.data});
            toast.success("Logged in successfully");
            get().connectSocket(); 
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isLoggingIng: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged Out Successfully");
            get().disconnectSocket(); // Disconnect socket on logout
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true});

        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile Updated Successfully");
        } catch (error) {
            console.log("error in update profile:",error);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile:false});
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(SOCKET_URL,{
            query: {
                userId : authUser._id
            }
        });
        socket.connect();

        set({socket: socket});

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds});
        });
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    },
}))