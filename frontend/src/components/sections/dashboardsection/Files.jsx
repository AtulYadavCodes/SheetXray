import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Files() {
  const { folderid } = useParams();

  const [files, setFiles] = useState([]);
  const [chats, setChats] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedImageKey, setSelectedImageKey] = useState(null);
  const [loadingChatId, setLoadingChatId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  // fetch files
  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/v1/folders/getallsheetsinfolder/${folderid}`,
        { withCredentials: true },
      );

      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setFiles(data);

    } catch (err) {
      console.log(err);
    }
  };

  // fetch chats for this folder
  const fetchChats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/v1/folders/getchathistory/${folderid}`,
        { withCredentials: true },
      );

      const data = Array.isArray(res.data) ? res.data : res.data.data;

      setChats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Failed to fetch chats:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!userQuery.trim()) return;

    // Require at least one uploaded file to query
    if (!files || files.length === 0) {
      toast.info("Please upload a file before sending a query.");
      return;
    }
    const user = await axios.get(`${import.meta.env.VITE_API_BASE}/api/v1/users/profile`, { withCredentials: true });
    const userdata = user.data?.data || user.data;
    if (userdata.usertype === "free" && chats.length >= 10) {
      toast.info("You have reached the maximum query limit for free users. Please  upgrade your plan.");

      return;
    }

    // Create a temporary chat ID for optimistic update
    const tempId = `temp_${Date.now()}`;
    const query = userQuery;

    // Immediately add user message to UI (optimistic update)
    const tempChat = {
      _id: tempId,
      userquery: query,
      llmresponse: "",
      createdAt: new Date(),
      isLoading: true,
    };

    setChats((prev) => [...prev, tempChat]);
    setUserQuery("");
    setLoadingChatId(tempId);
    setSendingMessage(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/v1/folders/query/${folderid}`,
        { query: query },
        { withCredentials: true },
      );

      const newChat = res.data?.data || res.data;

      // Replace temp chat with actual response
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === tempId ? { ...newChat, isLoading: false } : chat,
        ),
      );
      setLoadingChatId(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove temp chat on error
      setChats((prev) => prev.filter((chat) => chat._id !== tempId));
      setLoadingChatId(null);
      alert("Failed to send message. Try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchChats();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  // upload
  const handleUpload = async (file) => {

    const user = await axios.get(`${import.meta.env.VITE_API_BASE}/api/v1/users/profile`, { withCredentials: true });
    const userdata = user.data?.data || user.data;
    if (userdata.usertype === "free" && files.length >= 10) {
      toast.info("You have reached the maximum file limit for free users. Please  upgrade your plan.");

      return;
    }
    if (!file) return;


    // Validate file type
    const allowedExtensions = [".xlsx", ".csv"];
    const fileName = file.name.toLowerCase();
    const isValidFile = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!isValidFile) {
      alert("Only .xlsx and .csv files are allowed");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/v1/sheets/uploadsheet/${folderid}`,
        formData,
        { withCredentials: true },
      );

      fetchFiles();

    } catch (err) {
      console.log(err);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="mx-auto w-full h-[92dvh] flex flex-col bg-white text-emerald-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white py-4 backdrop-blur">
        <div className="px-10 my-3 flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-900 truncate">
              📁 {folderid}
            </h2>
            <p className="mt-1 text-xs text-emerald-700">
              {files.length} files · {chats.length} chats
            </p>

            <div className="mt-3 flex items-center gap-3 overflow-x-auto hide-scrollbar">
              {files.length === 0 ? (
                <span className="text-xs text-emerald-700">No files uploaded</span>
              ) : (
                files.map((f) => (
                  <div
                    key={f._id}
                    className="flex-none px-3 rounded bg-emerald-100 text-xs text-emerald-800 truncate max-w-[20rem] border border-emerald-200"
                    title={f.sheetname}
                  >
                    {f.sheetname}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.csv"
              onChange={(e) => {
                const selected = e.target.files[0];
                if (!selected) return;
                handleUpload(selected);
                // Reset file input
                e.target.value = "";
              }}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="bg-emerald-600 text-white py-2 px-4 text-xs font-mono rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "+ Upload File"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* Chat Interface - Bottom Area */}
        <div className="flex flex-col h-full bg-white">
          {/* Chat Messages */}
          <div
            className="flex-1  overflow-y-auto p-6 space-y-4"
            ref={chatContainerRef}
          >
            {chats.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💭</div>
                  <p className="text-emerald-700 font-mono text-sm">
                    Ask a question about your files
                  </p>
                </div>
              </div>
            ) : (
              chats.map((chat) => (
                <div key={chat._id}>
                  {/* User Query */}
                  <div className="flex justify-end">
                    <div className="max-w-[88%] sm:max-w-2xl whitespace-pre-wrap break-words rounded-2xl bg-gray-50   px-4 py-3 text-sm text-emerald-900 shadow-md">
                      {chat.userquery}
                    </div>
                  </div>

                  {/* LLM Response */}
                  <div className="flex justify-start mt-3 grid-cols-2">
                    <div className="max-w-[88%] sm:max-w-2xl whitespace-pre-wrap break-words rounded-2xl bg-gray-50  px-4 py-3 text-sm text-emerald-900 w-100 shadow-md">
                      {chat.isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      ) : (
                        chat.llmresponse.response)}
                      {chat.llmresponse.graphdata && (
                        <img src={chat.llmresponse.graphdata} className="max-w-full rounded pt-6 w-100" />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-emerald-700 text-right">
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input */}
          <div className=" p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={sendingMessage}
                placeholder="Ask a question about your files..."
                className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-emerald-900 outline-none placeholder-gray-400 focus:border-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage || !userQuery.trim()}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-mono text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {sendingMessage ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Files;
