import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const routes = [
  { path: "", label: "Files & Folders", icon: "📁" },
  { path: "profile", label: "User Profile", icon: "👤" }
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
        className="absolute left-2 top-4  px-3 py-1 font-mono text-xs font-bold text-black sm:hidden"
        aria-label="Toggle Navigation Sidebar"
      >
       
        <span>{isOpen ? "" : "☰"}</span>
      </button>

      {isOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-30 bg-black/40 sm:hidden"
        />
      )}

     
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white p-2 pt-16 sm:pt-2 transition-transform duration-300   sm:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:sticky sm:top-16.25 sm:h-[calc(100vh-65px)] select-none`}
      >
       
       
          
        

          {/* Route Links */}
          <div className="space-y-2">
            {routes.map((route) => {
              const absolutePath = route.path ? `/dashboard/${route.path}` : "/dashboard";
              return (
                <NavLink
                  key={route.path}
                  to={absolutePath}
                  end={route.path === ""}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block w-full font-mono text-xs p-2 text-left border outline-none ${
                      isActive
                        ? "bg-blue-900 text-white border-black shadow-[inset_1px_1px_0px_#0a0a0a]"
                        : "bg-[#c0c0c0] text-black border-transparent hover:bg-white/30"
                    }`
                  }
                >
                  <span className="inline-block mr-2 text-sm">{route.icon}</span>
                  <span className={({ isActive }) => isActive ? "font-bold" : ""}>
                    {route.label}
                  </span>
                </NavLink>
              );
            })}
          </div>

          <div className="flex-1" />

         
         
            <NavLink
              to="/dashboard/subs"
              onClick={closeMobileMenu}
             className={({ isActive }) =>
                    `block w-full font-mono text-xs p-2 text-left border outline-none ${
                      isActive
                        ? "bg-blue-900 text-white border-black shadow-[inset_1px_1px_0px_#0a0a0a]"
                        : "bg-[#c0c0c0] text-black border-transparent hover:bg-white/30"
                    }`
                  }
            >
            
                <span className="font-bold flex items-center gap-1 ">
                  ⚡ <span>UPGRADE WEBSITE</span>
                </span>
              
            </NavLink>
        

        
      </aside>
    </>
  );
}

export default Sidebar;