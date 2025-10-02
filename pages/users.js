import React, { useEffect, useMemo, useState } from 'react'
import { LuUserRound } from "react-icons/lu";
import { LuMailSearch } from "react-icons/lu";
import { LuCalendarSearch } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { LuListRestart } from "react-icons/lu";
import Table, { indexID } from '@/components/table';
import { LuEye } from "react-icons/lu";
import isAuth from "@/components/isAuth";
import { Api } from '@/services/service';
import { useRouter } from "next/router";

function Users(props) {
    const router = useRouter();
    const [allUserList, setAllUserList] = useState([]);

    useEffect(() => {
        getAllUser();
    }, []);

    const getAllUser = async () => {
        props.loader(true);
        Api("get", "auth/getAllUser", "", router).then(
            (res) => {
                props.loader(false);
                console.log("res================> form data :: ", res);
                setAllUserList(res.data);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    function userId({ value }) {
        return (
            <div>
                <p className='text-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function name({ value }) {
        return (
            <div>
                <p className='text-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function email({ value }) {
        return (
            <div>
                <p className='text-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function phone({ value }) {
        return (
            <div>
                <p className='text-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function address({ value }) {
        return (
            <div>
                <p className='text-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function vehicles({ value }) {
        return (
            <div>
                <p className='text-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function view({ value }) {
        return (
            <div className='flex justify-center items-center w-full'>
                <div className="bg-[#00000080] w-[60px] h-[42px] rounded-[10px] flex justify-center items-center">
                    <LuEye className="w-[24px] h-[24px] text-black " />
                </div>
            </div>
        )
    }

    const columns = useMemo(
        () => [
            // {
            //     Header: "User ID",
            //     // accessor: "_id",
            //     Cell: userId,
            // },
            {
                Header: "Name",
                accessor: 'name',
                Cell: name
            },
            {
                Header: "Email",
                accessor: 'email',
                Cell: email
            },
            {
                Header: "Phone",
                accessor: 'phone',
                Cell: phone
            },
            // {
            //     Header: "Address",
            //     // accessor: 'phone',
            //     Cell: address
            // },
            // {
            //     Header: "Vehicles",
            //     // accessor: 'phone',
            //     Cell: vehicles
            // },
            // {
            //     Header: "View",
            //     // accessor: 'date',
            //     Cell: view
            // },
        ],
        []
    );

    return (
        <div className="flex flex-col min-h-screen bg-white">

            <div className='bg-white border border-[#00000050] rounded-[10px] boxShadow p-5'>
                <div className='grid md:grid-cols-5 grid-cols-1 w-full gap-5'>
                    <div className='w-full'>
                        <p className='text-black text-sm font-normal pl-5 pb-1'>Name</p>
                        <div className='flex justify-start items-center md:w-[206px] w-full h-[42px] border border-[#1E1E1E55] rounded-[30px]'>
                            <LuUserRound className='w-[16px] h-[16px] text-[var(--custom-newBlack)] ml-5' />
                            <input
                                type="text"
                                placeholder="Search by name"
                                className="bg-white text-[var(--custom-newBlack)] font-normal text-xs px-2 outline-0"
                            />
                        </div>
                    </div>

                    <div className='w-full'>
                        <p className='text-black text-sm font-normal pl-5 pb-1'>Email</p>
                        <div className='flex justify-start items-center md:w-[206px] full h-[42px] border border-[#1E1E1E55] rounded-[30px]'>
                            <LuMailSearch className='w-[16px] h-[16px] text-[var(--custom-newBlack)] ml-5' />
                            <input
                                type="text"
                                placeholder="Search by email"
                                className="bg-white text-[var(--custom-newBlack)] font-normal text-xs px-2 outline-0"
                            />
                        </div>
                    </div>

                    <div className='w-full'>
                        <p className='text-black text-sm font-normal pl-5 pb-1'>Date</p>
                        <div className='flex justify-start items-center md:w-[206px] full h-[42px] border border-[#1E1E1E55] rounded-[30px]'>
                            <LuCalendarSearch className='w-[16px] h-[16px] text-[var(--custom-newBlack)] ml-5' />
                            <input
                                type="text"
                                placeholder="Search by date"
                                className="bg-white text-[var(--custom-newBlack)] font-normal text-xs px-2 outline-0"
                            />
                        </div>
                    </div>

                    <div className='w-full md:col-span-2 flex md:justify-end justify-start items-center gap-5'>
                        <div className='bg-black md:w-[103px] w-full h-[42px] rounded-[6px] flex justify-center items-center gap-2'>
                            <button className='text-white font-normal text-base'>Search</button>
                            <FiSearch className='w-5 h-5 text-white' />
                        </div>
                        <div className='border border-black md:w-[103px] w-full h-[42px] rounded-[6px] flex justify-center items-center gap-2'>
                            <button className='text-black font-normal text-base'>Reset</button>
                            <LuListRestart className='w-5 h-5 text-black' />
                        </div>
                    </div>
                </div>
            </div>

            <div className="">
                <Table columns={columns} data={allUserList} />
            </div>

        </div>
    )
}

export default isAuth(Users)
