import { useEffect, useMemo, useState } from "react";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UserX } from "lucide-react";

function Home(props) {
  const [topOfficers, setTopOfficers] = useState([]);
  const [Dashboard, setDashboard] = useState({});
  const [reports, setReports] = useState([]);

  const router = useRouter();
  useEffect(() => {
    getDashBoardDetails();
    last7DaysReports();
    getTopOfficer();
  }, []);

  const formatWeeklyBookings = (data) => {
    return data.map((item) => ({
      date: item._id, // X-axis
      total: item.total, // Y-axis
    }));
  };

  const getDashBoardDetails = async () => {
    props.loader(true);
    let url = `admin/dashboardDetails`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        console.log("abcd", res?.data);
        setDashboard(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({
          type: "error",
          message: err?.message || "Something went Wrong",
        });
      }
    );
  };

  const getTopOfficer = async () => {
    props.loader(true);
    let url = `admin/getTopOfficer`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        console.log("abcd", res?.data);
        setTopOfficers(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({
          type: "error",
          message: err?.message || "Something went Wrong",
        });
      }
    );
  };

  const last7DaysReports = async () => {
    props.loader(true);
    let url = `admin/last7DaysReports`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        const data = formatWeeklyBookings(res.data);
        setReports(data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({
          type: "error",
          message: err?.message || "Something went Wrong",
        });
      }
    );
  };

  const generateAvatar = (name = "") => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="w-[38px] h-[38px] rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
        {initials}
      </div>
    );
  };

  const DashboardCard = ({ title, subtitle, subtitleColor, value }) => {
    return (
      <div className="bg-white w-full border border-[#00000080] rounded-[20px] boxShadow p-3">
        <p className="text-black text-sm font-medium pb-2">{title}</p>

        <div className="flex justify-between items-center gap-5">
          <p className={`text-xs font-medium ${subtitleColor}`}>{subtitle}</p>

          <p className="text-black text-[38px] font-semibold">{value ?? 0}</p>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-5 mb-5">
        <DashboardCard
          title="Total Reports Today"
          subtitle="+12% vs yesterday"
          subtitleColor="text-[var(--custom-green)]"
          value={Dashboard?.totalReports}
        />

        <DashboardCard
          title="Closed Reports"
          subtitle="77% resolution rate"
          subtitleColor="text-[var(--custom-green)]"
          value={Dashboard?.closedReports}
        />

        <DashboardCard
          title="Active Officers"
          subtitle="Online now"
          subtitleColor="text-[var(--custom-lightBlue)]"
          value={Dashboard?.activeStaff}
        />

        <DashboardCard
          title="Active Technician"
          subtitle="Online now"
          subtitleColor="text-[var(--custom-lightBlue)]"
          value={Dashboard?.activeTechnician}
        />
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5">
        {/* <img className="w-full" src="/chartImg.png" /> */}
        <div className="bg-white p-4  border border-[#00000080] rounded-[12px] boxShadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Reports This Week
          </h3>

          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reports} barSize={40}>
                <CartesianGrid stroke="#000" strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tick={{ fill: "#000", fontSize: 12 }}
                  axisLine={{ stroke: "#000" }}
                  tickLine={{ stroke: "#000" }}
                />

                <YAxis
                  tick={{ fill: "#000", fontSize: 12 }}
                  axisLine={{ stroke: "#000" }}
                  tickLine={{ stroke: "#000" }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                  cursor={{ fill: "rgba(0,0,0,0.08)" }}
                />

                <Bar
                  dataKey="total"
                  fill="#000" // ✅ BLACK BAR
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white w-full border border-[#00000080] rounded-[12px] boxShadow p-5">
          <p className="text-black text-lg font-semibold pb-3">Top Officers</p>

          <div className="flex flex-col gap-3 w-full">
            {topOfficers?.map((officer, index) => (
              <div
                key={index}
                className="bg-white w-full border border-[#0000004D] rounded-[8px] boxShadow p-3 flex justify-between items-center gap-5 hover:shadow-md transition"
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  {generateAvatar(officer.name)}
                  <p className="text-black text-sm font-medium">
                    {officer.name}
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                  <p className="text-black text-[10px] font-medium">
                    Reports Handled:
                  </p>
                  <p className="text-black text-lg font-semibold">
                    {officer.totalResolved}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {topOfficers.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
              <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center">
                <UserX className="text-black" size={24} />
              </div>

              <p className="text-black text-sm font-medium">
                No top officers yet
              </p>

              <p className="text-gray-500 text-xs text-center">
                  Once reports are resolved, officers will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default isAuth(Home);
