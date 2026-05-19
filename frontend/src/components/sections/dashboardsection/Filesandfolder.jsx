import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
function Filesandfolder() {
  const [folders, setFolders] = useState([]);


  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");


  const fetchFolders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/v1/folders/getalluserfolders`,
        { withCredentials: true }
      );
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setFolders(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);




  const handleCreateFolder = async () => {
    setMessage("");
    const name = (folderName || "").trim();
    if (!name) {
      setMessage("Please enter a folder name.");
      return;
    }

    try {
      setCreating(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/v1/folders/createfolder`,
        { foldername: name },
        { withCredentials: true }
      );

      if (res?.data?.message) setMessage(res.data.message);
      setShowCreate(false);
      setFile(null);
      setFolderName("");
      await fetchFolders();
    } catch (err) {
      console.error("Create folder error:", err);
      setMessage(err?.response?.data?.message || "Failed to create folder. See console for details.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFolder = async (e, folderId, folderName) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Delete folder "${folderName}"? This action cannot be undone.`)) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/api/v1/folders/deletefolder/${folderId}`,
        { withCredentials: true }
      );
      setMessage(`Folder "${folderName}" deleted successfully.`);
      await fetchFolders();
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to delete folder.");
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-mono text-sm uppercase tracking-widest text-gray-400 px-1 hidden sm:block">
          Your Folders
        </h3>
        <h3 className="font-mono text-sm uppercase tracking-widest text-gray-400 px-9 sm:hidden">
          Your Folders
        </h3>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-md border border-white/40 bg-white/10 px-3 py-2 text-xs font-mono text-white hover:bg-white/20 transition"
        >
          + Create Folder
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-900 backdrop-blur p-5 space-y-4 shadow-lg">

          {/* Header */}
          <div className="space-y-1">
            <h3 className="text-sm font-mono text-white tracking-wide">
              Create Folder
            </h3>

          </div>

          {/* Folder Name */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-400 font-mono">
              Folder Name
            </label>
            <input
              placeholder="e.g. avatars / invoices / assets"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-white transition placeholder-gray-500"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-1">

          </div>

          {/* Action */}
          <button
            onClick={handleCreateFolder}
            disabled={creating || !folderName}
            className="w-full rounded-lg bg-white text-black py-2 text-xs font-mono font-semibold tracking-wide hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {creating ? "Creating..." : "Create Folder"}
          </button>

          {message && (
            <p className="mt-2 text-sm text-center text-red-400">{message}</p>
          )}

        </div>
      )}

      {/* Folder Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {folders.map((f) => (
          <Link key={f._id} to={`/dashboard/files/${f._id}`}>
            <div
              className="cursor-pointer rounded-xl hover:border-white/40 bg-gray-100 transition p-4 flex flex-col items-center relative group"
            >
              <span className="text-3xl text-white">📁</span>
              <span className="mt-2 text-xs text-gray-900 font-mono text-center truncate w-full">
                {f.foldername}
              </span>

              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteFolder(e, f._id, f.foldername)}
                className="absolute top-1 right-1  group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white rounded-tr-2xl p-1 transition text-xs"
                title="Delete folder"
              >
                x
              </button>
            </div>
          </Link>
        ))}
      </div>




    </section>
  );
}
export default Filesandfolder;