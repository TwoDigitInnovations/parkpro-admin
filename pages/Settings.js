import React, { useState, useEffect } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { Camera, CameraIcon, Edit } from "lucide-react";
import { MdUpdate } from "react-icons/md";

function Settings(props) {
  const { loader, toaster } = props;

  const router = useRouter();

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] md:p-8 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-black font-bold border-b-4 border-black text-2xl pb-1">
          Settings
        </h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 mb-6">
        <p> NOt Found Any Settings </p>
      </div>
    </div>
  );
}

export default Settings;
