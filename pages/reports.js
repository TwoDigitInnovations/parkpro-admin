import React, { useEffect, useMemo, useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { LuMailSearch } from "react-icons/lu";
import { LuCalendarSearch } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { LuListRestart } from "react-icons/lu";
import Table, { indexID } from "@/components/table";
import { LuEye } from "react-icons/lu";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Navigation } from "swiper/modules";

function Reports(props) {
  const router = useRouter();
  const [reportData, setReportData] = useState([]);
  const [viewPopup, setviewPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [driverdata, setdriverdata] = useState([]);
  const [currentIndex, setCuurentIndex] = useState(0);

  const driverdatas = [
    {
      img: "/image-6.png",
    },
    {
      img: "/image-6.png",
    },
    {
      img: "/image-6.png",
    },
    {
      img: "/image-6.png",
    },
  ];

  const [serchData, setSearchData] = useState({
    issue_type: "",
    status: "",
  });
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    getReport();
  }, []);
  const handleSearch = () => {
    getReport({
      issue_type: serchData.issue_type,
      status: serchData.status,
      date: selectedDate ? new Date(selectedDate).toISOString() : "",
    });
  };

  const getReport = async (filters = {}) => {
    props.loader(true);

    const issueType = filters.issue_type || "";
    const status = filters.status || "";
    const date = filters.date || "";

    Api(
      "get",
      `report/getReport?key=${issueType}&status=${status}&date=${date}`,
      "",
      router
    ).then(
      (res) => {
        props.loader(false);
        setReportData(res.data);
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const handleReset = () => {
    setSearchData({
      issue_type: "",
      status: "",
    });
    setSelectedDate("");

    getReport({
      issue_type: "",
      status: "",
      date: "",
    });
  };

  const handleClose = () => {
    setviewPopup(false);
    setPopupData({});
    setdriverdata([]);
  };

  const updateVerifyandSuspendStatus = async (id, status) => {
    // return
    props.loader(true);
    Api(
      "post",
      "report/updateVerifyandSuspendStatus",
      { id, status },
      router
    ).then(
      (res) => {
        props.loader(false);
        // console.log("res================>", res);
        setviewPopup(false);
        getReport();
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  function reportId({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function type({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function licensePlateNo({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function address({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function reportedBy({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function officerAssigned({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function status({ value }) {
    return (
      <div>
        <p className="text-black text-base font-normal text-center">{value}</p>
      </div>
    );
  }

  function dateAndTime({ row, value }) {
    // console.log(row?.original)
    return (
      <div>
        <p className="text-black text-base font-normal text-center">
          {moment(value).format("DD MMMM, h:mm A")}
        </p>
      </div>
    );
  }

  function view({ value, row }) {
    // console.log(row.original)
    return (
      <div
        className="bg-[#00000080] w-[60px] h-[42px] rounded-[10px] flex justify-center items-center"
        onClick={() => {
          setviewPopup(true);
          setPopupData(row.original);
          setdriverdata([
            {
              img: row.original?.image,
            },
          ]);
        }}
      >
        <LuEye className="w-[24px] h-[24px] text-black " />
      </div>
    );
  }

  console.log("popup Data", popupData);

  const columns = useMemo(
    () => [
      // {
      //     Header: "Report Id",
      //     // accessor: "_id",
      //     Cell: reportId,
      // },
      {
        Header: "Type",
        accessor: "issue_type",
        Cell: type,
      },

      {
        Header: "Address",
        accessor: "address",
        Cell: address,
      },
      // {
      //     Header: "Reported By",
      //     accessor: 'phone',
      //     Cell: reportedBy
      // },
      // {
      //     Header: "Officer Assigned",
      //     // accessor: 'email',
      //     Cell: officerAssigned
      // },
      {
        Header: "Status",
        accessor: "status",
        Cell: status,
      },
      {
        Header: "Date & Time",
        accessor: "createdAt",
        Cell: dateAndTime,
      },
      {
        Header: "View",
        // accessor: 'date',
        Cell: view,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="bg-white border border-[#00000050] rounded-[10px] boxShadow p-5">
        <div className="grid md:grid-cols-5 grid-cols-1 w-full gap-5">
          <div className="w-full">
            <p className="text-black text-sm font-normal pl-5 pb-1">Type</p>
            <div className="flex justify-start items-center md:w-[206px] w-full h-[42px] border border-[#1E1E1E55] rounded-[30px]">
              <LuUserRound className="w-[16px] h-[16px] text-[var(--custom-newBlack)] ml-5" />
              <input
                type="text"
                placeholder="Search by type"
                className="bg-white text-[var(--custom-newBlack)] font-normal text-xs px-2 outline-0"
                value={serchData.issue_type}
                onChange={(e) => {
                  setSearchData({ ...serchData, issue_type: e.target.value });
                }}
              />
            </div>
          </div>

          {/* <div className='w-full'>
                        <p className='text-black text-sm font-normal pl-5 pb-1'>Status</p>
                        <div className='flex justify-start items-center md:w-[206px] w-full h-[42px] border border-[#1E1E1E55] rounded-[30px]'>
                            <LuMailSearch className='w-[16px] h-[16px] text-[var(--custom-newBlack)] ml-5' />
                            <input
                                type="text"
                                placeholder="Search by status"
                                className="bg-white text-[var(--custom-newBlack)] font-normal text-xs px-2 outline-0"
                            />
                        </div>
                    </div> */}

          <div className="w-full">
            <p className="text-black text-sm font-normal pl-5 pb-1">Status</p>
            <div className="relative px-3 w-full bg-transparent border border-[#1E1E1E55] rounded-[30px]">
              <LuMailSearch className="w-[16px] h-[16px] text-[var(--custom-newBlack)]  absolute md:top-[13px] top-[10px] left-5" />
              <select
                className="bg-transparent w-full md:h-[42px] h-[40px] pl-8 pr-5  outline-none text-[var(--custom-newBlack)]  font-normal text-xs"
                placeholder="Select by status"
                value={serchData.status}
                onChange={(newValue) => {
                  setSearchData({
                    ...serchData,
                    status: newValue.target.value,
                  });
                }}
              >
                <option value="" className="p-5">
                  Select by status
                </option>
                <option value="Pending" className="p-5">
                  Pending
                </option>
                <option value="Verified" className="p-5">
                  Verified
                </option>
                <option value="Suspended" className="p-5">
                  Suspended
                </option>
              </select>
            </div>
          </div>

          <div className="w-full">
            <p className="text-black text-sm font-normal pl-5 pb-1">Date</p>
            <div className="flex justify-start items-center md:w-[206px] w-full h-[42px] border border-[#1E1E1E55] rounded-[30px]">
              <LuCalendarSearch className="w-[18px] h-[18px] text-[var(--custom-newBlack)] ml-5" />
              <input
                type="date"
                placeholder="Search by date"
                className="bg-transparent text-[var(--custom-newBlack)] font-normal text-xs px-2 outline-0 w-full"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:col-span-2 flex md:justify-end justify-start items-center gap-5">
            <div
              className="bg-black md:w-[103px] w-full h-[42px] rounded-[6px] flex justify-center items-center gap-2"
              onClick={handleSearch}
            >
              <button className="text-white font-normal text-base">
                Search
              </button>
              <FiSearch className="w-5 h-5 text-white" />
            </div>
            <div
              className="border border-black md:w-[103px] w-full h-[42px] rounded-[6px] flex justify-center items-center gap-2"
              onClick={handleReset}
            >
              <button className="text-black font-normal text-base">
                Reset
              </button>
              <LuListRestart className="w-5 h-5 text-black" />
            </div>
          </div>
        </div>
      </div>

      {viewPopup && (
        <Dialog open={viewPopup} onClose={handleClose} maxWidth="md">
          <div className="bg-white rounded-[18px] relative overflow-hidden">
            <IoCloseCircleOutline
              className="text-black h-8 w-8 absolute right-2 top-2"
              onClick={handleClose}
            />
            <div className="border-b-2 border-b-black grid md:grid-cols-7 grid-cols-1 w-full">
              <div className="pt-5 md:pb-5 pb-0 pl-5 pr-5 w-full col-span-3">
                <div className="md:flex flex-row justify-start items-start">
                  <img
                    className="w-[76px] h-[76px] rounded-full"
                    src={popupData?.user?.profile || "/userImg.png"}
                  />

                  <div className="flex flex-col justify-start items-start md:pl-5">
                    <p className="text-base font-bold text-[var(--custom-black)] md:pt-0 pt-2">
                      {popupData?.user?.name}
                    </p>
                    <p className="text-base font-semibold text-[var(--custom-blackColor)] pt-2">
                      {popupData?.user?.email}
                    </p>
                    {/* <p className="text-sm font-semibold text-[var(--custom-black)] pt-2">
                      {popupData?.user?.phone}
                    </p> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-7 grid-cols-1 w-full p-5">
              <div className="col-span-3 w-full md:border-r-2 md:border-r-black">
                <p className="text-lg text-[var(--custom-newBlackColor)] font-bold">
                  Report Id:{" "}
                  <span className="font-medium">{popupData?._id}</span>
                </p>
                <p className="text-lg text-[var(--custom-newBlackColor)] font-bold pt-5">
                  Reporter’s Name: <span className="font-medium">---</span>
                </p>
                <p className="text-lg text-[var(--custom-newBlackColor)] font-bold pt-5">
                  Email: <span className="font-medium">---</span>
                </p>
                <p className="text-lg text-[var(--custom-newBlackColor)] font-bold pt-5">
                  Phone No: <span className="font-medium">---</span>
                </p>
                <p className="text-lg text-[var(--custom-newBlackColor)] font-bold pt-5">
                  Registered On:{" "}
                  <span className="font-medium">
                    {moment(popupData.createdAt).format("DD-MM-YYYY")}
                  </span>
                </p>
                <p className="text-lg text-[var(--custom-newBlackColor)] font-bold pt-5">
                  Registered At:{" "}
                  <span className="font-medium">
                    {moment(popupData.createdAt).format("hh:mm A")}
                  </span>
                </p>

                <p className="text-lg text-[var(--custom-newBlackColor)] font-bold pt-5">
                  Report Type:{" "}
                  <span className="font-medium">{popupData?.issue_type}</span>
                </p>
                <p className="text-lg text-[var(--custom-newBlackColor)] font-bold pt-5">
                  Assigned Officer: <span className="font-medium"> --</span>
                </p>
                <p className="text-lg text-[var(--custom-newBlackColor)] font-bold pt-5">
                  Status:{" "}
                  <span className="font-medium">{popupData?.status}</span>
                </p>
              </div>

              <div className="col-span-4 w-full md:pl-5">
                <Swiper
                  navigation={true}
                  modules={[Navigation]}
                  className="mySwiper mt-5 md:w-[480px] w-[500px]"
                  onRealIndexChange={(newindex) =>
                    setCuurentIndex(newindex.activeIndex)
                  }
                  onSlideChange={() => console.log("slide change")}
                  onSwiper={(swiper) => console.log(swiper)}
                >
                  {driverdata?.map((item, i) => (
                    <SwiperSlide onKeyUpCapture={i}>
                      <div className="w-full flex justify-center">
                        <div className="md:w-80 md:h-80 w-60 h-48 relative rounded-lg">
                          <img
                            src={item.img}
                            alt="image not found"
                            layout="responsive"
                            className="rounded-sm md:w-80 md:h-80 w-60 h-48"
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="md:h-12">
                  <div className="flex mt-5 justify-center gap-5">
                    {popupData?.status != "Verified" && (
                      <button
                        className="text-white text-lg font-bold w-[274px] h-[50px] rounded-[12px] bg-[var(--custom-darkGreen)]"
                        onClick={() => {
                          updateVerifyandSuspendStatus(
                            popupData?._id,
                            "Verified"
                          );
                        }}
                      >
                        Verify
                      </button>
                    )}
                    {popupData?.status != "Suspended" && (
                      <button
                        className="text-white text-lg font-bold w-[274px] h-[50px] rounded-[12px] bg-[var(--custom-orange)]"
                        onClick={() => {
                          updateVerifyandSuspendStatus(
                            popupData?._id,
                            "Suspended"
                          );
                        }}
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* <p className="text-[var(--custom-black)] text-base font-bold pt-2">
                            Uploaded Document
                        </p> */}
            </div>
          </div>
        </Dialog>
      )}

      <div className="">
        <Table columns={columns} data={reportData} />
      </div>
    </div>
  );
}

export default isAuth(Reports);
