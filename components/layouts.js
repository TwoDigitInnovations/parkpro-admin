"use client";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import SidePannel from "../components/SidePannel";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const publicPages = ["/login", "/privacyPolicy", "/termsAndConditions"];
  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <div className="flex min-h-screen bg-white">
      
      
      {!isPublicPage && (
        <SidePannel open={open} setOpen={setOpen} />
      )}


      <div className="flex-1 flex flex-col">
        {!isPublicPage && (
          <div className="sticky top-0 z-40 ps-4">
            <div className="flex items-center justify-between ">
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

        <main className={`flex-1 ${isPublicPage ? "pl-0" : "md:pl-70"}`}>
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;
