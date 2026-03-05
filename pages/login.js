import { MdArrowForward, MdEmail, MdPassword } from "react-icons/md";
import { useContext, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export default function Login(props) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [userDetail, setUserDetail] = useState({
    username: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);
  const [eyeIcon, setEyeIcon] = useState(false);

  const submit = async () => {
    if (userDetail.username && userDetail.password) {
      props.loader(true);
      Api(
        "post",
        "auth/login",
        { ...userDetail, email: userDetail.username },
        router,
      ).then(
        (res) => {
          props.loader(false);
          if (
            res?.status &&
            (res?.data?.user?.role === "admin" ||
              res?.data?.user?.role === "superadmin" ||
              res?.data?.user?.role === "landlord_admin")
          ) {
            localStorage.setItem("userDetail", JSON.stringify(res.data.user));
            setUser(res.data?.user);
            setUserDetail({ username: "", password: "" });
            localStorage.setItem("token", res.data.token);
            props.toaster({ type: "success", message: "Login Successful" });
            router.push("/");
          } else {
            props.toaster({ type: "error", message: "You are not authorized" });
          }
        },
        (err) => {
          props.loader(false);
          console.log(err);
          props.toaster({ type: "error", message: err?.message });
        },
      );
    } else {
      props.toaster({ type: "error", message: "Missing credentials" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center  md:flex-row bg-gray-50">
     
      <div className="flex flex-col justify-center w-full md:w-1/2 lg:w-6/12 px-6 sm:px-10 md:px-16 lg:px-40 py-12 bg-white">
    
        <div className="mb-10">
          <img
            className="w-[140px] sm:w-[160px] "
            src="/logo.png"
            alt="Logo"
          />

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Welcome Back
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Sign in to access your dashboard
          </p>
        </div>

   
        <div className="w-full max-w-md">
        
          <div className="flex items-center border border-gray-300 focus-within:border-black rounded-xl px-4 py-3 transition-all bg-gray-50 mb-4">
            <MdEmail className="text-gray-400 text-lg mr-3" />
            <input
              type="email"
              placeholder="Email Address"
              className="bg-transparent outline-none w-full text-gray-700 text-sm"
              value={userDetail.username}
              onChange={(e) =>
                setUserDetail({ ...userDetail, username: e.target.value })
              }
            />
          </div>
          {submitted && userDetail.username === "" && (
            <p className="text-red-500 text-xs mb-4">Email is required</p>
          )}

          {/* Password */}
          <div className="flex items-center border border-gray-300 focus-within:border-black rounded-xl px-4 py-3 mb-4 transition-all bg-gray-50 relative">
            <MdPassword className="text-gray-400 text-lg mr-3" />
            <input
              type={!eyeIcon ? "password" : "text"}
              placeholder="Password"
              className="bg-transparent outline-none w-full text-gray-700 text-sm pr-8"
              value={userDetail.password}
              onChange={(e) =>
                setUserDetail({ ...userDetail, password: e.target.value })
              }
            />
            <div className="absolute right-4 cursor-pointer">
              {!eyeIcon ? (
                <IoEyeOffOutline
                  className="w-5 h-5 text-gray-400"
                  onClick={() => setEyeIcon(true)}
                />
              ) : (
                <IoEyeOutline
                  className="w-5 h-5 text-gray-400"
                  onClick={() => setEyeIcon(false)}
                />
              )}
            </div>
          </div>
          {submitted && userDetail.password === "" && (
            <p className="text-red-500 text-xs mb-4">Password is required</p>
          )}

          {/* Button */}
          <button
            onClick={submit}
            className="w-full cursor-pointer bg-black text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            Sign In
          </button>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 lg:w-6/12 relative">
        <img
          src="/imageparkpro.png"
          alt="Dashboard Preview"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-white"></div>

        {/* <div className="absolute bottom-12 left-12 text-black max-w-sm">
          <h2 className="text-2xl lg:text-2xl font-semibold leading-snug">
            Smart Access Control System
          </h2>
          <p className="text-sm mt-3 text-gray-700">
            Manage roles, monitor activity, and control access — all in one
            place.
          </p>
        </div> */}
      </div>
    </div>
  );
}
