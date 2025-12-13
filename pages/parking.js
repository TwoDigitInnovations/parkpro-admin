import React, { useEffect, useMemo, useState, useContext } from "react";
import isAuth from "@/components/isAuth";
import Table from "@/components/table";
import { LuEye, LuPlus } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { ParkingAPI } from "@/services/AllApi";
import { useRouter } from "next/router";
import moment from "moment";
import { userContext } from "./_app";
import { ParkingModal } from "@/components/ParkingModel";
import { Api } from "@/services/service";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

function Parking(props) {
    const router = useRouter();
    const [user] = useContext(userContext);
    const [parkingData, setParkingData] = useState([]);
    const [selectedParking, setSelectedParking] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [search, setSearch] = useState({ q: "" });

    const [form, setForm] = useState({
        parkingName: "",
        address: "",
        longitude: "",
        latitude: "",
    });

    const [slotForm, setSlotForm] = useState({
        slotNo: "",
        forWheel: false,
    });

    const [machineForm, setMachineForm] = useState({
        machineId: "",
        machineName: "",
    });


    useEffect(() => {
        getAllParking();
    }, []);

    const getAllParking = () => {
        props.loader(true);
        Api("get", "parking/getParking", "", router).then(
            (res) => {
                props.loader(false);
                setParkingData(res.data || []);
            },
            (err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message || "Failed to fetch" });
            }
        );
    };

    const handleAddParking = () => {
        if (!form.parkingName || !form.address || !form.longitude || !form.latitude) {
            return props.toaster({ type: "error", message: "All fields required" });
        }

        const payload = {
            parkingName: form.parkingName,
            address: form.address,
            location: {
                type: "Point",
                coordinates: [Number(form.longitude), Number(form.latitude)],
            },
        };

        props.loader(true);
        ParkingAPI.create(payload, router).then(
            (res) => {
                props.loader(false);
                props.toaster({ type: "success", message: "Parking created" });
                setOpenAdd(false);
                setForm({ parkingName: "", address: "", longitude: "", latitude: "" });
                getAllParking();
            },
            (err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message || "Create failed" });
            }
        );
    };

    const openEditModal = (row) => {
        const p = row.original;
        setSelectedParking(p);
        setForm({
            parkingName: p.parkingName || "",
            address: p.address || "",
            longitude: (p.location?.coordinates?.[0] || "") + "",
            latitude: (p.location?.coordinates?.[1] || "") + "",
        });
        setOpenEdit(true);
    };

    const handleUpdateParking = () => {
        if (!selectedParking) return;
        const payload = {
            parkingName: form.parkingName,
            address: form.address,
            location: {
                type: "Point",
                coordinates: [Number(form.longitude), Number(form.latitude)],
            },
        };

        props.loader(true);
        ParkingAPI.update(selectedParking._id, payload, router).then(
            (res) => {
                props.loader(false);
                props.toaster({ type: "success", message: "Updated" });
                setOpenEdit(false);
                setSelectedParking(null);
                getAllParking();
            },
            (err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message || "Update failed" });
            }
        );
    };

    const openParkingDetails = (row) => {
        const id = row.original._id;
        props.loader(true);
        ParkingAPI.getOne(id, router).then(
            (res) => {
                props.loader(false);
                setSelectedParking(res.data);
                setSlotForm({ slotNo: "", forWheel: false });
                setMachineForm({ machineId: "", machineName: "" });
                setOpenView(true);
            },
            (err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message || "Fetch failed" });
            }
        );
    };

    const handleAddSlot = () => {
        if (!selectedParking) return props.toaster({ type: "error", message: "Select parking" });
        if (!slotForm.slotNo) return props.toaster({ type: "error", message: "Slot no required" });

        props.loader(true);
        ParkingAPI.addSlot(selectedParking._id, slotForm, router).then(
            (res) => {
                props.loader(false);
                props.toaster({ type: "success", message: "Slot added" });
                ParkingAPI.getOne(selectedParking._id, router).then((r) => setSelectedParking(r.data));
                setSlotForm({ slotNo: "", forWheel: false });
            },
            (err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message || "Add slot failed" });
            }
        );
    };

    const handleSetMachine = () => {
        if (!selectedParking) return;
        if (!machineForm.machineId || !machineForm.machineName)
            return props.toaster({ type: "error", message: "Machine id & name required" });

        props.loader(true);
        ParkingAPI.setMachine(selectedParking._id, machineForm, router).then(
            () => {
                props.loader(false);
                props.toaster({ type: "success", message: "Machine saved" });
                ParkingAPI.getOne(selectedParking._id, router).then((r) => setSelectedParking(r.data));
                setMachineForm({ machineId: "", machineName: "" });
            },
            (err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message || "Save failed" });
            }
        );
    };

    const confirmAction = async (title, text = "") => {
        const result = await Swal.fire({
            title,
            text,
            // icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        return result.isConfirmed;
    };

    const handleDeleteParking = async (id) => {
        const ok = await confirmAction("Delete this parking?", "This action cannot be undone.");
        if (!ok) return;

        props.loader(true);
        ParkingAPI.delete(id, router).then(
            (res) => {
                props.loader(false);
                props.toaster({ type: "success", message: "Deleted" });
                getAllParking();
            },
            (err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message || "Delete failed" });
            }
        );
    };

    const handleRemoveSlot = async (slotId) => {
        if (!selectedParking) return;

        const ok = await confirmAction("Remove this slot?");
        if (!ok) return;

        props.loader(true);
        ParkingAPI.removeSlot(selectedParking._id, slotId, router).then(
            () => {
                props.loader(false);
                props.toaster({ type: "success", message: "Slot removed" });
                ParkingAPI.getOne(selectedParking._id, router).then((r) =>
                    setSelectedParking(r.data)
                );
            },
            (err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message || "Remove failed" });
            }
        );
    };

    const handleRemoveMachine = async () => {
        if (!selectedParking) return;

        const ok = await confirmAction("Remove machine?");
        if (!ok) return;

        props.loader(true);
        ParkingAPI.removeMachine(selectedParking._id, router).then(
            () => {
                props.loader(false);
                props.toaster({ type: "success", message: "Machine removed" });
                ParkingAPI.getOne(selectedParking._id, router).then((r) =>
                    setSelectedParking(r.data)
                );
            },
            (err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message || "Remove failed" });
            }
        );
    };

    const columns = useMemo(
        () => [
            {
                Header: "Name",
                accessor: "parkingName",
                Cell: ({ value }) => (
                    <div className="text-sm font-medium text-center">{value}</div>
                ),
            },
            {
                Header: "Address",
                accessor: "address",
                Cell: ({ value }) => (
                    <div className="text-sm text-center">{value}</div>
                ),
            },
            {
                Header: "Created",
                accessor: "createdAt",
                Cell: ({ value }) => (
                    <div className="text-center">
                        {moment(value).format("DD-MM-YYYY")}
                    </div>
                ),
            },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => openParkingDetails(row)}
                            className="px-3 py-2 cursor-pointer rounded bg-gray-800 text-white"
                            title="View"
                        >
                            <LuEye />
                        </button>

                        <button
                            onClick={() => openEditModal(row)}
                            className="px-2.5 py-1.5 rounded border cursor-pointer"
                            title="Edit"
                        >
                            <Pencil size={20} />
                        </button>

                        <button
                            onClick={() => handleDeleteParking(row.original._id)}
                            className="px-2.5 py-1.5 rounded bg-red-600 text-white cursor-pointer"
                            title="Delete"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );


    const filteredData = parkingData.filter((p) =>
        [p.parkingName, p.address].join(" ").toLowerCase().includes(search.q.toLowerCase())
    );

    return (
        <div className="min-h-screen">
            <div className="flex justify-end items-center mb-6">
                <div className="flex items-center gap-3">

                    <div className="flex items-center gap-2 border rounded-full px-4 py-2 w-[300px] md:w-[20vw] bg-white">
                        <FiSearch className="text-gray-500" />
                        <input
                            value={search.q}
                            onChange={(e) => setSearch({ q: e.target.value })}
                            placeholder="Search by name or address"
                            className="w-full outline-none text-md"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setForm({ parkingName: "", address: "", longitude: "", latitude: "" });
                            setOpenAdd(true);
                        }}
                        className="flex cursor-pointer text-md  items-center gap-2 bg-black text-white px-4 py-2 rounded"
                    >
                        <LuPlus /> Add Parking
                    </button>

                </div>
            </div>

            <div className="bg-white rounded p-4 shadow ">
                <Table columns={columns} data={filteredData} />
            </div>

            <ParkingModal
                open={openAdd || openEdit}
                mode={openAdd ? "add" : "edit"}
                form={form}
                setForm={setForm}
                onClose={() => { setOpenAdd(false); setOpenEdit(false); }}
                onSubmit={openAdd ? handleAddParking : handleUpdateParking}
            />

            {openView && selectedParking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">

                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpenView(false)}
                    />

                    {/* Modal */}
                    <div className="
            relative z-10 
            w-[95%] md:w-[1100px] 
            max-h-[85vh] min-h-[500px]
            bg-white rounded-xl 
            shadow-xl 
            overflow-y-auto 
            animate-fadeIn
            p-6
        ">
                        {/* Header */}
                        <div className="flex justify-between items-start gap-4 sticky top-0 bg-white pb-3">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    {selectedParking.parkingName}
                                </h3>
                                <p className="text-sm text-gray-600">{selectedParking.address}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Created: {moment(selectedParking.createdAt).format("DD-MM-YYYY")}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        setOpenView(false);
                                        setTimeout(() => openEditModal({ original: selectedParking }), 120);
                                    }}
                                    className="px-3 py-2 border rounded text-sm cursor-pointer"
                                >
                                    Edit Parking
                                </button>

                                <button
                                    onClick={() => {
                                        setOpenView(false);
                                        handleDeleteParking(selectedParking._id);
                                    }}
                                    className="px-3 py-2 bg-red-600 text-white rounded text-sm cursor-pointer"
                                >
                                    Delete
                                </button>

                                <button
                                    onClick={() => setOpenView(false)}
                                    className="px-3 py-2 border rounded text-sm cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Slots Section */}
                        <div className="mt-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                                <h4 className="font-medium">lots</h4>

                                <div className="flex flex-wrap items-center gap-2">
                                    <input
                                        placeholder="lot no"
                                        value={slotForm.slotNo}
                                        onChange={(e) => setSlotForm({ ...slotForm, slotNo: e.target.value })}
                                        className="border px-2 py-1 rounded w-32"
                                    />

                                    {/* <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={slotForm.forWheel}
                                            onChange={(e) => setSlotForm({ ...slotForm, forWheel: e.target.checked })}
                                        />
                                        4-wheeler
                                    </label> */}

                                    <button
                                        onClick={handleAddSlot}
                                        className="px-3 py-2 cursor-pointer bg-black text-white rounded text-sm"
                                    >
                                        Add lot
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                                {selectedParking.parkingSlots?.length ? (
                                    selectedParking.parkingSlots.map((s) => (
                                        <div
                                            key={s._id}
                                            className="flex justify-between items-center border rounded px-3 py-2"
                                        >
                                            <div>
                                                <div className="font-medium">lot No:{s.slotNo}</div>
                                                {/* <div className="text-xs text-gray-500">
                                                    {s.forWheel ? "4-wheeler" : "2-wheeler"}
                                                </div> */}
                                            </div>

                                            <button
                                                onClick={() => handleRemoveSlot(s._id)}
                                                className="px-2 py-2 cursor-pointer bg-red-600 text-white rounded text-xs"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">No lots yet.</div>
                                )}
                            </div>
                        </div>

                        {/* Machine Section */}
                        <div className="mt-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                                <h4 className="font-medium">Machine</h4>

                                <div className="flex flex-wrap items-center gap-2">
                                    <input
                                        placeholder="Machine ID"
                                        value={machineForm.machineId}
                                        onChange={(e) => setMachineForm({ ...machineForm, machineId: e.target.value })}
                                        className="border px-2 py-1 rounded w-32"
                                    />

                                    <input
                                        placeholder="Machine Name"
                                        value={machineForm.machineName}
                                        onChange={(e) =>
                                            setMachineForm({ ...machineForm, machineName: e.target.value })
                                        }
                                        className="border px-2 py-1 rounded w-40"
                                    />

                                    <button
                                        onClick={handleSetMachine}
                                        className="px-3 py-2 cursor-pointer bg-black text-white rounded text-sm"
                                    >
                                        Save Machine
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                                {selectedParking.machine && selectedParking.machine.length > 0 ? (
                                    selectedParking.machine.map((m) => (
                                        <div
                                            key={m._id}
                                            className="flex justify-between items-center border rounded px-3 py-2"
                                        >
                                            <div>
                                                <div className="font-medium">Machine Name: {m.machineName}</div>
                                                <div className="text-xs text-gray-500">Machine ID: {m.machineId}</div>
                                            </div>

                                            <button
                                                onClick={() => handleRemoveMachine(m._id)}
                                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">No machine set.</div>
                                )}
                            </div>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default isAuth(Parking);
