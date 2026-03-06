import React, { useState, useEffect } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";

function AddLandlords({
  editId,
  editData,
  setOpen,
  fetchBuilding,
  loader,
  toaster,
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    if (editId && editData) {
      setForm({
        name: editData.name || "",
        email: editData.email || "",
        phone: editData.phone || "",
        role: editData.role || "",
      });
    }
  }, [editId, editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   
    if (!form.name || !form.phone || !form.email) {
      toaster({ type: "error", message: "Please fill required fields" });
      return;
    }

    loader?.(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("phone", form.phone);
    data.append("role", "landlord");

    const url = editId
      ? `auth/updatelandlords/${editId}`
      : `auth/create-landlords`;

    Api("post", url, data, router, true)
      .then((res) => {
        loader?.(false);
        if (res?.status) {
          toaster({
            type: "success", // Fixed typo 'sucess' to 'success'
            message: editId
              ? "Landlord updated successfully"
              : "Landlord created successfully",
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
    <section className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-3 md:p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          {editId ? "Edit Landlord Details" : "Add Landlords"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-md font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-400"
            />
          </div>

      
          <div className="flex flex-col gap-2">
            <label className="text-md font-semibold text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter e-mail"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-400"
            />
          </div>

       

        
          <div className="flex flex-col gap-2">
            <label className="text-md font-semibold text-gray-700">
              Phone Number
            </label>
            <input
              type="number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter number"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2">
            <label className="text-md font-semibold text-gray-700">
              Password
            </label>
            <input
              type="text"
              name="role"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-8 py-3 border border-gray-800 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-3 bg-[#1e1e1e] text-white font-semibold rounded-xl hover:bg-black transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddLandlords;
