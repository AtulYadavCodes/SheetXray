


import { HashLink } from 'react-router-hash-link'
import { useAuth } from '../../Context/LoginContext';
import { useNavigate } from 'react-router-dom';


import { useState } from 'react';
function Navbar() {
	const { isAuth, setIsAuth } = useAuth();

	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	//logout
	const handleclick = async () => {
		const url = `${import.meta.env.VITE_API_BASE}/api/v1/users/logout`
		try {
			const res = await fetch(url, {
				method: "POST",
				credentials: "include"
			})
			if (res.ok) {

				navigate("/", { replace: true });
				setIsAuth(false);
			}
		} catch (error) {
			console.error("Logout error:", error);
		}

	}
	//logout ends
	return (
		<header className="sticky w-full top-0 z-20 border-b-2 border-black bg-black">

			<div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
				<HashLink smooth to="/#" className="font-mono text-lg font-semibold tracking-[0.16em] text-white">
					SheetXray
				</HashLink>

				<button onClick={() => setOpen(!open)} className='sm:hidden text-white' >{open ? "X" : "☰"}</button>
				{/* NAV mobile */}
				{open && (
					<nav className=" mt-3 flex flex-col gap-2 border-t border-gray-800 pt-4 bg-black fixed left-0 right-0 top-16 px-4 pb-4">
						<HashLink
							onClick={() => setOpen(false)}
							smooth
							to="/#"
							className="px-3 py-2 rounded-md font-mono text-gray-300 hover:text-white hover:bg-gray-900 transition"
						>
							Home
						</HashLink>

						{isAuth && (
							<HashLink
								onClick={() => setOpen(false)}
								to="/dashboard/#"
								className="px-3 py-2 rounded-md font-mono text-gray-300 hover:text-white hover:bg-gray-900 transition"
							>
								Dashboard
							</HashLink>
						)}

						{!isAuth ? (
							<HashLink
								onClick={() => setOpen(false)}
								to="/auth"
								className="px-3 py-2 rounded-md font-mono font-semibold text-black bg-yellow-400 hover:bg-yellow-300 transition"
							>
								Login
							</HashLink>
						) : (
							<button
								onClick={() => {
									handleclick();
									setOpen(false);
								}}
								className="px-3 py-2 rounded-md font-mono font-semibold text-gray-300 hover:text-white hover:bg-gray-900 transition text-left"
							>
								Logout
							</button>
						)}

					</nav>
				)}
				{/* NAV desktop */}
				<nav className="hidden sm:flex flex-wrap items-center gap-2 text-sm sm:gap-3">
					<HashLink smooth className="px-3 py-2 font-mono text-gray-300 transition hover:text-white" to="/#">
						Home
					</HashLink>
					{isAuth && <HashLink smooth className="px-3 py-2 font-mono text-gray-300 transition hover:text-white" to="/dashboard">
						Go to dashboard
					</HashLink>}
					{!isAuth ? (<HashLink
						smooth className="rounded-md border border-yellow-500 bg-yellow-400 px-3 py-2 font-mono font-semibold text-black transition hover:bg-yellow-300"
						to="/auth"
					>
						Sign Up / Login
					</HashLink>) : <button
						className="px-3 py-2 font-mono font-semibold text-gray-300 transition hover:text-white"
						onClick={handleclick}
					>
						logout
					</button>}
				</nav>
			</div>
		</header>
	)
}

export default Navbar