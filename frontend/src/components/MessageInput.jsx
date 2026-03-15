import { useEffect, useRef, useState } from "react";
import { FileText, Image, Paperclip, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const { sendMessage } = useChatStore();

  const resetAttachment = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processFile = (file) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (!isImage && !isPdf) {
      toast.error("Only image and PDF files are allowed");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedFile({
        name: file.name,
        type: isImage ? "image" : "pdf",
        data: reader.result,
      });

      setFilePreview({
        name: file.name,
        type: isImage ? "image" : "pdf",
        url: isImage ? reader.result : null,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  useEffect(() => {
    const target = textareaRef.current;
    if (!target) return;

    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items?.length) return;

      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            processFile(file);
            break;
          }
        }
      }
    };

    target.addEventListener("paste", handlePaste);
    return () => target.removeEventListener("paste", handlePaste);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !selectedFile) return;

    try {
      await sendMessage({
        text: text.trim(),
        file: selectedFile?.data || "",
        fileName: selectedFile?.name || "",
        fileType: selectedFile?.type || "",
      });

      setText("");
      resetAttachment();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="w-full p-4 border-t border-base-300">
      {filePreview && (
        <div className="mb-3 rounded-xl border border-base-300 bg-base-200 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {filePreview.type === "image" ? (
                <img
                  src={filePreview.url}
                  alt="Preview"
                  className="h-20 w-20 rounded-lg object-cover border border-base-300"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-base-300 bg-base-100">
                  <FileText className="size-8" />
                </div>
              )}

              <div>
                <p className="font-medium text-sm break-all">{filePreview.name}</p>
                <p className="text-xs opacity-70">
                  {filePreview.type === "image" ? "Image ready to send" : "PDF ready to send"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetAttachment}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          className="textarea textarea-bordered w-full resize-none"
          placeholder="Type a message or paste an image/PDF..."
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />

        <button
          type="button"
          className="btn btn-circle"
          onClick={() => fileInputRef.current?.click()}
          title="Attach image or PDF"
        >
          <Paperclip className="size-5" />
        </button>

        <button
          type="submit"
          className="btn btn-circle btn-primary"
          title="Send message"
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;