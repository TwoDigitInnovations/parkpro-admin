import React, { useEffect, useMemo, useState } from "react";
import Table from "@/components/table";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import Addparkinglot from "@/components/Addparkinglot";
import { Edit, Eye, Plus, Trash2, X } from "lucide-react";
import { ConfirmModal } from "@/components/deleteModel";

function Parkinglots(props) {
  const router = useRouter();
  const [parkinglotData, setparkinglotData] = useState([]);
  const [popupData, setpopupData] = useState({});
  const [openparkinglot, setOpenparkinglot] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [BuildingData, setBuildingData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAllparkinglot();
    getAllBuilding();
  }, []);

  const getAllparkinglot = async () => {
    props.loader(true);

    Api("get", `parkingLot/getAllParkingLots`, "", router).then(
      (res) => {
        props.loader(false);
        setparkinglotData(res.data.data);
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const getAllBuilding = async () => {
    props.loader(true);

    Api("get", `building/getAllBuilding`, "", router).then(
      (res) => {
        props.loader(false);
        setBuildingData(res.data);
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

  function VehicleType({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">
          {Array.isArray(value) ? value.join(", ") : value}
        </p>
      </div>
    );
  }

  function BuildingName({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function spaceId({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function Availability({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function AccessMode({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function Queue({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
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
        Header: "Space ID",
        accessor: "space_id",
        Cell: spaceId,
      },
      {
        Header: "Building Name",
        accessor: "building.building_name",
        Cell: BuildingName,
      },
      {
        Header: "Parking Address",
        accessor: "address",
        Cell: Address,
      },
      {
        Header: "Vehicle Type",
        accessor: "vehicle_type",
        Cell: VehicleType,
      },

      {
        Header: "Availability",
        accessor: "availability",
        Cell: Availability,
      },
      {
        Header: "Access Mode",
        accessor: "access_mode",
        Cell: AccessMode,
      },

      {
        Header: "Queue",
        accessor: "enable_queue",
        Cell: Queue,
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
        <h1 className="text-black font-bold border-b-4 border-[#1E1E1E] text-2xl">
          Parking Lots
        </h1>
        <button
          className="bg-black px-4 py-1.5 rounded-md flex justify-center items-center text-white font-normal text-base gap-1 cursor-pointer"
          onClick={() => {}}
        >
          <Plus />
          Import Parkings
        </button>
      </div>
      <div className="flex justify-end items-end pb-5">
        <button
          className="bg-black px-4 py-1.5 rounded-md flex justify-center items-center text-white font-normal text-base gap-1 cursor-pointer"
          onClick={() => setOpenparkinglot(true)}
        >
          <Plus />
          Add Parking Lots
        </button>
      </div>

      <div>
        {parkinglotData?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
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
                  d="M9 17V7h6a4 4 0 010 8H9z"
                />
              </svg>
            </div>

            <p className="text-lg font-semibold text-gray-700">
              No Parking Lots Found
            </p>

            <p className="text-sm text-gray-500 mt-1">
              There are no parking spaces created for this building yet.
            </p>
          </div>
        ) : (
          <Table columns={columns} data={parkinglotData} />
        )}
      </div>

      {openparkinglot && (
        <Addparkinglot
          open={openparkinglot}
          setOpen={setOpenparkinglot}
          editId={editId}
          BuildingData={BuildingData}
          editData={popupData}
          setpopupData={setpopupData}
          fetchParkingLots={getAllparkinglot}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Parking Detail</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                <X />
              </button>
            </div>

            <div className="text-sm">
              <Row label="Space ID" value={popupData?.space_id} />

              <Row label="Location" value={popupData?.address} />

              <Row
                label="Vehicle Type"
                value={popupData?.vehicle_type?.join(", ")}
              />
              <Row label="Availability" value={popupData?.availability} />

              <Row label="Access Mode" value={popupData?.access_mode} />

              <Row label="Queue" value={popupData?.enable_queue} />

              {/* Pricing */}

              <div className="px-6 py-2 border-t">
                <p className="font-semibold ">Pricing</p>

                <Row
                  label="Hourly"
                  value={`$${popupData?.pricing?.hourly_rate}`}
                />

                <Row
                  label="Daily"
                  value={`$${popupData?.pricing?.daily_rate}`}
                />

                <Row
                  label="Monthly"
                  value={`$${popupData?.pricing?.monthly_rate}`}
                />
              </div>

              {/* Slots */}

              <div className="px-6 py-3 border-t">
                <p className="font-semibold mb-2">Slots</p>

                {popupData?.slots?.map((slot, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs border-b py-1.5"
                  >
                    <span>{slot.slot_label}</span>

                    <span>
                      Row {slot.position?.row} | Col {slot.position?.column}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center py-5 border-t">
              <button
                onClick={() => {
                  setpopupData("");
                  setOpen(false);
                }}
                className="bg-black cursor-pointer text-white px-8 py-2 rounded-md"
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

export default isAuth(Parkinglots);

const Row = ({ label, value }) => (
  <div className="flex justify-between px-6 py-3 border-b last:border-b-0">
    <span className="text-gray-600">{label}</span>

    <span className="font-medium text-gray-800">{value || "-"}</span>
  </div>
);
