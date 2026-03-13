"use client";

import React, { useState, useEffect, useRef } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/navigation";
import Select from "react-select";

function AddParkingLot({
  open,
  setOpen,
  editId,
  editData,
  fetchParkingLots,
  loader,
  toaster,
  setpopupData,
  BuildingData,
}) {
  const router = useRouter();
  const autoRef = useRef(null);
  const autocomplete = useRef(null);

  const [form, setForm] = useState({
    space_id: "",
    building: "",
    vehicle_type: [],
    availability: "Available",
    access_mode: "Tenant only",
    enable_queue: "Off",
    address: "",
    latitude: "",
    longitude: "",

    pricing: {
      hourly_rate: "",
      daily_rate: "",
      monthly_rate: "",
    },

    slots: [],
  });
  const vehicleOptions = [
    { value: "Car", label: "Car" },
    { value: "Bike", label: "Bike" },
    { value: "Truck", label: "Truck" },
  ];

  const [slotForm, setSlotForm] = useState({
    slot_label: "",
    row: "",
    column: "",
  });

  useEffect(() => {
    if (editId && editData) {
      setForm({
        ...form,
        space_id: editData.space_id || "",
        address: editData.address || "",
        building: editData.building._id || "",
        vehicle_type: editData.vehicle_type || "",
        availability: editData.availability || "Available",
        access_mode: editData.access_mode || "Tenant only",
        enable_queue: editData.enable_queue || "Off",
        slots: editData.slots || [],
        pricing: editData.pricing || form.pricing,
        longitude: editData.location.coordinates[0],
        latitude: editData.location.coordinates[1],
      });
    }
  }, [editId, editData]);

  console.log("editData", editData);
  console.log("form", form);

  const handleChange1 = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addSlot = () => {
    if (!slotForm.slot_label) return;

    setForm((prev) => ({
      ...prev,
      slots: [
        ...prev.slots,
        {
          slot_label: slotForm.slot_label,
          position: {
            row: Number(slotForm.row),
            column: Number(slotForm.column),
          },
        },
      ],
    }));

    setSlotForm({
      slot_label: "",
      row: "",
      column: "",
    });
  };

  const handleSubmit = () => {
    if (!form.building) {
      toaster({ type: "error", message: "Please Select a Building" });
      return;
    }

    if (!form.space_id || !form.address) {
      toaster({ type: "error", message: "Please fill required fields" });
      return;
    }

    loader?.(true);

    const payload = {
      space_id: form.space_id,
      address: form.address,
      vehicle_type: form.vehicle_type,
      building: form.building,
      pricing: {
        hourly_rate: Number(form.pricing.hourly_rate),
        daily_rate: Number(form.pricing.daily_rate),
        monthly_rate: Number(form.pricing.monthly_rate),
      },

      slots: form.slots,

      availability: form.availability,
      access_mode: form.access_mode,
      enable_queue: form.enable_queue,

      location: {
        type: "Point",
        coordinates: [Number(form.longitude), Number(form.latitude)],
      },
    };

    const url = editId
      ? `parkingLot/updateParkingLots/${editId}`
      : `parkingLot/create-parkinglots`;

    Api("post", url, payload, router)
      .then((res) => {
        loader?.(false);

        if (res?.status) {
          toaster({
            type: "success",
            message: editId ? "Parking lot updated" : "Parking lot created",
          });

          fetchParkingLots();
          setOpen(false);
        } else {
          toaster({
            type: "error",
            message: res?.message,
          });
        }
      })
      .catch((err) => {
        loader?.(false);

        toaster({
          type: "error",
          message: err?.message,
        });
      });
  };

  if (!open) return null;

  useEffect(() => {
    if (!open) return;

    const scriptId = "google-maps-script";
    const existing = document.getElementById(scriptId);

    if (!existing) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }

    function initAutocomplete() {
      if (!window.google || !autoRef.current) return;

      autocomplete.current = new window.google.maps.places.Autocomplete(
        autoRef.current,
        { types: ["geocode"] },
      );

      autocomplete.current.addListener("place_changed", () => {
        const place = autocomplete.current.getPlace();
        if (!place?.geometry) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setForm((prev) => ({
          ...prev,
          address: place.formatted_address,
          latitude: lat,
          longitude: lng,
        }));
      });
    }
  }, [open]);

  return (
    <section className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-6">
          {editId ? "Edit Parking Lot" : "Add Parking Lots"}
        </h2>

        <Select1
          label="Select Building"
          value={form.building}
          onChange={(v) => setForm({ ...form, building: v })}
          options={BuildingData}
        />

        <Input
          label="Space ID"
          name="space_id"
          value={form.space_id}
          placeholder="Space ID"
          onChange={handleChange1}
        />

        <Input
          label="Location"
          name="address"
          ref={autoRef}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        {/* <Select
          label="Vehicle Type"
          name="vehicle_type"
          value={form.vehicle_type}
          onChange={handleChange}
          options={["Car", "Bike", "Truck"]}
          multiple
        /> */}

        <div className="mb-4">
          <label className="block text-sm mb-1">Vehicle Type</label>

          <Select
            isMulti
            options={vehicleOptions}
            value={vehicleOptions.filter((v) =>
              form.vehicle_type.includes(v.value),
            )}
            onChange={(selected) =>
              setForm({
                ...form,
                vehicle_type: selected.map((item) => item.value),
              })
            }
          />
        </div>

        <Input
          label="Hourly Rate"
          value={form.pricing.hourly_rate}
          placeholder="Hourly Rate"
          onChange={(e) =>
            setForm({
              ...form,
              pricing: { ...form.pricing, hourly_rate: e.target.value },
            })
          }
        />

        <Input
          label="Daily Rate"
          placeholder="Daily Rate"
          value={form.pricing.daily_rate}
          onChange={(e) =>
            setForm({
              ...form,
              pricing: { ...form.pricing, daily_rate: e.target.value },
            })
          }
        />

        <Input
          label="Monthly Rate"
          placeholder="Monthly Rate"
          value={form.pricing.monthly_rate}
          onChange={(e) =>
            setForm({
              ...form,
              pricing: { ...form.pricing, monthly_rate: e.target.value },
            })
          }
        />

        <h3 className="font-semibold mt-6 mb-3">Add Slot</h3>

        <Input
          label="Slot Label"
          value={slotForm.slot_label}
          placeholder="Label Name eg. ABC"
          onChange={(e) =>
            setSlotForm({ ...slotForm, slot_label: e.target.value })
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input
            label="Row"
            type="number"
            placeholder="Row No. eg. 2"
            value={slotForm.row}
            onChange={(e) => setSlotForm({ ...slotForm, row: e.target.value })}
          />

          <Input
            label="Column"
            type="number"
            placeholder="Column No. eg. 1"
            value={slotForm.column}
            onChange={(e) =>
              setSlotForm({ ...slotForm, column: e.target.value })
            }
          />
        </div>
        <button
          onClick={addSlot}
          className="px-4 py-1.5 text-sm mb-2 bg-black text-white rounded"
        >
          Add Slot
        </button>

        {form.slots.map((slot, i) => (
          <div key={i} className="text-sm border p-2 mt-2 rounded">
            {slot.slot_label} - Row {slot.position.row} Col{" "}
            {slot.position.column}
          </div>
        ))}

        <Toggle
          label="Availability"
          value={form.availability}
          onChange={(v) => setForm({ ...form, availability: v })}
          options={["Available", "Blocked"]}
        />

        <Toggle
          label="Access Mode"
          value={form.access_mode}
          onChange={(v) => setForm({ ...form, access_mode: v })}
          options={["Tenant only", "Open"]}
        />

        <Toggle
          label="Enable Queue"
          value={form.enable_queue}
          onChange={(v) => setForm({ ...form, enable_queue: v })}
          options={["Off", "On"]}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              setpopupData({});
              setOpen(false);
            }}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-black text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddParkingLot;

const Input = React.forwardRef(({ label, ...props }, ref) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>
    <input
      ref={ref}
      {...props}
      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
));

const Toggle = ({ label, value, options, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1">{label}</label>

      <div className="flex border rounded-full w-fit p-1">
        {options.map((item, i) => (
          <button
            key={i}
            onClick={() => onChange(item)}
            className={`px-4 py-1 text-sm rounded-full
            ${value === item ? "bg-gray-200" : ""}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

const Select1 = ({ label, options = [], value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg px-3 py-2 text-sm"
    >
      <option value="">Select</option>

      {options.map((item) => (
        <option key={item._id} value={item._id}>
          {item.building_name}
        </option>
      ))}
    </select>
  </div>
);
