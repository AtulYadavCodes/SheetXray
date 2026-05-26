import React, { useEffect, useState } from "react";

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/v1/users/profile`,
        { credentials: "include" }
      );
      const result = await res.json();
      setUser(result.data);
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      // Windows 95 setup/loading screen aesthetic
      <div className="p-6 bg-[#008080] text-[#c0c0c0] font-mono text-sm min-h-screen">
        $ loading profile...
      </div>
    );
  }

  return (
    // The classic Windows teal background, using monospace font for retro feel
    <section className="w-full  sm:px-10 lg:px-16 py-8 font-mono text-base  text-black min-h-screen border border-t-0 border-r-0 border-b-0 border-black">

      <h3 className="text-sm py-3 text-white sm:hidden"></h3>
      
      {/* Profile Header Box styled like an old application banner */}
      <div className="flex items-center gap-6 mb-10 mx -4 p-4 ">
        <img
          src={user.avatar}
          // Inset border around avatar to make it look sunken into the UI
          className="w-20 h-20 object-cover border-2 border-b-white border-r-white border-t-[#808080] border-l-[#808080] bg-gray-400"
          alt="Avatar"
        />

        <div>
          <h1 className="  tracking-wide text-black">
            {user.fullname}
          </h1>
          <p className="text-[#404040] text-sm ">{user.email}</p>
        </div>
      </div>

      <Divider />

      <Block title="account">
        <Line label="type" value={user.usertype} />
        <Line label="id" value={user._id} />
        <Line
          label="created"
          value={new Date(user.createdAt).toLocaleString()}
        />
      </Block>

      <Divider />

      <Block title="stats">
        <Line label="folders" value={user.folders || 0} />
        <Line
          label="joined"
          value={new Date(user.createdAt).toLocaleDateString()}
        />
      </Block>

      <Divider />

      <Block title="status">
        {/* Retro status container with classic Windows dark-gray sunken well look */}
        <div className="inline-flex items-center gap-3 px-3 py-1 text-sm bg-black text-[#00ff00] border border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
          <span className="animate-pulse">●</span>
          active
        </div>
      </Block>

    </section>
  );
}

// 3D Beveled Divider (Light/Dark shadow trick)
function Divider() {
  return (
    <div className="my-8 border-t-2 border-t-[#808080] border-b-2 border-b-white h-0" />
  );
}

// Block styled like a GroupBox with an aligned legend title
function Block({ title, children }) {
  return (
    <div className="mb-6 min-w-sm p-4 ">
      <p className="text-[#000080] mb-3 text-xs tracking-widest font-bold uppercase">
        ■ {title}
      </p>

      <div className="space-y-2 pl-4 whitespace-nowrap">
        {children}
      </div>
    </div>
  );
}

// Individual information line styled like classic dialog properties
function Line({ label, value }) {
  return (
    <div className="flex gap-6 text-sm">
      <span className="w-28 text-[#404040] font-bold select-none">{label}:</span>
      <span className="text-black bg-[#edf0f5] px-2 border border-t-[#808080] border-l-[#808080] border-b-white border-r-white select-all">
        {value}
      </span>
    </div>
  );
}

export default UserProfile;