"use client";

import React, { useState, useEffect, useRef } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/navigation";

function AddParkingLot({
  open,
  setOpen,
  editId,
  editData,
  buildingId,
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
    vehicle_type: "",
    rental_rule: "",
    availability: "Available",
    access_mode: "Tenant only",
    enable_queue: "Off",
    address: " ",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (editId && editData) {
      setForm({
        space_id: editData.space_id || "",
        address: editData.address || "",
        building: editData.building || "",
        latitude: editData.address || "",
        longitude: editData.address || "",
        vehicle_type: editData.vehicle_type || "",
        rental_rule: editData.rental_rule || "",
        availability: editData.availability || "Available",
        access_mode: editData.access_mode || "Tenant only",
        enable_queue: editData.enable_queue || "Off",
      });
    }
  }, [editId, editData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!form.space_id || !form.address) {
      toaster({ type: "error", message: "Please fill required fields" });
      return;
    }

    loader?.(true);

    const payload = {
      ...form,
      building: buildingId,
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
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
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
          placeholder="P-001"
          onChange={handleChange}
        />

        <Input
          label="Location"
          name="address"
          ref={autoRef}
          placeholder="Search location..."
        />

        <Select
          label="Vehicle Type"
          name="vehicle_type"
          value={form.vehicle_type}
          onChange={handleChange}
          options={["Car", "Bike"]}
        />

        <Select
          label="Rental Rule"
          name="rental_rule"
          value={form.rental_rule}
          onChange={handleChange}
          options={["Hourly", "Daily", "Monthly"]}
        />

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
            className="px-5 py-2 border cursor-pointer rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-black cursor-pointer text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddParkingLot;

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>
    <input
      {...props}
      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
);
const Select = ({ label, options, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>

    <select {...props} className="w-full border rounded-lg px-3 py-2 text-sm">
      <option value="">Select</option>

      {options.map((item, i) => (
        <option key={i} value={item}>
          {item}
        </option>
      ))}
    </select>
  </div>
);

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
              ${value === item ? "bg-gray-200" : ""}
            `}
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

