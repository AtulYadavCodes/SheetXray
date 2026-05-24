import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const routes = [
  { path: "", label: "Files & Folders" },
  { path: "profile", label: "User Profile" }
];

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

  const closeMobileMenu = () => {
    if (window.innerWidth < 640) setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-4 top-10 z-50 rounded-md  text-emerald-700  sm:hidden shadow-sm"
        aria-label="Toggle Navigation Sidebar"
      >
        <svg className="h-4 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            null
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm sm:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white p-4 pt-16 transition-transform duration-300 sm:translate-x-0 sm:pt-4 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } sm:sticky sm:top-16.25 sm:h-[calc(100vh-65px)]`}>

        <div className="space-y-1.5">
          {routes.map((route) => {
            const absolutePath = route.path ? `/dashboard/${route.path}` : "/dashboard";
            return (
              <NavLink
                key={route.path}
                to={absolutePath}
                end={route.path === ""}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block w-full rounded-md my-3 px-4 py-2.5 font-mono text-sm border transition duration-150 text-left ${isActive
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-emerald-700 border-gray-200 hover:bg-emerald-50 hover:text-emerald-900"
                  }`
                }
              >
                {route.label}
              </NavLink>
            );
          })}
        </div>

        <div className="flex-1" />

        <div className="mt-auto pt-4 border-t border-gray-200">
          <NavLink
            to="/dashboard/subs"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `block w-full rounded-md px-4 py-2.5 font-mono text-sm border transition duration-150 text-left ${isActive
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-emerald-700 border-gray-200 hover:bg-emerald-50"
              }`
            }
          >
            {user?.usertype === "pro" ? "✓ Pro Plan Active" : "🚀 Upgrade to Pro"}
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;