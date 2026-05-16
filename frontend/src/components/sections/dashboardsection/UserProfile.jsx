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
      <div className="p-6 text-gray-400 font-mono text-sm">
        $ loading profile...
      </div>
    );
  }

  return (
    <section className="w-full px-6 sm:px-10 lg:px-16 py-4 font-mono text-base text-white">

      <h3 className="text-sm py-3 text-gray-400 sm:hidden">☰</h3>
      <div className="flex items-center gap-6 mb-10 mx-4">

        <img
          src={user.avatar}
          className="w-20 h-20 object-cover rounded-md"
        />

        <div>

          <h1 className="text-2xl text-white tracking-wide">
            {user.fullname}
          </h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
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
        <Line label="folders" value={user.folders?.length || 0} />
        <Line label="files" value={user.files?.length || 0} />
        <Line
          label="joined"
          value={new Date(user.createdAt).toLocaleDateString()}
        />
      </Block>

      <Divider />

      <Block title="status">
        <div className="flex items-center gap-3 text-green-400 text-lg">
          <span className="animate-pulse">●</span>
          active
        </div>
      </Block>

    </section>
  );
}



function Divider() {
  return (
    <div className="my-8 border-t border-gray-700" />
  );
}

function Block({ title, children }) {
  return (
    <div className="mb-6 min-w-sm">
      <p className="text-gray-400 mb-3 text-sm tracking-widest">
        ── {title.toUpperCase()}
      </p>

      <div className="space-y-2 pl-6 white-space:nowrap;">
        {children}
      </div>
    </div>
  );
}

function Line({ label, value }) {
  return (
    <div className="flex gap-6 text-base">
      <span className="w-28 text-gray-400">{label}</span>
      <span className="text-white ">{value}</span>
    </div>
  );
}

export default UserProfile;