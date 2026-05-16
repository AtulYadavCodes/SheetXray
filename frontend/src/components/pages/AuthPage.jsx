import { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/LoginContext";
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
      setApimessage("Enter email to send OTP");
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
      setApimessage(data.message || "OTP sent successfully");
    } catch (error) {
      console.error("OTP send error:", error);
      setApimessage("Failed to send OTP");
    }
  };

  useEffect(() => {
    setApimessage(""); //reset API message on mode swi....
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
        credentials: "include", // for cookies
        body: formData, // no headers!
      });

      const data = await res.json();
      if (!isLogin && res.ok) {
        setIsLogin(true);
      }
      if (isLogin && res.ok) {
        // Redirect to dashboard or homepage after successful login 
        setIsAuth(true);// update auth state in context
      }
      setApimessage(data.message);
      console.log(isLogin ? "Login:" : "Signup:", data);

    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md border-2 border-gray-700 bg-gray-900 p-6 rounded-lg">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="font-mono text-2xl font-semibold text-white">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isLogin
              ? "Login to continue to SheetXray"
              : "Start building with SheetXray"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* SIGNUP ONLY */}
          {!isLogin && (
            <>
              <img src={avatar ? URL.createObjectURL(avatar) : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"} alt="avatar preview" className="w-24 h-24 rounded-full object-cover mx-auto" />
              <input
                type="text"
                placeholder="Full Name"
                name="fullname"
                className="w-full border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-gray-500 placeholder-gray-500"
              />

              {/* Avatar Upload */}
              <div className="w-full border border-dashed border-gray-700 bg-gray-800 p-3 text-center text-xs text-gray-400">
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

          {/* COMMON */}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-yellow-400 placeholder-gray-500"
          />

          {!isLogin && (
            <>
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 font-mono text-xs text-white transition hover:bg-gray-700"
              >
                Send OTP
              </button>

              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="w-full border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-yellow-400 placeholder-gray-500"
              />
            </>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            className="w-full border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-yellow-400 placeholder-gray-500"
          />

          {/* CTA */}
          <button
            type="submit"
            className="w-full rounded-md border border-yellow-400 bg-yellow-400 px-4 py-2 font-mono text-sm font-semibold text-black hover:bg-yellow-300 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* SWITCH */}
        <div className="mt-5 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-mono text-yellow-400 underline hover:text-yellow-300"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>
        <div className="mt-6 font-light text-center text-red-500">

          {apimessage}
        </div>

        {/* BACK */}
        <div className="mt-6 text-center">
          <HashLink
            smooth
            to="/#"
            className="text-xs text-gray-500 hover:text-gray-400 font-mono"
          >
            ← Back to home
          </HashLink>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;