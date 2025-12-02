"use client";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../components/SidePannel";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

const Layout = ({ children, loader, toaster }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const publicPages = ["/login", "/privacyPolicy", "/termsAndConditions"];


  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <div className="flex min-h-screen bg-white">
     
      {!isPublicPage && (
        <div className="lg:sticky lg:top-0 lg:h-screen md:p-5">
          <Sidebar open={open} setOpen={setOpen} />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {!isPublicPage && (
          <div className="sticky top-5 mr-3 md:mr-5 md:ml-0 ml-3 z-40 bg-white border border-[#00000050] rounded-[16px] boxShadow">
            <div className="flex items-center justify-between p-3 md:p-6">
              <button
                className="lg:hidden text-2xl"
                onClick={() => setOpen(true)}
              >
                <FiMenu />
              </button>
              <Navbar />
            </div>
          </div>
        )}

        <main
          className={`flex-1 ${
            isPublicPage
              ? "mt-0 mr-0 md:ml-0 ml-0 md:mb-0 mb-0"
              : "mt-10 md:mr-5 mr-3 md:ml-0 ml-3 md:mb-0 mb-5"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
