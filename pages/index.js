// import { FiBell, FiUser, FiEye } from "react-icons/fi";
// import Image from "next/image";
import { useMemo, useState } from "react";
import Table from "@/components/table";
import { LuEye } from "react-icons/lu";
import isAuth from "@/components/isAuth";

function Home() {
  const [productsList, setProductsList] = useState([]);

  function reportId({ value }) {
    return (
      <div>
        <p className='text-black text-base font-normal text-center'>{value}</p>
      </div>
    )
  }

  function type({ value }) {
    return (
      <div>
        <p className='text-black text-base font-normal text-center'>{value}</p>
      </div>
    )
  }

  function reportedBy({ value }) {
    return (
      <div>
        <p className='text-black text-base font-normal text-center'>{value}</p>
      </div>
    )
  }

  function officerAssigned({ value }) {
    return (
      <div>
        <p className='text-black text-base font-normal text-center'>{value}</p>
      </div>
    )
  }

  function status({ value }) {
    return (
      <div>
        <p className='text-black text-base font-normal text-center'>{value}</p>
      </div>
    )
  }

  function dateAndTime({ value }) {
    return (
      <div>
        <p className='text-black text-base font-normal text-center'>{value}</p>
      </div>
    )
  }

  function view({ value }) {
    return (
      <div className="bg-[#00000080] w-[60px] h-[42px] rounded-[10px] flex justify-center items-center">
        <LuEye className="w-[24px] h-[24px] text-black " />
      </div>
    )
  }

  const columns = useMemo(
    () => [
      {
        Header: "Report Id",
        // accessor: "_id",
        Cell: reportId,
      },
      {
        Header: "Type",
        accessor: 'first_name',
        Cell: type
      },
      {
        Header: "Reported By",
        accessor: 'phone',
        Cell: reportedBy
      },
      {
        Header: "Officer Assigned",
        accessor: 'email',
        Cell: officerAssigned
      },
      {
        Header: "Status",
        accessor: 'createdAt',
        Cell: status
      },
      {
        Header: "Date & Time",
        accessor: 'date',
        Cell: dateAndTime
      },
      {
        Header: "View",
        // accessor: 'date',
        Cell: view
      },
    ],
    []
  );

  // const topOfficers = [
  //   { name: "Paul", reports: 86, img: "/officers/paul.jpg" },
  //   { name: "Dom", reports: 80, img: "/officers/dom.jpg" },
  //   { name: "Landon", reports: 78, img: "/officers/landon.jpg" },
  //   { name: "Kelly", reports: 62, img: "/officers/kelly.jpg" },
  //   { name: "Kloe", reports: 55, img: "/officers/kloe.jpg" },
  // ];

  // const reports = [
  //   { id: "#REP1234", type: "Illegal Parking", reportedBy: "John", officer: "Paul", status: "Active", date: "23rd September, 09:45 AM" },
  //   { id: "#REP1235", type: "Illegal Parking", reportedBy: "Dave", officer: "Kloe", status: "Active", date: "23rd September, 09:45 AM" },
  // ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-5 mb-5">
        <div className="bg-white w-full border border-[#00000080] rounded-[20px] boxShadow p-3">
          <p className="text-black text-sm font-medium pb-2">Total Reports Today</p>
          <div className="flex justify-between items-center gap-5">
            <p className="text-xs text-[var(--custom-green)] font-medium">+12% vs yesterday</p>
            <p className="text-black text-[38px] font-semibold">248</p>
          </div>
        </div>

        <div className="bg-white w-full border border-[#00000080] rounded-[20px] boxShadow p-3">
          <p className="text-black text-sm font-medium pb-2">Closed Reports</p>
          <div className="flex justify-between items-center gap-5">
            <p className="text-xs text-[var(--custom-green)] font-medium">77% resolution rate</p>
            <p className="text-black text-[38px] font-semibold">192</p>
          </div>
        </div>

        <div className="bg-white w-full border border-[#00000080] rounded-[20px] boxShadow p-3">
          <p className="text-black text-sm font-medium pb-2">Active Officers</p>
          <div className="flex justify-between items-center gap-5">
            <p className="text-xs text-[var(--custom-lightBlue)] font-medium">Online now</p>
            <p className="text-black text-[38px] font-semibold">36</p>
          </div>
        </div>

        <div className="bg-white w-full border border-[#00000080] rounded-[20px] boxShadow p-3">
          <p className="text-black text-sm font-medium pb-2">Average Response Time</p>
          <div className="flex justify-between items-center gap-5">
            <p className="text-xs text-[var(--custom-lightBlue)] font-medium">Faster than last week</p>
            <p className="text-black text-[38px] font-semibold">14<span className="text-black text-[8px] font-semibold">mins</span></p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5">
        <img className="w-full" src="/chartImg.png" />

        <div className="bg-white w-full border border-[#00000080] rounded-[12px] boxShadow p-5">
          <p className="text-black text-sm font-semibold pb-3">Top Officers</p>

          <div className="flex flex-col gap-3 w-full">
            <div className="bg-white w-full border border-[#0000004D] rounded-[8px] boxShadow p-3 flex justify-between items-center gap-5">
              <div className="flex justify-start items-center gap-5">
                <img className="w-[38px] h-[38px] rounded-full" src="/image.png" />
                <p className="text-black text-sm font-medium">Paul</p>
              </div>
              <div className="flex justify-start items-center gap-2">
                <p className="text-black text-[10px] font-medium">Reports Handled:</p>
                <p className="text-black text-lg font-medium">86</p>
              </div>
            </div>

            <div className="bg-white w-full border border-[#0000004D] rounded-[8px] boxShadow p-3 flex justify-between items-center gap-5">
              <div className="flex justify-start items-center gap-5">
                <img className="w-[38px] h-[38px] rounded-full" src="/image-1.png" />
                <p className="text-black text-sm font-medium">Dom</p>
              </div>
              <div className="flex justify-start items-center gap-2">
                <p className="text-black text-[10px] font-medium">Reports Handled:</p>
                <p className="text-black text-lg font-medium">80</p>
              </div>
            </div>

            <div className="bg-white w-full border border-[#0000004D] rounded-[8px] boxShadow p-3 flex justify-between items-center gap-5">
              <div className="flex justify-start items-center gap-5">
                <img className="w-[38px] h-[38px] rounded-full" src="/image-2.png" />
                <p className="text-black text-sm font-medium">Landon</p>
              </div>
              <div className="flex justify-start items-center gap-2">
                <p className="text-black text-[10px] font-medium">Reports Handled:</p>
                <p className="text-black text-lg font-medium">78</p>
              </div>
            </div>

            <div className="bg-white w-full border border-[#0000004D] rounded-[8px] boxShadow p-3 flex justify-between items-center gap-5">
              <div className="flex justify-start items-center gap-5">
                <img className="w-[38px] h-[38px] rounded-full" src="/image-3.png" />
                <p className="text-black text-sm font-medium">Kelly</p>
              </div>
              <div className="flex justify-start items-center gap-2">
                <p className="text-black text-[10px] font-medium">Reports Handled:</p>
                <p className="text-black text-lg font-medium">62</p>
              </div>
            </div>

            <div className="bg-white w-full border border-[#0000004D] rounded-[8px] boxShadow p-3 flex justify-between items-center gap-5">
              <div className="flex justify-start items-center gap-5">
                <img className="w-[38px] h-[38px] rounded-full" src="/image-3.png" />
                <p className="text-black text-sm font-medium">Kloe</p>
              </div>
              <div className="flex justify-start items-center gap-2">
                <p className="text-black text-[10px] font-medium">Reports Handled:</p>
                <p className="text-black text-lg font-medium">55</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:pb-5">
        <Table columns={columns} data={productsList} />
      </div>

      {/* <div className="grid grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4 col-span-2">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Reports</h3>
            <div className="space-x-2">
              <button className="px-3 py-1 bg-black text-white rounded">Last 7 Days</button>
              <button className="px-3 py-1 bg-gray-200 rounded">Last 30 Days</button>
            </div>
          </div>
          <div className="h-56 flex items-center justify-center text-gray-400">
            [Chart Goes Here]
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold mb-4">Top Officers</h3>
          <ul className="space-y-3">
            {topOfficers.map((o, i) => (
              <li key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Image src={o.img} alt={o.name} width={32} height={32} className="rounded-full" />
                  <span>{o.name}</span>
                </div>
                <span className="text-sm">Reports: {o.reports}</span>
              </li>
            ))}
          </ul>
        </div>
      </div> */}

      {/* <div className="bg-white shadow rounded-lg p-4 mt-6">
        <h3 className="font-semibold mb-4">Latest Reports</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Report Id</th>
              <th>Type</th>
              <th>Reported By</th>
              <th>Officer Assigned</th>
              <th>Status</th>
              <th>Date & Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{r.id}</td>
                <td>{r.type}</td>
                <td>{r.reportedBy}</td>
                <td>{r.officer}</td>
                <td>{r.status}</td>
                <td>{r.date}</td>
                <td>
                  <button className="p-2 rounded hover:bg-gray-200">
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}

export default isAuth(Home)
