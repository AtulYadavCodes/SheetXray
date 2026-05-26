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
    const user = await axios.get(
      `${import.meta.env.VITE_API_BASE}/api/v1/users/profile`,
      { withCredentials: true },
    );
    const userdata = user.data?.data || user.data;
    if (userdata.usertype === "free" && chats.length >= 10) {
      toast.info(
        "You have reached the maximum query limit for free users. Please  upgrade your plan.",
      );

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
    loadingChatId(tempId);
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
    const user = await axios.get(
      `${import.meta.env.VITE_API_BASE}/api/v1/users/profile`,
      { withCredentials: true },
    );
    const userdata = user.data?.data || user.data;
    if (userdata.usertype === "free" && files.length >= 10) {
      toast.info(
        "You have reached the maximum file limit for free users. Please  upgrade your plan.",
      );

      return;
    }
    if (!file) return;

    // Validate file type
    const allowedExtensions = [".xlsx", ".csv"];
    const fileName = file.name.toLowerCase();
    const isValidFile = allowedExtensions.some((ext) => fileName.endsWith(ext));

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
      const process = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/v1/folders/query/${folderid}`,
        {
          query: "",
          sheetid: res.data?.data?._id
        },
        { withCredentials: true },
      );
      if (process.status === 200) {
        fetchFiles();
      }
    } catch (err) {
      console.log(err);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  // Windows 95 Classic Bevel Styles
  const winBorderOut = { boxShadow: "inset 1px 1px #fff, inset -1px -1px #0a0a0a, inset 2px 2px #dfdfdf, inset -2px -2px #808080" };
  const winBorderIn = { boxShadow: "inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080" };

  return (
    <section className="mx-auto w-full h-[95dvh] flex flex-col  text-black font-mono">
      {/* Header */}
      <div className="border-b bg-white" >
        <div className="px-10 my-3 flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="font-mono text-sm uppercase tracking-widest text-black bg-[#000080] text-white px-2 py-0.5 truncate">
              📁 {folderid}
            </h2>
            <p className="mt-1 text-xs text-gray-800 font-mono">
              {files.length} files · {chats.length} chats
            </p>

            <div className="mt-3 flex items-center gap-3 overflow-x-auto hide-scrollbar">
              {files.length === 0 ? (
                <span className="text-xs text-gray-700 font-mono">
                  No files uploaded
                </span>
              ) : (
                files.map((f) => (
                  <div
                    key={f._id}
                    className="flex-none px-3 rounded-none bg-white text-xs text-black truncate max-w-[20rem] border border-gray-400 font-mono"
                   
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
              className="bg-[#c0c0c0] text-black py-2 px-4 text-xs font-mono rounded-none active:bg-[#dfdfdf] transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              style={winBorderOut}
            >
              {isUploading ? "Uploading..." : "+ Upload File"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* Chat Interface - Bottom Area */}
        <div className="flex flex-col h-full ">
          {/* Chat Messages */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-white m-2 "
            
            ref={chatContainerRef}
          >
            {chats.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💭</div>
                  <p className="text-black font-mono text-sm">
                    Ask a question about your files
                  </p>
                </div>
              </div>
            ) : (
              chats.map((chat) => (
                <div key={chat._id}>
                  {/* User Query */}
                  <div className="flex justify-end">
                    <div className="max-w-[88%] sm:max-w-2xl whitespace-pre-wrap break-words rounded-none border px-4 py-3 text-sm text-black shadow-none font-mono" style={winBorderOut}>
                      {chat.userquery}
                    </div>
                  </div>

                  {/* LLM Response */}
                  <div className="flex justify-start mt-3 grid-cols-2">
                    <div className="max-w-[88%] sm:max-w-2xl whitespace-pre-wrap break-words rounded-none  border px-4 py-3 text-sm text-black w-100 shadow-none font-mono" style={winBorderOut}>
                      {chat.isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-black rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-black rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      ) : (
                        chat.llmresponse.response
                      )}
                      {chat.llmresponse.graphdata && (
                        <img
                          src={chat.llmresponse.graphdata}
                          className="max-w-full rounded-none  w-100  mt-2"
                         
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-800 text-right font-mono">
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t">
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
                className="flex-1 rounded-none border bg-white px-4 py-2 text-sm text-black outline-none placeholder-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                
              />
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage || !userQuery.trim()}
                className="rounded-none bg-[#c0c0c0] text-black px-4 py-2 text-sm font-mono hover:bg-[#dfdfdf] disabled:opacity-40 disabled:cursor-not-allowed transition font-bold"
                style={winBorderOut}
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