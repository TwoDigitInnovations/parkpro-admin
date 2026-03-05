import { FiBell, FiUser } from "react-icons/fi";
import { useRouter } from 'next/router'
import { FiSearch } from "react-icons/fi";
import { PiSignOutFill } from "react-icons/pi";
import { useContext } from "react";
import { userContext } from "@/pages/_app";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useContext(userContext)

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex-1 flex items-center justify-between md:space-x-4 md:bg-black h-10 ">
    
      <div className="md:flex justify-center items-center gap-5 hidden">
      
      </div>
    </div >
  );
}
