import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import moment from "moment";
import { userContext } from "./_app";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

function ContentManagement(props) {
  const [contentData, setContentData] = useState({
    policy: "",
    terms: "",
    id: "",
  });

  const [user] = useContext(userContext);
  const [tab, setTab] = useState("CONTENT");
  const router = useRouter();

  useEffect(() => {
    getContent();
  }, []);

  const getContent = () => {
    props.loader(true);
    Api("get", "content/get", {}, router).then(
      (res) => {
        props.loader(false);
        if (res?.status) {
          const data = res.data[0];
          setContentData({
            policy: data?.policy || "",
            terms: data?.terms || "",
            id: data?._id || "",
          });
        } else {
          props.toaster({
            type: "error",
            message: "Failed to fetch content",
          });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({
          type: "error",
          message: err?.data?.message || "An error occurred",
        });
      }
    );
  };

  const updateContent = (field, apiField, confirmText) => {
    Swal.fire({
      title: "Are you sure?",
      text: confirmText,
      showCancelButton: true,
      confirmButtonColor: "#127300",
      cancelButtonColor: "#127300",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        props.loader(true);

        const payload = {
          id: contentData.id,
          policy: contentData.policy,
          terms: contentData.terms,
        };

        Api("post", "content/update", payload, router).then(
          (res) => {
            props.loader(false);
            props.toaster({
              type: "success",
              message: res?.data?.message || "Updated successfully",
            });
            getContent();
          },
          (err) => {
            props.loader(false);
            props.toaster({
              type: "error",
              message: err?.data?.message || "An error occurred",
            });
          }
        );
      }
    });
  };

  const handleContentChange = (field, value) => {
    setContentData((prev) => ({ ...prev, [field]: value }));
  };

  const policyConfigs = [
    {
      title: "Policy",
      field: "policy",
      apiField: "policy",
      confirmText: "You want to update Policy!",
    },
    {
      title: "Terms and Conditions",
      field: "terms",
      apiField: "terms",
      confirmText: "You want to update Terms and Conditions!",
    },
  ];

  return (
    <div className="w-full mx-auto">
      <div className="max-h-[80vh] h-full overflow-y-scroll scrollbar-hide pb-20">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 border-l-4 border-black flex flex-col md:flex-row items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">
                {moment(new Date()).format("dddd, DD MMM YYYY")}
              </p>
              <h2 className="text-2xl md:text-3xl text-black font-bold mt-1">
                Welcome,{" "}
                <span className="text-black">{user?.role || "Admin"}</span>
              </h2>
            </div>

            <button
              className={`py-2 px-6 rounded-lg font-medium ${
                tab === "CONTENT"
                  ? "bg-black text-white"
                  : "bg-white border-2 text-[#127300] border-[#127300]"
              }`}
              onClick={() => setTab("CONTENT")}
            >
              Content Management
            </button>
          </div>
        </div>

        {/* SECTIONS */}
        {policyConfigs.map((config, index) => (
          <PolicySection
            key={config.field}
            title={config.title}
            value={contentData[config.field]}
            onBlur={(newContent) =>
              handleContentChange(config.field, newContent)
            }
            onSubmit={() =>
              updateContent(config.field, config.apiField, config.confirmText)
            }
            isLast={index === policyConfigs.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

const PolicySection = ({ title, value, onChange, onSubmit, isLast }) => {
  return (
    <div className={`mb-${isLast ? "20" : "8"}`}>
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-xl md:text-2xl font-bold flex items-center">
            <span className="inline-block w-1.5 h-8 bg-black mr-3 rounded"></span>
            {title}
          </h3>
        </div>

        <div className="p-4 md:p-6">
          <div className="border rounded-lg overflow-hidden">
            <JoditEditor
              value={value}
              onChange={onChange}
              config={{
                height: 400,
                toolbarAdaptive: false,
              }}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onSubmit}
              className="bg-black text-white py-2 px-6 rounded-lg shadow-md"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
