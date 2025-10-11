import React, { useContext, useEffect, useMemo, useState } from 'react'
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
import { userContext } from './_app';
import moment from 'moment';

function Officers(props) {
    const router = useRouter();
    const [guardData, setGuardData] = useState([]);
    const [user, setUser] = useContext(userContext)
    const [serchData, setSearchData] = useState({
        name: '',
        email: '',
    })
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        getAllGuard();
    }, []);

    const getAllGuard = async () => {
        props.loader(true);
        const data = {}

        if (selectedDate) {
            data.curDate = new Date(selectedDate)
        }
        Api("get", `auth/getAllGuard?key=${serchData.name}&&email=${serchData.email}&&date=${data?.curDate || ''}`, "", router).then(
            (res) => {
                props.loader(false);
                // console.log("res================> form data :: ", res);
                setGuardData(res.data);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const handleReset = () => {
        setSearchData({
            name: '',
            email: '',
        });
        setSelectedDate('');
        getAllGuard();
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


    function date({ row, value }) {
        // console.log(row?.original)
        return (
            <div>
                <p className='text-black text-base font-normal text-center'>{moment(value).format('DD-MM-YYYY')}</p>
            </div>
        )
    }

    function status({ value }) {
        return (
            <div>
                <p className='text-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function currentAssignment({ value }) {
        return (
            <div>
                <p className='text-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function reportsHandled({ value }) {
        return (
            <div>
                <p className='text-black text-base font-normal text-center'>{value}</p>
            </div>
        )
    }

    function view({ value }) {
        return (
            <div className='flex justify-center items-center'>
                <div className="bg-[#00000080] w-[60px] h-[42px] rounded-[10px] flex justify-center items-center">
                    <LuEye className="w-[24px] h-[24px] text-black " />
                </div>
            </div>
        )
    }

    const columns = useMemo(
        () => [
            // {
            //     Header: "Officer ID",
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
            {
                Header: "Date ",
                accessor: 'createdAt',
                Cell: date
            },
            // {
            //     Header: "Status",
            //     // accessor: 'phone',
            //     Cell: status
            // },
            // {
            //     Header: "Current Assignment",
            //     // accessor: 'phone',
            //     Cell: currentAssignment
            // },
            // {
            //     Header: "Reports Handled",
            //     // accessor: 'phone',
            //     Cell: reportsHandled
            // },
            {
                Header: "View",
                // accessor: 'date',
                Cell: view
            },
        ],
        []
    );

    return (
        <div className="flex flex-col min-h-screen bg-white">

            <div className='flex justify-end items-end pb-5'>
                <button className='bg-black md:w-[103px] w-full h-[42px] rounded-[6px] flex justify-center items-center text-white font-normal text-base' onClick={() => { router.push(`/type/guard`) }}>Add Staff</button>
            </div>

            <div className='bg-white border border-[#00000050] rounded-[10px] boxShadow p-5'>
                <div className='grid md:grid-cols-5 grid-cols-1 w-full gap-5'>
                    <div className='w-full' >
                        <p className='text-black text-sm font-normal pl-5 pb-1'>Name</p>
                        <div className='flex justify-start items-center md:w-[206px] w-full h-[42px] border border-[#1E1E1E55] rounded-[30px]'>
                            <LuUserRound className='w-[16px] h-[16px] text-[var(--custom-newBlack)] ml-5' />
                            <input
                                type="text"
                                placeholder="Search by name"
                                className="bg-white text-[var(--custom-newBlack)] font-normal text-xs px-2 outline-0"
                                // value={serchNameData}
                                // onChange={(text) => {
                                //     setSearchNameData(text.target.value);
                                // }}
                                value={serchData.name}
                                onChange={((e) => {
                                    setSearchData({ ...serchData, name: e.target.value })
                                })}
                            />
                        </div>
                    </div>

                    <div className='w-full'>
                        <p className='text-black text-sm font-normal pl-5 pb-1'>Email</p>
                        <div className='flex justify-start items-center md:w-[206px] w-full h-[42px] border border-[#1E1E1E55] rounded-[30px]'>
                            <LuMailSearch className='w-[16px] h-[16px] text-[var(--custom-newBlack)] ml-5' />
                            <input
                                type="text"
                                placeholder="Search by email"
                                className="bg-white text-[var(--custom-newBlack)]font-normal text-xs px-2 outline-0"
                                value={serchData.email}
                                onChange={((e) => {
                                    setSearchData({ ...serchData, email: e.target.value })
                                })}
                            />
                        </div>
                    </div>

                    <div className='w-full'>
                        <p className='text-black text-sm font-normal pl-5 pb-1'>Date</p>
                        <div className='flex justify-start items-center md:w-[206px] w-full h-[42px] border border-[#1E1E1E55] rounded-[30px]'>
                            <LuCalendarSearch className='w-[18px] h-[18px] text-[var(--custom-newBlack)] ml-5' />
                            <input
                                type="date"
                                placeholder="Search by date"
                                className="bg-transparent text-[var(--custom-newBlack)] font-normal text-xs px-2 outline-0 w-full"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='w-full md:col-span-2 flex md:justify-end justify-start items-center gap-5'>
                        <div className='bg-black md:w-[103px] w-full h-[42px] rounded-[6px] flex justify-center items-center gap-2' onClick={getAllGuard}>
                            <button className='text-white font-normal text-base'>Search</button>
                            <FiSearch className='w-5 h-5 text-white' />
                        </div>
                        <div className='border border-black md:w-[103px] w-full h-[42px] rounded-[6px] flex justify-center items-center gap-2' onClick={handleReset}>
                            <button className='text-black font-normal text-base'>Reset</button>
                            <LuListRestart className='w-5 h-5 text-black' />
                        </div>
                    </div>
                </div>
            </div>

            <div className="">
                <Table columns={columns} data={guardData} />
            </div>

        </div>
    )
}

export default isAuth(Officers)
