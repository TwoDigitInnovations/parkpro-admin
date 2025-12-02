import React, { useEffect, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import isAuth from "@/components/isAuth";

function PrivacyPolicy(props) {
  const router = useRouter();
  const [policy, setPolicy] = useState("");

  const getContent = () => {
    props?.loader(true);
    Api("get", "content/get", {}, router,false).then(
      (res) => {
        props?.loader(false);
        if (res?.status) {
          const data = res.data[0];
          setPolicy(data?.policy || "");
        } else {
          props?.toaster({
            type: "error",
            message: "Failed to fetch content",
          });
        }
      },
      (err) => {
        props?.loader(false);
        props?.toaster({
          type: "error",
          message: err?.data?.message || "An error occurred",
        });
      }
    );
  };

  useEffect(() => {
    getContent();
  }, []);

  useEffect(() => {
    console.log("Current Path:", router.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black  md:p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-md border border-gray-200 rounded-xl p-4 md:p-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

        {/* Render Jodit HTML Content */}
        <div
          dangerouslySetInnerHTML={{ __html: policy }}
          className="prose prose-sm md:prose-base max-w-none text-black 
                     [&_h1]:text-2xl [&_h1]:font-semibold
                     [&_h2]:text-xl [&_h2]:font-semibold
                     [&_p]:leading-relaxed
                     [&_ul]:list-disc [&_ul]:pl-6
                     [&_ol]:list-decimal [&_ol]:pl-6
                     [&_strong]:font-semibold
                     [&_a]:text-black [&_a]:underline"
        />
      </div>
    </div>
  );
}

export default isAuth(PrivacyPolicy);
