import React, { useEffect, useMemo, useState } from "react";
import Table from "@/components/table";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import AddLandlords from "@/components/AddLandlords";
import moment from "moment";
import { Delete, DeleteIcon, Edit, Eye, Plus, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/deleteModel";

function Landlords(props) {
  const router = useRouter();
  const [LandlordsData, setLandlordsData] = useState([]);
  const [popupData, setpopupData] = useState({});
  const [openLandlords, setOpenLandlords] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAllLandlords();
  }, []);

  const getAllLandlords = async (page = 1, limit = 10) => {
    props.loader(true);

    Api(
      "get",
      `auth/getAllUser?role=landlord&page=${page}&limit=${limit}`,
      "",
      router,
    ).then(
      (res) => {
        props.loader(false);
        setLandlordsData(res.data.data);
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const DeleteLandlords = async () => {
    try {
      props.loader(true);

      const id = editId;

      const res = await Api(
        "delete",
        `Landlords/deleteLandlords/${id}`,
        "",
        router,
      );

      props.loader(false);

      props.toaster({
        type: "success",
        message: "Landlords deleted successfully",
      });
      getAllLandlords();
    } catch (err) {
      props.loader(false);

      props.toaster({
        type: "error",
        message: err?.message,
      });
    }
  };

  function ContactPersonName({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function Name({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function Phone({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function Email({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }
  function uniqueCode({ value }) {
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
      <div className="flex justify-center items-center gap-2">
        <button
          className="bg-black cursor-pointer py-2 px-4 rounded-[10px] flex justify-center items-center"
          onClick={() => {
            setOpen(true);
            setpopupData(row.original);
          }}
        >
          <Eye className=" text-white " size={20} />
        </button>
        {/* <button
          className="bg-black cursor-pointer py-2 px-4 rounded-[10px] flex justify-center items-center"
          onClick={() => {
            setEditId(row.original._id);
            setOpenLandlords(true);
            setpopupData(row.original);
          }}
        >
          <Edit className=" text-white " size={20} />
        </button> */}
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
      {
        Header: " Name",
        accessor: "name",
        Cell: Name,
      },

      {
        Header: "Phone",
        accessor: "phone",
        Cell: Phone,
      },

      {
        Header: "Email",
        accessor: "email",
        Cell: Email,
      },
      {
        Header: "Unique Code",
        accessor: "uniqueCode",
        Cell: uniqueCode,
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: date,
      },
      {
        Header: "View",
        // accessor: 'date',
        Cell: view,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col min-h-screen bg-white p-6  ">
      <div className="flex justify-between items-center pb-5">
        <h1 className="text-black font-bold border-b-[4px] border-[#1E1E1E] text-2xl">
          Landlords
        </h1>
        <button
          className="bg-black px-4 py-1.5 rounded-[6px] flex justify-center items-center text-white font-normal text-base gap-1 cursor-pointer"
          onClick={() => setOpenLandlords(true)}
        >
          <Plus />
          Add Landlords
        </button>
      </div>

      <div>
        {LandlordsData?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 min-h-[550px] text-center">
            {/* Icon */}
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01"
                />
              </svg>
            </div>

            <p className="text-lg font-semibold text-gray-700">
              No Landlordss Found
            </p>

            <p className="text-sm text-gray-500 mt-1">
              There are no Landlordss added yet.
            </p>
          </div>
        ) : (
          <Table columns={columns} data={LandlordsData} />
        )}
      </div>

      {openLandlords && (
        <AddLandlords
          open={openLandlords}
          setOpen={setOpenLandlords}
          editId={editId}
          editData={popupData}
          setpopupData={setpopupData}
          fetchLandlords={getAllLandlords}
          loader={props.loader}
          toaster={props.toaster}
        />
      )}

      <ConfirmModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Delete Landlords "
        message="Are you sure? you want to delete this Landlords"
        onConfirm={DeleteLandlords}
        yesText="Delete"
        noText="Cancel"
      />

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
                alt="lanlords"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Landlords Details
              </h2>

              <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Name</span>
                  <span>{popupData?.name}</span>
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

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500"> Unique Code</span>
                  <p className="text-gray-700 mt-1">{popupData?.  uniqueCode}</p>
                </div>
              </div>

              {/* Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-black cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default isAuth(Landlords);
