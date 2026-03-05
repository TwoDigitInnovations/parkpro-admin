import React, { useState, useEffect } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { Camera, CameraIcon, Edit } from "lucide-react";
import { MdUpdate } from "react-icons/md";

function Profile(props) {
  const { loader, toaster } = props;

  const router = useRouter();
  const [profileData, setProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_no: "",
    house_no: "",
    street_name: "",
    city: "",
    postal_code: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);


  const getProfile = async () => {
    loader(true);
    Api("get", `auth/profile`, "", router).then(
      (res) => {
        loader(false);
        setProfileData(res.data);
       
        setForm({
          name: res.data?.name || "",
          email: res.data?.email || "",
          phone_no: res.data?.phone_no || "",
          house_no: res.data?.house_no || "",
          street_name: res.data?.street_name || "",
          city: res.data?.city || "",
          postal_code: res.data?.postal_code || "",
        });
        setPreview(res.data?.profile_image);
      },
      (err) => {
        loader(false);
        toaster({ type: "error", message: err?.message });
      },
    );
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateProfile = () => {
    if (!form.name || !form.phone_no) {
      toaster({ type: "error", message: "Please fill required fields" });
      return;
    }

    loader(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("phone_no", form.phone_no);
    data.append("house_no", form.house_no);
    if (imageFile) data.append("image", imageFile);

    Api("post", `auth/update-profile`, data, router, true)
      .then((res) => {
        loader(false);
        if (res?.status) {
          toaster({ type: "success", message: "Profile updated successfully" });
          setIsEditing(false);
          getProfile();
        } else {
          toaster({
            type: "error",
            message: res?.message || "Something went wrong",
          });
        }
      })
      .catch((err) => {
        loader(false);
        toaster({ type: "error", message: err?.message });
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] md:p-8 p-4">
 
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-black font-bold border-b-4 border-black text-2xl pb-1">
          My Profile
        </h1>
       
      </div>

      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 mb-6">
        <div className="relative group">
          <img
            src={preview || "https://via.placeholder.com/80"}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            alt="Profile"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer border">
              <CameraIcon className="text-black"/>
              <input type="file" hidden onChange={handleImageChange} />
            </label>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {profileData?.name || "User Name"}
          </h2>
          <p className="text-gray-500 font-medium">
            {profileData?.role || "User"}
          </p>
          <p className="text-gray-400 text-sm">
            {profileData?.location || "Location Not Set"}
          </p>
        </div>
      </div>

      <SectionWrapper
        title="Personal Information"
        onEdit={() => setIsEditing(true)}
        onUpdate={updateProfile}
        isEditing={isEditing}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12 mt-4">
          <InfoField
            label="First Name"
            name="name"
            value={form.name}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
          <InfoField
            label="User Role"
            value={profileData?.role}
            isEditing={false}
          />
          <InfoField
            label="E-mail Address"
            name="email"
            value={form.email}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
          <InfoField
            label="Phone Number"
            name="phone_no"
            value={form.phone_no}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
        </div>
      </SectionWrapper>

      
      <SectionWrapper
        title="Address"
        onEdit={() => setIsEditing(true)}
        onUpdate={updateProfile}
        isEditing={isEditing}
        className="mt-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 mt-4">
          <InfoField
            label="Street Name"
            name="street_name"
            value={form.street_name}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
          <InfoField
            label="House No."
            name="house_no"
            value={form.house_no}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
          <InfoField
            label="City/Country"
            name="city"
            value={form.city}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
          <InfoField
            label="Postal Code"
            name="postal_code"
            value={form.postal_code}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
        </div>
      </SectionWrapper>
    </div>
  );
}


const SectionWrapper = ({
  title,
  children,
  onEdit,
  onUpdate,
  isEditing,
  className,
}) => (
  <div
    className={`bg-white rounded-2xl md:p-6 p-3 shadow-sm border border-gray-100 ${className}`}
  >
    <div className="flex md:flex-row flex-col justify-between items-start gap-2 md:items-center border-bottom mb-4">
      <h3 className="text-lg font-bold text-gray-700">{title}</h3>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
        >
          <Edit size={18}/> Edit
        </button>
        <button
          onClick={onUpdate}
          className="flex items-center gap-1 cursor-pointer px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
        >
          <MdUpdate size={18}/> Update
        </button>
      </div>
    </div>
    {children}
  </div>
);

const InfoField = ({ label, value, isEditing, name, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-gray-400 text-sm font-medium">{label}</label>
    {isEditing && name ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="border-b border-gray-300 focus:border-black outline-none py-1 text-gray-800"
      />
    ) : (
      <span className="text-gray-800 font-semibold">{value || "-"}</span>
    )}
  </div>
);

export default Profile;
