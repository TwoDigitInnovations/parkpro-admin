import React, { useContext, useEffect, useMemo, useState } from "react";
import isAuth from "@/components/isAuth";
import { LuUserRound } from "react-icons/lu";
import { LuMailSearch } from "react-icons/lu";
import { LuCalendarSearch } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { LuListRestart } from "react-icons/lu";
import Table, { indexID } from "@/components/table";
import { LuEye } from "react-icons/lu";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import moment from "moment";

function Technician(props) {
  const router = useRouter();
  const [technicianData, setTechnicianData] = useState([]);
  const [user, setUser] = useContext(userContext);
  const [isOpen, setIsOpen] = useState(false);
  const [serchData, setSearchData] = useState({
    name: "",
    email: "",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedData, setSelectedData] = useState({});

  useEffect(() => {
    getAllTechnician();
  }, []);

  const handleSearch = () => {
    getAllTechnician({
      name: serchData.name,
      email: serchData.email,
      date: selectedDate ? new Date(selectedDate).toISOString() : "",
    });
  };

  const getAllTechnician = async (filters = {}) => {
    props.loader(true);

    const params = new URLSearchParams();

    if (filters.name) params.append("key", filters.name);
    if (filters.email) params.append("email", filters.email);
    if (filters.date) params.append("date", filters.date);

    Api("get", `auth/getAllTechnician?${params.toString()}`, "", router).then(
      (res) => {
        props.loader(false);
        setTechnicianData(res.data);
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const handleReset = () => {
    setSearchData({ name: "", email: "" });
    setSelectedDate("");

    getAllTechnician({});
  };

  function name({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function email({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function phone({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function date({ row, value }) {
    // console.log(row?.original)
    return (
      <div>
        <p className="text-black text-base font-normal text-center">
          {moment(value).format("DD-MM-YYYY")}
        </p>
      </div>
    );
  }

  function view({ row, value }) {
    return (
      <div className="flex justify-center items-center">
        <div
          className="bg-[#00000080] w-[60px] h-[42px] rounded-[10px] flex justify-center items-center"
          onClick={() => {
            setIsOpen(true);
            setSelectedData(row.original);
          }}
        >
          <LuEye className="w-[24px] h-[24px] text-black " />
        </div>
      </div>
    );
  }

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: name,
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: email,
      },
      {
        Header: "Phone",
        accessor: "phone",
        Cell: phone,
      },
      {
        Header: "Date ",
        accessor: "createdAt",
        Cell: date,
      },
      {
        Header: "View",
        // accessor: 'date',
        Cell: view,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex justify-end items-end pb-5">
        <button
          className="bg-black md:w-[160px] w-full h-[42px] rounded-[6px] flex justify-center items-center text-white font-normal text-base"
          onClick={() => {
            router.push(`/type/tech`);
          }}
        >
          Add Technician
        </button>
      </div>

      <div className="bg-white border border-[#00000050] rounded-[10px] boxShadow p-5">
        <div className="grid md:grid-cols-5 grid-cols-1 w-full gap-5">
          <div className="w-full">
            <p className="text-black text-sm font-normal pl-5 pb-1">Name</p>
            <div className="flex justify-start items-center md:w-[206px] w-full h-[42px] border border-[#1E1E1E55] rounded-[30px]">
              <LuUserRound className="w-[16px] h-[16px] text-[var(--custom-newBlack)] ml-5" />
              <input
                type="text"
                placeholder="Search by name"
                className="bg-white text-[var(--custom-newBlack)] font-normal text-xs px-2 outline-0"
                value={serchData.name}
                onChange={(e) => {
                  setSearchData({ ...serchData, name: e.target.value });
                }}
              />
            </div>
          </div>

          <div className="w-full">
            <p className="text-black text-sm font-normal pl-5 pb-1">Email</p>
            <div className="flex justify-start items-center md:w-[206px] w-full h-[42px] border border-[#1E1E1E55] rounded-[30px]">
              <LuMailSearch className="w-[16px] h-[16px] text-[var(--custom-newBlack)] ml-5" />
              <input
                type="text"
                placeholder="Search by email"
                className="bg-white text-[var(--custom-newBlack)] font-normal text-xs px-2 outline-0"
                value={serchData.email}
                onChange={(e) => {
                  setSearchData({ ...serchData, email: e.target.value });
                }}
              />
            </div>
          </div>

          <div className="w-full">
            <p className="text-black text-sm font-normal pl-5 pb-1">Date</p>
            <div className="flex justify-start items-center md:w-[206px] w-full h-[42px] border border-[#1E1E1E55] rounded-[30px]">
              <LuCalendarSearch className="w-[18px] h-[18px] text-[var(--custom-newBlack)] ml-5" />
              <input
                type="date"
                placeholder="Search by date"
                className="bg-transparent text-[var(--custom-newBlack)] font-normal text-xs px-2 outline-0 w-full"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:col-span-2 flex md:justify-end justify-start items-center gap-5">
            <div
              className="bg-black md:w-[103px] w-full h-[42px] rounded-[6px] flex justify-center items-center gap-2"
              onClick={handleSearch}
            >
              <button className="text-white font-normal text-base">
                Search
              </button>
              <FiSearch className="w-5 h-5 text-white" />
            </div>
            <div
              className="border border-black md:w-[103px] w-full h-[42px] rounded-[6px] flex justify-center items-center gap-2"
              onClick={handleReset}
            >
              <button className="text-black font-normal text-base">
                Reset
              </button>
              <LuListRestart className="w-5 h-5 text-black" />
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <Table columns={columns} data={technicianData} />
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                User Details
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{selectedData.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">
                  {selectedData.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-800">
                  {selectedData.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Created By</p>
                <p className="font-medium text-gray-800">
                  {moment(selectedData.createdAt).format("DD-MM-YYYY")}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-right">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 cursor-pointer bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default isAuth(Technician);
