import { useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../../Context/LoginContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { isAuth, setIsAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const url = `${import.meta.env.VITE_API_BASE}/api/v1/users/logout`;
    try {
      const res = await fetch(url, { method: "POST", credentials: "include" });
      if (res.ok) {
        setIsAuth(false);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { label: "Home", to: "/#", show: true },
    { label: "Pricing", to: "/#pricing", show: !isAuth },
    { label: "Features", to: "/#features", show: !isAuth },
    { label: isAuth ? "Dashboard" : "Go to dashboard", to: "/dashboard", show: isAuth },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white p-1 font-sans text-black select-none border-b ">
     

     
      <div className="  p-1   flex items-center justify-end relative">
       
       <div className="flex items-center gap-1 mr-auto">
          <HashLink to="/#" className="font-bold text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
            <span>📊</span> SheetXray
          </HashLink>
       </div>
        {/* Desktop Navigation */}
        <nav className="hidden items-end gap-1 text-xs font-medium sm:flex ">
          {navLinks.map((link) => link.show && (
            <HashLink
              key={link.label}
              smooth
              to={link.to}
              className="px-3 py-1 text-black hover:bg-[#000080] hover:text-white outline-none focus:outline-1 focus:outline-dotted focus:outline-black"
            >
              <span className="underline">{link.label.charAt(0)}</span>{link.label.slice(1)}
            </HashLink>
          ))}

          <div className="h-4 w-[1px] bg-[#808080] mx-1 border-r border-white" />

          {!isAuth ? (
            <HashLink
              smooth
              to="/auth"
              className="px-3 py-1 text-black hover:bg-[#000080] hover:text-white font-bold outline-none focus:outline-1 focus:outline-dotted focus:outline-black"
            >
              Sign Up / Login
            </HashLink>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-black text-left hover:bg-[#000080] hover:text-white font-bold cursor-pointer outline-none focus:outline-1 focus:outline-dotted focus:outline-black"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Mobile Menu Dropdown Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="block sm:hidden bg-white p-1 border border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white text-xs font-bold outline-none"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <div className="flex items-center gap-1 px-1">
            <span>💾</span> Menu {open ? "▲" : "▼"}
          </div>
        </button>

        {/* 3. Mobile Navigation Dropdown Box */}
        {open && (
          <nav className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border-2 border-t-white border-l-white border-b-black border-r-black p-1 flex flex-col gap-0.5 text-xs font-medium sm:hidden shadow-lg">
            {navLinks.map((link) => link.show && (
              <HashLink
                key={link.label}
                smooth
                to={link.to}
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-black hover:bg-[#000080] hover:text-white"
              >
                {link.label}
              </HashLink>
            ))}

            <div className="h-[1px] bg-[#808080] my-1 border-b border-white" />

            {!isAuth ? (
              <HashLink
                smooth
                to="/auth"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-black font-bold hover:bg-[#000080] hover:text-white"
              >
                Login / Sign Up
              </HashLink>
            ) : (
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="px-3 py-1.5 text-left text-black font-bold hover:bg-[#000080] hover:text-white"
              >
                Logout
              </button>
            )}
          </nav>
        )}

      </div>
    </header>
  );
}

export default Navbar;