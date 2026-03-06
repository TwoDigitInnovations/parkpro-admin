"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { FiX, FiLogOut } from "react-icons/fi";
import { MdDashboard, MdOutlineMeetingRoom } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { ParkingMeter, User2, UserPlusIcon } from "lucide-react";
import { userContext } from "@/pages/_app";
import { ChevronRight } from "lucide-react";
import { FiFileText, FiShield, FiBell } from "react-icons/fi";
import { PiUserList } from "react-icons/pi";
import Swal from "sweetalert2";

function SidePannel({ open, setOpen }) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);

  const managementMenu = [
    {
      href: "/organization",
      title: "Organization",
      icon: <FaRegCircleUser size={20} />,
      access: ["superadmin"],
    },
    {
      href: "/landlords",
      title: "Land Lords",
      icon: <UserPlusIcon size={20} />,
      access: ["landlord_admin"],
    },

    {
      href: "/Building",
      title: "Add Buildings",
      icon: <ParkingMeter size={20} />,
      access: ["admin", "landlord"],
    },

    {
      href: "/users",
      title: "Users",
      icon: <FaRegCircleUser size={20} />,
      access: ["admin", "landlord_admin", "landlord"],
    },

    // Admin Only
    {
      href: "/reports",
      title: "Reports",
      icon: <FiFileText size={20} />,
      access: ["admin"],
    },

    {
      href: "/officers",
      title: "Staff",
      icon: <FiShield size={20} />,
      access: ["admin"],
    },

    {
      href: "/technician",
      title: "Technician",
      icon: <FaRegCircleUser size={20} />,
      access: ["admin"],
    },

    {
      href: "/notifications",
      title: "Notifications",
      icon: <FiBell size={20} />,
      access: ["admin"],
    },

    {
      href: "/parking",
      title: "Parking Area",
      icon: <ParkingMeter size={20} />,
      access: ["admin"],
    },

    {
      href: "/Parkinglots",
      title: "Parking Lots",
      icon: <ParkingMeter size={20} />,
      access: ["landlord"],
    },
    {
      href: "/Rentals",
      title: "Rentals",
      icon: <UserPlusIcon size={20} />,
      access: ["landlord"],
    },
    {
      href: "/ContentManagement",
      title: "Content Management",
      icon: <FaRegCircleUser size={20} />,
      access: ["admin"],
    },
  ];

  const logOut = () => {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff2d2d",
      cancelButtonColor: "#1f2937",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        title: "text-xl font-semibold",
        confirmButton: "px-6 py-2",
        cancelButton: "px-6 py-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setUser({});
        localStorage.removeItem("userDetail");
        localStorage.removeItem("token");
        router.push("/login");
      }
    });
  };

  console.log(router.pathname);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-70 bg-[#000000]
 text-white z-50 flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <img
            className="w-[140px] sm:w-[160px] "
            src="/logo1.png"
            onClick={() => router.push("/")}
            alt="Logo"
          />
          <button
            className="lg:hidden text-xl ps-4"
            onClick={() => setOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-white text-black mb-2"
          >
            <div className="flex items-center gap-3">
              <MdDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </div>
            <ChevronRight size={18} />
          </Link>
          <p className="text-gray-400 text-xs mt-6 mb-3 px-2 tracking-wider">
            MANAGEMENT
          </p>

          {managementMenu.map((item, i) =>
            item.access.includes(user?.role) ? (
              <Link
                key={i}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl mb-2 transition-all
                ${
                  router.pathname === item.href
                    ? "bg-white text-black"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </div>
                <ChevronRight size={18} />
              </Link>
            ) : null,
          )}

          <p className="text-gray-400 text-xs mt-6 mb-3 px-2 tracking-wider">
            OTHER MENU
          </p>

          <Link
            href="/Settings"
            className={`flex items-center justify-between px-4 py-3 rounded-xl  ${
              router.pathname === "/Settings"
                ? "bg-white text-black"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <span>Setting</span>
            <ChevronRight size={18} />
          </Link>
        </div>

        <div className="p-4 border-t border-white/10">
          <div
            className="bg-white cursor-pointer text-black rounded-xl p-3 flex items-center gap-3 mb-3"
            onClick={() => router.push("/profile")}
          >
            {/* <img
              src="https://i.pravatar.cc/40"
              className="w-10 h-10 rounded-full"
            /> */}
            <div className="bg-black rounded-4xl w-8 h-8 flex justify-center items-center">
              <User2 className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
          </div>

          <button
            className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90"
            onClick={logOut}
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
export default SidePannel;
