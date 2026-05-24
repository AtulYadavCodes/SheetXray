import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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

      if (res?.data?.message) toast.info(res.data.message);
      setShowCreate(false);
      setFile(null);
      setFolderName("");
      await fetchFolders();
    } catch (err) {
      console.error("Create folder error:", err);
      toast.info(err?.response?.data?.message || "Failed to create folder.");
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
        <h3 className="font-mono text-sm uppercase tracking-widest text-emerald-700 px-1 hidden sm:block">
          📁 Your Folders
        </h3>
        <h3 className="font-mono text-sm uppercase tracking-widest text-emerald-700 px-9 sm:hidden">
          📁 Your Folders
        </h3>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-md border border-emerald-300 bg-emerald-100 px-3 py-2 text-xs font-mono text-emerald-700 hover:bg-emerald-200 transition"
        >
          + Create Folder
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 rounded-2xl border border-emerald-300 bg-emerald-50 backdrop-blur p-5 space-y-4 shadow-lg">

          <div className="space-y-1">
            <h3 className="text-sm font-mono text-emerald-900 tracking-wide">
              Create Folder
            </h3>

          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-emerald-700 font-mono">
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
            className="w-full rounded-lg bg-emerald-600 text-white py-2 text-xs font-mono tracking-wide hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {creating ? "Creating..." : "Create Folder"}
          </button>



        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 ">
        {folders.map((f) => (
          <Link
            key={f._id}
            to={f.disabled ? "#" : `/dashboard/files/${f._id}`}
            aria-disabled={f.disabled}
            onClick={(e) => {
              if (f.disabled) {
                e.preventDefault();
                e.stopPropagation();
                toast.info(
                  "Upgrade to a premium account to get back access to this folder and create more folders!"
                );
                return;
              }
            }}
            className={f.disabled ? "cursor-not-allowed" : ""}
          >
            <div
              className={`rounded-xl border bg-emerald transition p-4 flex flex-col items-center relative group shadow-sm ${f.disabled
                ? "cursor-not-allowed border-slate-200 opacity-50"
                : "cursor-pointer border-emerald-200 hover:border-emerald-500 hover:shadow-md"
                }`}
            >
              <span className="text-3xl">📁</span>
              <span className="mt-2 text-xs text-emerald-900 font-mono text-center truncate w-full">
                {f.foldername}
              </span>
              <span className="text-[10px] text-emerald-700 mt-1 font-mono ">
                {(() => {
                  const count = typeof f.sheetscount !== 'undefined' ? f.sheetscount : (f.fileCount ?? (f.files ? f.files.length : 0));
                  const badgeClass = count > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600';
                  return (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-mono ${badgeClass}`}>
                      {count} {count === 1 ? 'file' : 'files'}
                    </span>
                  );
                })()}
              </span>

              <button
                onClick={(e) => handleDeleteFolder(e, f._id, f.foldername)}
                className="absolute top-1 right-1 sm:opacity-0 group-hover:opacity-100 bg-red-600  text-white rounded-tr-2xl p-1 transition text-xs"
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