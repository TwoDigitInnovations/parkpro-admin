import React, { useEffect, useMemo, useState } from "react";
import Table from "@/components/table";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import Addparkinglot from "@/components/Addparkinglot";
import moment from "moment";
import { Delete, DeleteIcon, Edit, Eye, Plus, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/deleteModel";

function parkinglots(props) {
  const router = useRouter();
  const [parkinglotData, setparkinglotData] = useState([]);
  const [popupData, setpopupData] = useState({});
  const [openparkinglot, setOpenparkinglot] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAllparkinglot();
  }, []);

  const getAllparkinglot = async () => {
    props.loader(true);

    Api("get", `parkingLot/getAllParkingLots`, "", router).then(
      (res) => {
        props.loader(false);
        setparkinglotData(res.data);
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const Deleteparkinglot = async () => {
    try {
      props.loader(true);

      const id = editId;

      const res = await Api(
        "delete",
        `parkingLot/deleteParkingLots/${id}`,
        "",
        router,
      );

      props.loader(false);

      props.toaster({
        type: "success",
        message: "parkinglot deleted successfully",
      });
      getAllparkinglot();
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

  function parkinglotName({ value }) {
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

  function Contact({ value }) {
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

  function Address({ value }) {
    const shortAddress =
      value?.length > 26 ? value.slice(0, 26) + "..." : value;

    return (
      <div>
        <p className="text-black text-base font-normal text-center">
          {shortAddress}
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
        <button
          className="bg-black cursor-pointer py-2 px-4 rounded-[10px] flex justify-center items-center"
          onClick={() => {
            setEditId(row.original._id);
            setOpenparkinglot(true);
            setpopupData(row.original);
          }}
        >
          <Edit className=" text-white " size={20} />
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
      {
        Header: "parkinglot Name",
        accessor: "parkinglot_name",
        Cell: parkinglotName,
      },
      {
        Header: "Address",
        accessor: "address",
        Cell: Address,
      },
      {
        Header: "Phone",
        accessor: "phone_no",
        Cell: Phone,
      },
      {
        Header: "Contact Name",
        accessor: "name",
        Cell: ContactPersonName,
      },
      {
        Header: "Contact",
        accessor: "contact_no",
        Cell: Contact,
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
          parkinglots
        </h1>
        <button
          className="bg-black px-4 py-1.5 rounded-[6px] flex justify-center items-center text-white font-normal text-base gap-1 cursor-pointer"
          onClick={() => {}}
        >
          <Plus />
          Import parkinglots
        </button>
      </div>
      <div className="flex justify-end items-end pb-5">
        <button
          className="bg-black px-4 py-1.5 rounded-[6px] flex justify-center items-center text-white font-normal text-base gap-1 cursor-pointer"
          onClick={() => setOpenparkinglot(true)}
        >
          <Plus />
          Add parkinglot Address
        </button>
      </div>

      <div className="">
        <Table columns={columns} data={parkinglotData} />
      </div>

      {openparkinglot && (
        <Addparkinglot
          open={openparkinglot}
          setOpenAddparkinglot={setOpenparkinglot}
          editId={editId}
          editData={popupData}
          fetchparkinglot={getAllparkinglot}
          loader={props.loader}
          toaster={props.toaster}
        />
      )}

      <ConfirmModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Delete parkinglot "
        message="Are you sure? you want to delete this parkinglot"
        onConfirm={Deleteparkinglot}
        yesText="Delete"
        noText="Cancel"
      />

      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 md:px-0 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Left Image */}
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500 mb-2 font-medium">
                  Uploaded parkinglot Image
                </p>

                <div className="relative w-full">
                  <img
                    src={popupData?.parkinglot_image}
                    alt="parkinglot"
                    className="w-full h-[220px] object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="text-sm text-gray-700 space-y-2 border-l md:pl-6">
                <p>
                  <span className="font-medium">Date :</span>{" "}
                  {moment(popupData?.created).format("DD-MM-YYYY")}
                </p>

                <p>
                  <span className="font-medium">parkinglot Name :</span>{" "}
                  {popupData?.parkinglot_name}
                </p>

                <p>
                  <span className="font-medium">Address :</span>{" "}
                  {popupData?.address}
                </p>

                <p>
                  <span className="font-medium">Phone Number :</span>{" "}
                  {popupData?.phone_no}
                </p>

                <p>
                  <span className="font-medium">Parking Numbers :</span>{" "}
                  {popupData?.parking}
                </p>

                <p>
                  <span className="font-medium">EV Charging :</span>{" "}
                  {popupData?.evCharging ? "Yes" : "No"}
                </p>

                <p>
                  <span className="font-medium">Charger :</span>{" "}
                  {popupData?.charger}
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setOpen(false)}
                className="bg-black cursor-pointer text-white px-6 py-2 rounded-md hover:bg-gray-800"
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

export default isAuth(parkinglots);


