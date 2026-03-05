"use client";

import React, { useEffect, useRef, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";

function AddBuilding({
  toaster,
  open,
  setOpenAddBuilding,
  editId,
  editData,
  fetchBuilding,
  loader,
  setpopupData,
}) {
  const router = useRouter();
  const autoRef = useRef(null);
  const autocomplete = useRef(null);

  const [form, setForm] = useState({
    name: "",
    building_name: "",
    contact_no: "",
    phone_no: "",
    street_name: "",
    house_no: "",
    city: "",
    postalcode: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (editId && editData) {
      setForm({
        name: editData?.name || "",
        building_name: editData?.building_name || "",
        contact_no: editData?.contact_no || "",
        phone_no: editData?.phone_no || "",
        street_name: editData?.street_name || "",
        house_no: editData?.house_no || "",
        city: editData?.city || "",
        postalcode: editData?.postalcode || "",
        address: editData?.address || "",
        latitude: editData?.location?.coordinates?.[1] || "",
        longitude: editData?.location?.coordinates?.[0] || "",
      });

      setPreview(editData?.building_image || "");
    }
  }, [editId, editData]);

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone_no || !form.house_no) {
      toaster({ type: "error", message: "Please fill required fields" });
      return;
    }

    loader?.(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("building_name", form.building_name);
    data.append("contact_no", form.contact_no);
    data.append("phone_no", form.phone_no);
    data.append("street_name", form.street_name);
    data.append("house_no", form.house_no);
    data.append("city", form.city);
    data.append("postalcode", form.postalcode);
    data.append("address", form.address);
    if (imageFile) {
      data.append("image", imageFile);
    }

    if (form.latitude && form.longitude) {
      data.append("location[type]", "Point");
      data.append("location[coordinates][0]", form.longitude);
      data.append("location[coordinates][1]", form.latitude);
    }

    const url = editId
      ? `building/updateBuilding/${editId}`
      : `building/create-building`;

    Api("post", url, data, router, true)
      .then((res) => {
        loader?.(false);

        if (res?.status) {
          toaster({
            type: "sucess",
            message: editId
              ? "Building updated successfully"
              : "Building created successfully",
          });
          fetchBuilding();
          setOpenAddBuilding(false);
        } else {
          toaster({
            type: "error",
            message: res?.message || "Something went wrong",
          });
        }
      })
      .catch((err) => {
        loader?.(false);

        toaster({
          type: "error",
          message: err?.message || "Something went wrong",
        });
      });
  };

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">
          {editId ? "Edit Building Address" : "Add Building Address"}
        </h2>

        <Input
          label="Building Name"
          name="building_name"
          value={form.building_name}
          placeholder="Enter Building Name"
          onChange={handleChange}
        />
        <Input
          label="Contact Person Name"
          name="name"
          value={form.name}
          placeholder="Enter Person Name"
          onChange={handleChange}
        />

        <Input
          label="Contact Number"
          name="contact_no"
          placeholder="Enter Contact Number"
          value={form.contact_no}
          onChange={handleChange}
        />

        <Input
          label="Phone Number"
          name="phone_no"
          value={form.phone_no}
          placeholder="Enter Phone Number"
          onChange={handleChange}
        />

        <Input
          label="Street Name"
          name="street_name"
          placeholder="Enter Street Name"
          value={form.street_name}
          onChange={handleChange}
        />

        <Input
          label="House No"
          name="house_no"
          value={form.house_no}
          placeholder="Enter House no."
          onChange={handleChange}
        />

        <Input
          label="City"
          name="city"
          value={form.city}
          placeholder="Enter City Name"
          onChange={handleChange}
        />

        <Input
          label="Postal Code"
          name="postalcode"
          value={form.postalcode}
          placeholder="Enter Postal Code"
          onChange={handleChange}
        />

        <div className="mb-4">
          <label className="block text-sm mb-1">Search Address</label>
          <input
            ref={autoRef}
            type="text"
            placeholder="Search location..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm mb-2">
            Add Building Image (Optional)
          </label>

          <div className="border-2 border-dashed rounded-lg p-6 text-center relative">
            {preview ? (
              <img src={preview} className="mx-auto h-24 object-contain" />
            ) : (
              <>
                <UploadCloud className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Upload Photo</p>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setpopupData({});
              setOpenAddBuilding(false);
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

// Reusable Input
const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>
    <input
      {...props}
      className="w-full border text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
);

export default AddBuilding;
