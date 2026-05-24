import { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/LoginContext";
import { toast } from "react-toastify";
const API_BASE = import.meta.env.VITE_API_BASE;


function AuthPage({ mode = "login" }) {
  const [isLogin, setIsLogin] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const { setIsAuth } = useAuth();

  const [email, setEmail] = useState("");


  const [apimessage, setApimessage] = useState("");

  const handleSendOtp = async () => {
    if (!email) {
      toast.info("Enter email to send OTP");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);

      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/users/otpsender`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.success(data.message || "OTP sent successfully");
    } catch (error) {
      console.error("OTP send error:", error);
      toast.error("Failed to send OTP");
    }
  };

  useEffect(() => {
    setApimessage("");
  }, [isLogin])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);




      const url = isLogin
        ? `${API_BASE}/api/v1/users/login`
        : `${API_BASE}/api/v1/users/register`;

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!isLogin && res.ok) {
        setIsLogin(true);
        toast.success("Registration done");
      }
      if (isLogin && res.ok) {
        setIsAuth(true);
      }
      if (!res.ok) {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border-2 border-gray-200 bg-white p-6 rounded-lg">

        <div className="mb-6 text-center">
          <h2 className="font-mono text-2xl text-emerald-900">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="mt-2 text-sm text-emerald-700">
            {isLogin
              ? "Login to continue to SheetXray"
              : "Start building with SheetXray"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <>
              <img src={avatar ? URL.createObjectURL(avatar) : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt="avatar preview" className="w-24 h-24 rounded-full object-cover mx-auto" />
              <input
                type="text"
                placeholder="Full Name"
                name="fullname"
                className="w-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-600 placeholder-gray-400"
              />

              <div className="w-full border border-dashed border-gray-300 bg-gray-50 p-3 text-center text-xs text-gray-700">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="hidden"
                  id="avatar"
                  name="avatar"
                />
                <label htmlFor="avatar" className="cursor-pointer">
                  {avatar ? avatar.name : "Upload avatar"}
                </label>
              </div>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-600 placeholder-gray-400"
          />

          {!isLogin && (
            <>
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full rounded-md border border-emerald-600 bg-emerald-600 px-4 py-2 font-mono text-xs text-white transition hover:bg-emerald-700"
              >
                Send OTP
              </button>

              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="w-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-600 placeholder-gray-400"
              />
            </>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            className="w-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-600 placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full rounded-md border border-emerald-600 bg-emerald-600 px-4 py-2 font-mono text-sm text-white hover:bg-emerald-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-700">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-mono text-emerald-700 underline hover:text-emerald-900"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>


        <div className="mt-6 text-center">
          <HashLink
            smooth
            to="/#"
            className="text-xs text-emerald-700 hover:text-emerald-900 font-mono"
          >
            ← Back to home
          </HashLink>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;