import { create } from "zustand";
import {toast} from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get("/messages/users");
            set({
                users: response.data,
                isUsersLoading: false
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
            set({ isUsersLoading: false });
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
         const response = await axiosInstance.get(`/messages/${userId}`);
            set({
                messages: response.data,
                isMessagesLoading: false
            });   
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
            set({ isMessagesLoading: false });
        } finally{
            set({ isMessagesLoading: false });
        }
    },

    //Send Message

    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages: [...messages,res.data]});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    subscribetoMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;
        
        const socket = useAuthStore.getState().socket;

        //todo: optimize this one later
        socket.on("newMessage", (newMessage) => {
            set({
                messages: [...get().messages,newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    // todo: optimize this one later
    setSelectedUser: (selectedUser) => set({ selectedUser}),
}));