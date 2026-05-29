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
    <section className="mx-auto w-full p-2.5 sm:p-4 sm:my-1  min-h-screen select-none selection:bg-blue-800 selection:text-white border border-t-0 border-r-0 border-b-0 border-black">

      <div className="flex justify-between items-center mb-6      ">
        <h3 className="font-mono text-sm font-bold text-black px-1  hidden sm:block">
          📁 Your Folders
        </h3>
        <h3 className="font-mono text-sm font-bold text-black px-9 sm:hidden">
          📁 Your Folders
        </h3>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="font-mono text-xs font-bold text-black bg-[#c0c0c0] px-3 py-1.5 border shadow-[inset_1px_1px_0px_#ffffff,inset_-1px_-1px_0px_#808080,1px_1px_0px_#0a0a0a] active:shadow-[inset_2px_2px_0px_#0a0a0a,0px_0px_0px_#ffffff] outline-none"
        >
          + Create Folder
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 border border-[#808080] p-4 relative pt-5 shadow-[1px_1px_0px_#ffffff] ">

          <div className="space-y-1">
            <h3 className="text-xs font-mono font-bold text-black">
              Create Folder
            </h3>

          </div>

          <div className="space-y-1">
            <label className="text-xs text-black font-mono font-bold block mt-2">
              Folder Name
            </label>
            <input
              placeholder="e.g. bills / invoices / attendance"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full font-mono text-sm bg-white text-black p-1.5 outline-none border shadow-[inset_2px_2px_0px_#0a0a0a,1px_1px_0px_#ffffff] focus:bg-blue-50"
            />
          </div>

          <div className="space-y-1">

          </div>

          <button
            onClick={handleCreateFolder}
            disabled={creating || !folderName}
            className="w-full font-mono text-xs font-bold text-black bg-[#c0c0c0] py-2 border shadow-[inset_1px_1px_0px_#ffffff,inset_-1px_-1px_0px_#808080,1px_1px_0px_#0a0a0a] active:shadow-[inset_2px_2px_0px_#0a0a0a,0px_0px_0px_#ffffff] disabled:opacity-40 disabled:cursor-not-allowed outline-none mt-4"
          >
            {creating ? "Creating..." : "Create Folder"}
          </button>



        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 bg-white px-4 ">
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
              className={`p-2 flex flex-col items-center justify-between border-2 -transparent bg-blue-900/10 border-dashed border-blue-950 relative group ${f.disabled
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer"
                }`}
            >
              <span className="text-4xl filter drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)] select-none">📁</span>
              <span className="mt-2 font-mono text-xs text-black font-medium text-center truncate w-full px-1 bg-blue-900 text-white">
                {f.foldername}
              </span>
              <span className="text-[10px] text-gray-700 mt-1 font-mono font-bold tracking-tighter">
                {(() => {
                  const count = typeof f.sheetscount !== 'undefined' ? f.sheetscount : (f.fileCount ?? (f.files ? f.files.length : 0));
                  return (
                    <span className="inline-block px-1">
                      [{count} {count === 1 ? 'file' : 'files'}]
                    </span>
                  );
                })()}
              </span>

              <button
                onClick={(e) => handleDeleteFolder(e, f._id, f.foldername)}
                className="absolute top-0 right-0 sm:opacity-0 group-hover:opacity-100 bg-[#c0c0c0] text-black font-bold border border-black px-1.5 text-[9px] hover:bg-red-600 hover:text-white shadow-[1px_1px_0px_#ffffff]"
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