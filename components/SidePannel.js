import { FiFileText, FiShield, FiBell, FiX } from "react-icons/fi";
import { MdDashboard } from 'react-icons/md'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaRegCircleUser } from "react-icons/fa6";
import { ParkingMeter } from "lucide-react";

export default function Sidebar({ open, setOpen }) {
    const router = useRouter();

    const menuItems = [
        {
            href: "/",
            title: "Dashboard",
            img: <MdDashboard className='text-xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/reports",
            title: "Reports",
            img: <FiFileText className='text-xl' />,
            access: ["admin", "org"],
        },
        {
            href: "/users",
            title: "Customers",
            img: <FaRegCircleUser className='text-xl' />,
            access: ["admin", "org"],
        },
        {
            href: "/officers",
            title: "Staff",
            img: <FiShield className='text-xl' />,
            access: ["admin", "org"],
        },
        {
            href: "/technician",
            title: "Technician",
            img: <FaRegCircleUser className='text-xl' />,
            access: ["admin", "org"],
        },
        {
            href: "/notifications",
            title: "Notifications",
            img: <FiBell className='text-xl' />,
            access: ["admin", "org"],
        },
         {
            href: "/parking",
            title: "Parking Area",
            img: <ParkingMeter className='text-xl' />,
            access: ["admin", "org"],
        },
    ];

    return (
        <>
            {open && (<div className="fixed inset-0  bg-opacity-40 z-40 lg:hidden" onClick={() => setOpen(false)} />)}

            <div className="md:block hidden h-full">
                <aside className={`fixed lg:static top-0 left-0 h-full w-64 border border-[#00000050] rounded-[18px] boxShadow flex flex-col z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                    <div className="px-5 flex justify-between items-center">
                        <div className="flex justify-center items-center w-full">
                            <img className="w-[170px] h-[170px]" src="/logo.png" />
                        </div>
                        <button className="lg:hidden text-2xl" onClick={() => setOpen(false)}>
                            <FiX />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto md:block hidden">
                        <ul className="space-y-2 p-5">
                            {menuItems.map((item, i) => (
                                <Link key={i} href={item.href} className={`flex items-center group hover:bg-black hover:text-white hover:rounded-[8px]  cursor-pointer ${router.pathname === item.href ? 'bg-black text-white rounded-[8px]' : 'text-black'}`}>
                                    <div className='py-2 pl-6 font-medium flex items-center gap-4 w-full'>
                                        <div className='w-6'>{item?.img}</div>
                                        {item?.title}
                                    </div>
                                </Link>))}
                        </ul>
                    </nav>
                </aside>
            </div>

            <div className="md:hidden block">
                <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-white  boxShadow flex flex-col z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                    {/* border border-[#00000050] rounded-[16px] */}
                    <div className="px-5 pt-5 flex justify-between items-start">
                        <div className="flex justify-center items-center w-full">
                            <img className="w-[170px] h-[170px]" src="/logo.png" />
                        </div>
                        <button className="lg:hidden text-2xl" onClick={() => setOpen(false)}>
                            <FiX />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto ">
                        <ul className="space-y-2 p-5">
                            {menuItems.map((item, i) => (
                                <Link key={i} href={item.href} onClick={() => setOpen(false)} className={`flex items-center group hover:bg-black hover:text-white hover:rounded-[8px]  cursor-pointer ${router.pathname === item.href ? 'bg-black text-white rounded-[8px]' : 'text-black'}`}>
                                    <div className='py-2 pl-6 font-medium flex items-center gap-4 w-full'>
                                        <div className='w-6'>{item?.img}</div>
                                        {item?.title}
                                    </div>
                                </Link>))}
                        </ul>
                    </nav>
                </aside>
            </div>
        </>
    );
}
