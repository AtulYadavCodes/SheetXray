// Sidebar.jsx
import { NavLink } from "react-router-dom";

import { useState, useEffect, useRef } from "react";
const Routes = [
  {
    path: "", label: "Files & Folders"
  },
  {
    path: "profile", label: "User Profile"
  }
]
function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/v1/users/profile`,
          { credentials: "include" }
        );
        const result = await res.json();
        setUser(result.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);
  return (
    <>
      <button
        className="sm:hidden fixed top-21 min-w-10 h-5 left-4 z-30  rounded-md  text-gray-400 "
        onClick={() => setIsOpen(!isOpen)}
      >

      </button>
      <aside className={`${isOpen ? "flex fixed z-40" : "hidden"}  sm:flex h-[80vh] w-64 flex-col border-r  p-4`}>




        <div className="space-y-2">
          {Routes.slice(0, 2).map((route) => {
            const path = route.path ? `/dashboard/${route.path}` : "/dashboard";

            return (
              <NavLink
                key={route.path}
                to={path}
                onClick={() => { if (window.innerWidth < 640) setIsOpen(!isOpen) }}
                end={route.path === ""} // important for "/dashboard"
                className={({ isActive }) =>
                  `w-full block text-left font-mono text-sm px-4 py-2 border transition ${isActive
                    ? "bg-yellow-500 text-black border-yellow-500 font-semibold"
                    : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                  }`
                }
              >
                {route.label}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="flex-1" />

        {/* Bottom */}
        <div className="space-y-3">
          {Routes.slice(2).map((route) => {
            const path = `/dashboard/${route.path}`;

            return (
              <NavLink
                onClick={() => { if (window.innerWidth < 640) setIsOpen(!isOpen) }}
                key={route.path}
                to={path}
                className={({ isActive }) =>
                  `w-full block text-left font-mono text-sm px-4 py-2 border transition ${isActive
                    ? "bg-yellow-500 text-black border-yellow-500 font-semibold"
                    : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                  }`
                }
              >
                {route.label}
              </NavLink>
            );
          })}

          {/* Subscription Button */}
          <NavLink
            to="/dashboard/subs"
            onClick={() => { if (window.innerWidth < 640) setIsOpen(!isOpen) }}
            className={({ isActive }) =>
              `w-full block text-left font-mono text-sm px-4 py-2 border transition ${isActive
                ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
              }`
            }
          >
            {user?.usertype === 'pro' ? '✓ Pro Plan' : '🚀 Get Pro'}
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;