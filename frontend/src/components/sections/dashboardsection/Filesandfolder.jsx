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
      setFolders([]);
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
    <section className="mx-auto w-full max-w-6xl px-4 my-1 py-6 bg-white min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <h3 className="font-mono text-sm uppercase tracking-widest text-emerald-700 px-1 hidden sm:block font-semibold">
          📁 Your Folders
        </h3>
        <h3 className="font-mono text-sm uppercase tracking-widest text-emerald-700 px-9 sm:hidden font-semibold">
          📁 Your Folders
        </h3>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-md border border-emerald-300 bg-emerald-100 px-3 py-2 text-xs font-mono text-emerald-700 hover:bg-emerald-200 transition font-semibold"
        >
          + Create Folder
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 rounded-2xl border border-emerald-300 bg-emerald-50 backdrop-blur p-5 space-y-4 shadow-lg">

          <div className="space-y-1">
            <h3 className="text-sm font-mono text-emerald-900 tracking-wide font-semibold">
              Create Folder
            </h3>

          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-emerald-700 font-mono font-semibold">
              Folder Name
            </label>
            <input
              placeholder="e.g. avatars / invoices / assets"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-900 outline-none focus:border-emerald-600 transition placeholder-emerald-400"
            />
          </div>

          <div className="space-y-1">

          </div>

          <button
            onClick={handleCreateFolder}
            disabled={creating || !folderName}
            className="w-full rounded-lg bg-emerald-600 text-white py-2 text-xs font-mono font-semibold tracking-wide hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {creating ? "Creating..." : "Create Folder"}
          </button>

          {message && (
            <p className="mt-2 text-sm text-center text-red-600">{message}</p>
          )}

        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {folders.map((f) => (
          <Link key={f._id} to={`/dashboard/files/${f._id}`}>
            <div
              className="cursor-pointer rounded-xl border border-emerald-200 hover:border-emerald-500 bg-emerald-50 transition p-4 flex flex-col items-center relative group shadow-sm hover:shadow-md"
            >
              <span className="text-3xl">📁</span>
              <span className="mt-2 text-xs text-emerald-900 font-mono text-center truncate w-full font-semibold">
                {f.foldername}
              </span>

              <button
                onClick={(e) => handleDeleteFolder(e, f._id, f.foldername)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white rounded-tr-2xl p-1 transition text-xs"
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