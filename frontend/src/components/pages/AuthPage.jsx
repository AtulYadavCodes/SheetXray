import { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../../Context/LoginContext";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_BASE;

function AuthPage({ mode = "login" }) {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const { setIsAuth } = useAuth();

  useEffect(() => {
    setIsLogin(mode === "login");
  }, [mode]);

  const handleSendOtp = async () => {
    if (!email) {
      toast.info("Enter email to send OTP");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);

      const res = await fetch(`${API_BASE}/api/v1/users/otpsender`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      toast.success(data.message || "OTP sent successfully");
    } catch (error) {
      console.error("OTP send error:", error);
      toast.error(error.message || "Failed to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);

      if (!isLogin && avatar) {
        formData.set("avatar", avatar);
      }

      const url = isLogin
        ? `${API_BASE}/api/v1/users/login`
        : `${API_BASE}/api/v1/users/register`;

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (isLogin) {
        setIsAuth(true);
        toast.success("Logged in successfully");
      } else {
        setIsLogin(true);
        setAvatar(null);
        toast.success("Registration completed! Please log in.");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#008080] flex items-center justify-center p-4 selection:bg-blue-800 selection:text-white select-none">
      {/* Main Window Frame */}
      <div className="w-full max-w-md bg-gray-100 p-1 shadow-[inset_1px_1px_0px_#ffffff,inset_-1px_-1px_0px_#0a0a0a,2px_2px_0px_#0a0a0a]">






        <div className="p-3">
          <div className="mb-4 b border-white ">
            <h2 className="font-mono font-bold text-xl text-black">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-white p-1 border-2 shadow-[inset_2px_2px_0px_#0a0a0a,inset_-2px_-2px_0px_#ffffff]">
                    <img
                      src={avatar ? URL.createObjectURL(avatar) : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"}
                      alt="avatar preview"
                      className="w-full h-full object-cover pixelated"
                    />
                  </div>
                </div>



                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs font-bold text-black">Full Name:</label>
                  <input
                    type="text"
                    name="fullname"
                    required
                    className="w-full font-mono text-sm bg-white text-black p-1.5 outline-none border shadow-[inset_2px_2px_0px_#0a0a0a,1px_1px_0px_#ffffff] focus:bg-blue-50"
                  />
                </div>
                <div className="bg-[#dcdcdc] p-2 border shadow-[inset_1px_1px_0px_#0a0a0a,1px_1px_0px_#ffffff] text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0] || null)}
                    className="hidden"
                    id="avatar"
                    name="avatar"
                  />
                  <label htmlFor="avatar" className="cursor-pointer block font-mono text-xs font-bold text-black hover:underline">
                    [{avatar ? avatar.name : "BROWSE AVATAR..."}]
                  </label>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs font-bold text-black">Email Address:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full font-mono text-sm bg-white text-black p-1.5 outline-none border shadow-[inset_2px_2px_0px_#0a0a0a,1px_1px_0px_#ffffff] focus:bg-blue-50"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2 bg-[#dcdcdc] p-2 border border-[#808080]">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full font-mono text-xs font-bold text-black bg-[#c0c0c0] px-4 py-1.5 border shadow-[inset_1px_1px_0px_#ffffff,inset_-1px_-1px_0px_#808080,1px_1px_0px_#0a0a0a] active:shadow-[inset_2px_2px_0px_#0a0a0a,0px_0px_0px_#ffffff] outline-none"
                >
                  REQUEST OTP TOKEN
                </button>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs font-bold text-black">Verification OTP:</label>
                  <input
                    type="text"
                    name="otp"
                    required
                    className="w-full font-mono text-sm bg-white text-black p-1.5 outline-none border shadow-[inset_2px_2px_0px_#0a0a0a,1px_1px_0px_#ffffff]"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs font-bold text-black">Security Password:</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full font-mono text-sm bg-white text-black p-1.5 outline-none border shadow-[inset_2px_2px_0px_#0a0a0a,1px_1px_0px_#ffffff] focus:bg-blue-50"
              />
            </div>

            <button
              type="submit"
              className="w-full font-mono text-sm font-bold text-black bg-[#c0c0c0] py-2 border shadow-[inset_1px_1px_0px_#ffffff,inset_-1px_-1px_0px_#808080,1px_1px_0px_#0a0a0a] active:shadow-[inset_2px_2px_0px_#0a0a0a,0px_0px_0px_#ffffff] outline-none mt-2"
            >
              {isLogin ? "EXECUTE LOGIN" : "COMMIT REGISTRATION"}
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-white text-center font-mono text-xs text-black">
            <span>{isLogin ? "New user target?" : "Existing user profile found?"}</span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold underline text-blue-900 hover:text-blue-700"
            >
              [{isLogin ? "Register" : "Login"}]
            </button>
          </div>

          <div className="mt-3 text-center">
            <HashLink
              smooth
              to="/#"
              className="font-mono text-xs text-gray-800 hover:text-black underline"
            >
              📌 Abort System and Return Home
            </HashLink>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthPage;