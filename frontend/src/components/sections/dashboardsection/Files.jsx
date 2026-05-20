import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


function Files() {
  const { folderid } = useParams();

  const [files, setFiles] = useState([]);
  const [chats, setChats] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedImageKey, setSelectedImageKey] = useState(null);
  const [loadingChatId, setLoadingChatId] = useState(null);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  // fetch files
  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/v1/folders/getallsheetsinfolder/${folderid}`,
        { withCredentials: true }
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
        { withCredentials: true }
      );

      const data = Array.isArray(res.data) ? res.data : res.data.data;

      setChats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Failed to fetch chats:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!userQuery.trim()) return;

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
        { withCredentials: true }
      );

      const newChat = res.data?.data || res.data;

      // Replace temp chat with actual response
      setChats((prev) =>
        prev.map((chat) => (chat._id === tempId ? { ...newChat, isLoading: false } : chat))
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
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  // upload
  const handleUpload = async (file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/v1/sheets/uploadsheet/${folderid}`,
        formData,
        { withCredentials: true }
      );


      fetchFiles();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="mx-auto w-full h-[92dvh]  flex flex-col bg- gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg -gray-950  py-4 backdrop-blur">
        <div className="px-10 my-3 flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="font-mono text-sm uppercase tracking-widest text-white truncate">
              📁 {folderid}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              {files.length} files · {chats.length} chats
            </p>

            <div className="mt-3 flex items-center gap-3 overflow-x-auto">
              {files.length === 0 ? (
                <span className="text-xs text-gray-500">No files uploaded</span>
              ) : (
                files.map((f) => (
                  <div
                    key={f._id}
                    className="flex-none px-3 rounded bg-gray-800 text-xs text-gray-200 truncate max-w-[20rem]"
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
              onChange={(e) => {
                const selected = e.target.files[0];
                if (!selected) return;
                handleUpload(selected);
              }}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-white text-black py-2 px-4 text-xs font-mono rounded-lg hover:bg-gray-200 transition"
            >
              + Upload File
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">

        {/* Chat Interface - Bottom Area */}
        <div className="flex flex-col h-full bg">
          {/* Chat Messages */}
          <div className="flex-1  overflow-y-auto p-6 space-y-4" ref={chatContainerRef}>
            {chats.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💭</div>
                  <p className="text-gray-400 font-mono text-sm">Ask a question about your files</p>
                </div>
              </div>
            ) : (
              chats.map((chat) => (
                <div key={chat._id}>
                  {/* User Query */}
                  <div className="flex justify-end">
                    <div className="max-w-2xl rounded-2xl bg-white/20 border border-white/50 px-4 py-3 text-sm text-white">
                      {chat.userquery}
                    </div>
                  </div>

                  {/* LLM Response */}
                  <div className="flex justify-start mt-3">
                    <div className="max-w-2xl rounded-2xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-gray-300">
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
                        chat.llmresponse
                      )}
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-600 text-right">
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
                className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white outline-none placeholder-gray-500 focus:border-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage || !userQuery.trim()}
                className="rounded-xl bg-white px-4 py-2 text-sm font-mono text-black font-semibold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
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