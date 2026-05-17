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

  // Centralized Navigation Configurations
  const navLinks = [
    { label: "Home", to: "/#", show: true },
    { label: isAuth ? "Dashboard" : "Go to dashboard", to: "/dashboard/#", show: isAuth },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black backdrop-blur-md bg-opacity-95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <HashLink smooth to="/#" className="font-mono text-lg font-semibold tracking-[0.16em] text-white">
          SheetXray
        </HashLink>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 text-sm sm:flex sm:gap-3">
          {navLinks.map((link) => link.show && (
            <HashLink 
              key={link.label} 
              smooth 
              to={link.to} 
              className="rounded-md px-3 py-2 font-mono text-zinc-400 transition hover:text-white"
            >
              {link.label}
            </HashLink>
          ))}
          
          {!isAuth ? (
            <HashLink
              smooth
              to="/auth"
              className="rounded-md bg-yellow-400 px-3 py-2 font-mono font-semibold text-black transition hover:bg-yellow-300"
            >
              Sign Up / Login
            </HashLink>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-md px-3 py-2 font-mono font-semibold text-zinc-400 transition hover:text-white"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button 
          onClick={() => setOpen(!open)} 
          className="block text-zinc-400 hover:text-white sm:hidden focus:outline-none" 
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg className="h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Navigation Dropdown */}
        {open && (
          <nav className="absolute left-0 right-0 top-full flex flex-col gap-1 border-b border-zinc-800 bg-black px-4 pb-4 pt-2 shadow-xl sm:hidden">
            {navLinks.map((link) => link.show && (
              <HashLink
                key={link.label}
                smooth
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 font-mono text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
              >
                {link.label}
              </HashLink>
            ))}

            {!isAuth ? (
              <HashLink
                smooth
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-md bg-yellow-400 px-3 py-2 text-center font-mono font-semibold text-black transition hover:bg-yellow-300"
              >
                Sign Up / Login
              </HashLink>
            ) : (
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="rounded-md px-3 py-2 text-left font-mono font-semibold text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
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