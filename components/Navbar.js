import { FiBell, FiMenu, FiUser } from "react-icons/fi";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import { PiSignOutFill } from "react-icons/pi";
import { useContext } from "react";
import { userContext } from "@/pages/_app";

export default function Header({ setOpen }) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="w-full flex items-center justify-between bg-black h-14 px-0 md:px-4">
      <img
        className="w-[140px] w-[160px] text-black md:hidden flex"
        src="/logo1.png"
        alt="Logo"
      />
      <button
        className="lg:hidden text-2xl text-white md:hidden flex"
        onClick={() => setOpen(true)}
      >
        <FiMenu />
      </button>
    </div>
  );
}
