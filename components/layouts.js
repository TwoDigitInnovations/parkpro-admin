"use client";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Sidebar from "../components/SidePannel";
import Navbar from "../components/Navbar";
import { useRouter } from 'next/router'

const Layout = ({ children, loader, toaster }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-white">
      {!(router.pathname.includes('/login')) && <div className="lg:sticky lg:top-0 lg:h-screen md:p-5">
        <Sidebar open={open} setOpen={setOpen} />
      </div>}

      <div className="flex-1 flex flex-col">
        {!(router.pathname.includes('/login')) && <div className="sticky top-5 mr-5 md:ml-0 ml-5 z-40 bg-white border border-[#00000050] rounded-[16px] boxShadow">
          <div className="flex items-center justify-between p-5 md:p-6">
            <button
              className="lg:hidden text-2xl"
              onClick={() => setOpen(true)}
            >
              <FiMenu />
            </button>
            <Navbar />
          </div>
        </div>}

        <main className={`flex-1 ${router.pathname === '/login' ? ' mt-0 mr-0 md:ml-0 ml-0 md:mb-0 mb-0' : ' mt-10 mr-5 md:ml-0 ml-5 md:mb-0 mb-5'}`}>{children}</main>
        {/* mt-10 mr-5 md:ml-0 ml-5 md:mb-0 mb-5 */}
      </div>
    </div>
  );
}

export default Layout;


