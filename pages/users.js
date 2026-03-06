import React, { useContext, useEffect, useMemo, useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { LuMailSearch } from "react-icons/lu";
import { LuCalendarSearch } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { LuListRestart } from "react-icons/lu";
import Table, { indexID } from "@/components/table";
import { LuEye } from "react-icons/lu";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import moment from "moment";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { userContext } from "./_app";
import { ConfirmModal } from "@/components/deleteModel";
import AddUser from "@/components/AddUser";

function Users(props) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [allUserList, setAllUserList] = useState([]);
  const [serchData, setSearchData] = useState({
    name: "",
    email: "",
  });
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [popupData, setPopupData] = useState("");
  const [editId, setEditId] = useState("");
  const [openUser, setOpenUser] = useState("");

  useEffect(() => {
    if (user?.id) {
      getAllUser();
    }
  }, [user?.id]);

  const getAllUser = async () => {
    props.loader(true);

    const query = new URLSearchParams({
      key: serchData?.name || "",
      email: serchData?.email || "",
      role: "user",
    });

    if (user?.role?.toLowerCase() === "landlord") {
      query.append("organization", true);
    }

    if (selectedDate) {
      query.append("date", new Date(selectedDate));
    }

    console.log("Query:", query.toString());

    Api("get", `auth/getAllUser?${query.toString()}`, "", router).then(
      (res) => {
        props.loader(false);
        setAllUserList(res.data.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const DeleteLandlords = async () => {
    try {
      props.loader(true);

      const id = editId;

      const res = await Api("delete", `auth/userDelete/${id}`, "", router);

      props.loader(false);

      props.toaster({
        type: "success",
        message: "User deleted successfully",
      });
      getAllUser();
    } catch (err) {
      props.loader(false);

      props.toaster({
        type: "error",
        message: err?.message,
      });
    }
  };

  const handleReset = () => {
    setSearchData({
      name: "",
      email: "",
    });
    setSelectedDate("");
    setTimeout(() => {
      getAllUser();
    }, 1000);
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
        <p className="text-black text-base font-normal text-center">
          {value || "--"}
        </p>
      </div>
    );
  }
  function orgName({ value }) {
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

  function address({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function vehicles({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function view({ row, value }) {
    return (
      <div className="flex justify-center items-center gap-2">
        <button
          className="bg-black cursor-pointer py-2 px-4 rounded-[10px] flex justify-center items-center"
          onClick={() => {
            setOpen(true);
            setPopupData(row.original);
          }}
        >
          <Eye className=" text-white " size={20} />
        </button>

        <button
          className="bg-black cursor-pointer py-2 px-4 rounded-[10px] flex justify-center items-center"
          onClick={() => {
            setEditId(row.original._id);
            setIsOpen(true);
          }}
        >
          <Trash2 className=" text-white  " size={20} />
        </button>
      </div>
    );
  }

  const columns = useMemo(
    () => [
      // {
      //     Header: "User ID",
      //     // accessor: "_id",
      //     Cell: userId,
      // },
      {
        Header: "User Name",
        accessor: "name",
        Cell: name,
      },
      {
        Header: "Organization Name",
        accessor: "organization.name",
        Cell: orgName,
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: email,
      },
      {
        Header: "Phone Number",
        accessor: "phone",
        Cell: phone,
      },
      {
        Header: "Date ",
        accessor: "createdAt",
        Cell: date,
      },

      // {
      //     Header: "Vehicles",
      //     // accessor: 'phone',
      //     Cell: vehicles
      // },
      {
        Header: "View",
        // accessor: 'date',
        Cell: view,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] md:p-8 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-black font-bold border-b-4 border-black text-2xl pb-1">
          Users
        </h1>
        {user?.role === "landlord" && (
          <button
            className="bg-black px-4 py-1.5 rounded-md flex justify-center items-center text-white font-normal text-base gap-1 cursor-pointer"
            onClick={() => setOpenUser(true)}
          >
            <Plus />
            Add New User
          </button>
        )}
      </div>
      <div className="bg-white border border-[#00000050] rounded-[10px] boxShadow p-5">
        <div className="grid md:grid-cols-5 grid-cols-1 w-full gap-5">
          <div className="w-full">
            <p className="text-black text-sm font-normal pl-5 pb-1">Name</p>
            <div className="flex justify-start items-center md:w-[206px] w-full h-[42px] border border-[#1E1E1E55] rounded-[30px]">
              <LuUserRound className="w-[16px] h-[16px] text-[var(--custom-newBlack)] ml-3" />
              <input
                type="text"
                placeholder="Search by name"
                className="bg-white text-black font-normal text-[13px] px-2 outline-0"
                value={serchData.name}
                onChange={(e) => {
                  setSearchData({ ...serchData, name: e.target.value });
                }}
              />
            </div>
          </div>

          <div className="w-full">
            <p className="text-black text-sm font-normal pl-5 pb-1">Email</p>
            <div className="flex justify-start items-center md:w-[206px] full h-[42px] border border-[#1E1E1E55] rounded-[30px]">
              <LuMailSearch className="w-[16px] h-[16px] text-[var(--custom-newBlack)] ml-3" />
              <input
                type="text"
                placeholder="Search by email"
                className="bg-white text-black font-normal text-[13px] px-2 outline-0"
                value={serchData.email}
                onChange={(e) => {
                  setSearchData({ ...serchData, email: e.target.value });
                }}
              />
            </div>
          </div>

          <div className="w-full">
            <p className="text-black text-sm font-normal pl-5 pb-1">Date</p>
            <div className="flex justify-start items-center md:w-[206px] full h-[42px] border border-[#1E1E1E55] rounded-[30px]">
              <LuCalendarSearch className="w-[18px] h-[18px] text-[var(--custom-newBlack)] ml-3" />
              <input
                type="date"
                placeholder="Search by date"
                className="bg-transparent text-black font-normal text-[13px] px-2 outline-0 w-full"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:col-span-2 flex md:justify-end justify-start items-center gap-5">
            <div
              className="bg-black md:w-[103px] w-full h-[42px] rounded-[6px] flex justify-center items-center gap-2"
              onClick={getAllUser}
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
        <Table columns={columns} data={allUserList} />
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 md:px-0 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden relative p-4">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 bg-white shadow rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
            >
              ✕
            </button>

            <div className="w-full h-[220px]">
              <img
                src={popupData?.image}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                User Details
              </h2>

              <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Name</span>
                  <span>{popupData?.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">
                    Organization Name
                  </span>
                  <span>{popupData?.organization?.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">
                    Organization Email{" "}
                  </span>
                  <span>{popupData?.organization?.email}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Date</span>
                  <span>
                    {moment(popupData?.created).format("DD MMM YYYY")}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Phone</span>
                  <span>{popupData?.phone}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Email</span>
                  <span className="break-all">{popupData?.email}</span>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => {
                    setPopupData("");
                    setOpen(false);
                    setEditId("")
                  }}
                  className="bg-black cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Delete User "
        message="Are you sure? you want to delete this User"
        onConfirm={DeleteLandlords}
        yesText="Delete"
        noText="Cancel"
      />

      {openUser && (
        <AddUser
          open={openUser}
          setOpen={setOpenUser}
          editId={editId}
          editData={popupData}
          setpopupData={setPopupData}
          fetchBuilding={getAllUser}
          loader={props.loader}
          toaster={props.toaster}
        />
      )}
    </div>
  );
}

export default isAuth(Users);
