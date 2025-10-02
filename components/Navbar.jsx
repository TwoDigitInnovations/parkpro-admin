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
    <div className="flex-1 flex items-center justify-between md:space-x-4">
      < p className="text-black text-[22px] font-semibold capitalize  md:mx-0 mx-5">{router.pathname === '/' ? 'Dashboard' : router.pathname.replace('/', '')}</p>
      {/* <div className="flex md:justify-start items-center md:w-[379px] w-full h-[41px] border border-[#00000050] rounded-[12px] px-5">
        <FiSearch className='w-[18px] h-[18px] text-[#00000080] mr-2' />
        <input
          type="text"
          placeholder="Search"
          className="outline-0 text-[#00000080] text-sm font-normal"
        />
      </div> */}
      <div className="md:flex justify-center items-center gap-5 hidden">
        {/* <div className="bg-[#00000011] w-[48px] h-[48px] rounded-full flex justify-center items-center cursor-pointer">
          <FiBell className="text-xl md:text-2xl cursor-pointer" />
        </div> */}
        <div className="bg-[#00000011] w-[48px] h-[48px] rounded-full flex justify-center items-center cursor-pointer">
          <FiUser className="text-xl md:text-2xl cursor-pointer" />
        </div>
        <div className="bg-[#00000011] w-[48px] h-[48px] rounded-full flex justify-center items-center cursor-pointer" onClick={logOut}>
          <PiSignOutFill className="text-xl md:text-2xl cursor-pointer" />
        </div>
      </div>
    </div >
  );
}
