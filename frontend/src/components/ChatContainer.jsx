import { useEffect, useRef } from "react";
import { Download, FileText } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribetoMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    subscribetoMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribetoMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const downloadFile = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className="chat-bubble max-w-[85%] space-y-2">
                {message.text && <p className="break-words">{message.text}</p>}

                {message.fileType === "image" && message.fileUrl && (
                  <div className="space-y-2">
                    <img
                      src={message.fileUrl}
                      alt={message.fileName || "Shared image"}
                      className="max-w-full rounded-lg border border-base-300"
                    />
                    <button
                      type="button"
                      className="btn btn-xs"
                      onClick={() =>
                        downloadFile(
                          message.fileUrl,
                          message.fileName || "image.png"
                        )
                      }
                    >
                      <Download className="size-3" />
                      Download image
                    </button>
                  </div>
                )}

                {message.fileType === "pdf" && message.fileUrl && (
                  <div className="rounded-lg border border-base-300 bg-base-200 p-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText className="size-8" />
                      <div className="min-w-0">
                        <p className="font-medium break-all">
                          {message.fileName || "document.pdf"}
                        </p>
                        <p className="text-xs opacity-70">PDF document</p>
                      </div>
                    </div>

                    <iframe
                      src={message.fileUrl}
                      title={message.fileName || "PDF preview"}
                      className="h-64 w-full rounded-lg border border-base-300 bg-white"
                    />

                    <button
                      type="button"
                      className="btn btn-xs"
                      onClick={() =>
                        downloadFile(
                          message.fileUrl,
                          message.fileName || "document.pdf"
                        )
                      }
                    >
                      <Download className="size-3" />
                      Download PDF
                    </button>
                  </div>
                )}

                <div className="chat-footer opacity-50 text-xs">
                  {formatMessageTime(message.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;