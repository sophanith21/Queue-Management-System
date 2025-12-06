import { useContext, useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";

// 💡 Charting Library Imports (Requires 'recharts' to be installed)
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Helper Functions ---

/**
 * Converts milliseconds to a formatted duration string (HH:MM:SS or MM:SS).
 * @param {number} ms - Duration in milliseconds.
 * @returns {string} Formatted time string.
 */
const formatDuration = (ms) => {
  if (ms === undefined || ms === null) return "N/A";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [
    hours > 0 ? String(hours).padStart(2, "0") : null,
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].filter((p) => p !== null);

  return parts.join(":");
};

/**
 * Calculates key performance metrics from the raw report data.
 * @param {object} metrics - The raw metrics object from the server.
 * @returns {object} Derived metrics with formatted times.
 */
const calculateMetrics = (metrics) => {
  // Filter wait times only for participants who were successfully served ('checkedIn')
  const servedWaitTimes = metrics.waitTimes
    .filter((w) => w.type === "checkedIn")
    .map((w) => w.duration);

  const totalServed = servedWaitTimes.length;

  // Average Wait Time (Served)
  const avgWaitServedMs =
    totalServed > 0
      ? servedWaitTimes.reduce((sum, time) => sum + time, 0) / totalServed
      : 0;

  // Average Service Time
  const totalServiceTimeMs = metrics.serviceTimes.reduce(
    (sum, time) => sum + time,
    0
  );
  const totalServices = metrics.serviceTimes.length;

  const avgServiceTimeMs =
    totalServices > 0 ? totalServiceTimeMs / totalServices : 0;

  return {
    avgWaitServed: formatDuration(avgWaitServedMs),
    avgService: formatDuration(avgServiceTimeMs),
    totalServed: totalServed,
    totalExitedEarly: metrics.exitedEarly,
    totalEntered: metrics.totalEntered,
    waitingAtClose: metrics.waitingAtClose,
  };
};

// --- Sub-Components ---

/**
 * Simple reusable card for displaying a single KPI.
 */
const MetricCard = ({ title, value, colorClass = "text-gray-900" }) => (
  <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <h3 className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</h3>
  </div>
);

/**
 * Horizontal Bar Chart visualizing the participant flow summary.
 */
const UserFlowBarChart = ({ data }) => {
  const chartData = [
    {
      name: "Entered",
      count: data.totalEntered,
      fill: "#1E40AF",
    },
    {
      name: "Served",
      count: data.totalServed,
      fill: "#059669",
    },
    {
      name: "Exited Early",
      count: data.totalExitedEarly,
      fill: "#DC2626",
    },
    {
      name: "Waiting at Close",
      count: data.waitingAtClose,
      fill: "#D97706",
    },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* XAxis is for count (number) */}
          <XAxis type="number" allowDecimals={false} />
          {/* YAxis is for the categories (names) */}
          <YAxis dataKey="name" type="category" stroke="#6B7280" />
          <Tooltip
            cursor={{ fill: "#E5E7EB" }}
            formatter={(value) => [`${value} people`, "Count"]}
          />
          {/* Use custom BarCell to apply color defined in chartData */}
          <Bar dataKey="count" fill="#3B82F6" cell={<BarCell />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Component to dynamically set the bar color based on data payload
const BarCell = (props) => {
  const { x, y, width, height, payload } = props;
  return <rect x={x} y={y} width={width} height={height} fill={payload.fill} />;
};

// --- Main Component ---

export default function ReportPage() {
  const { room } = useContext(RoomContext);
  const { roomId } = useParams();
  const navigate = useNavigate();

  // State initialized from context, falls back to sessionStorage on reload
  const [reportData, setReportData] = useState(room.finalReport);

  // Memoize complex calculation for performance
  const derivedMetrics = useMemo(() => {
    return reportData ? calculateMetrics(reportData.metrics) : null;
  }, [reportData]);

  // Effect to handle data persistence and routing on page load/refresh
  useEffect(() => {
    if (!reportData) {
      const storedReport = sessionStorage.getItem("final_queue_report");
      if (storedReport) {
        const data = JSON.parse(storedReport);

        // Validate that the stored report matches the current route ID
        if (data.roomId === roomId) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setReportData(data);
        } else {
          // Stored report is for a different room, redirect
          navigate("/home");
        }
      } else {
        // No report data found in context or session storage
        navigate("/home");
      }
    }
  }, [roomId, reportData, navigate]);

  // Loading state fallback
  if (!reportData || !derivedMetrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading final report...</p>
      </div>
    );
  }

  const { metrics, queueName } = reportData;
  const durationMs = metrics.durationMs;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold  text-[#FF7A00]">
          Queue Service Report
        </h1>
        <h2 className="text-xl font-bold text-gray-800 mt-1">{queueName}</h2>
        <p className="text-gray-500 text-sm mt-1">
          Room ID: <b>{roomId}</b>
        </p>
        <p className="text-gray-500 text-sm">
          Report Generated: <b>{new Date(metrics.endTime).toLocaleString()}</b>
        </p>
      </header>

      <hr className="mb-8" />

      <section className="mb-10">
        <div className="flex  items-center text-2xl font-semibold text-gray-700 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width="40px"
            fill="#0D47A1"
          >
            <path d="m296-320 122-122 80 80 142-141v63h80v-200H520v80h63l-85 85-80-80-178 179 56 56Zm-96 200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
          </svg>
          <h3 className="pl-3">Key Performance Indicators</h3>
        </div>
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Active Duration"
            value={formatDuration(durationMs)}
            colorClass="text-[#FF7A00]"
          />
          <MetricCard
            title="Avg Wait Time (Served)"
            value={derivedMetrics.avgWaitServed}
            colorClass="text-green-600"
          />
          <MetricCard
            title="Avg Service Time"
            value={derivedMetrics.avgService}
            colorClass="text-blue-600"
          />
          <MetricCard
            title="Total People Served"
            value={derivedMetrics.totalServed}
            colorClass="text-gray-900"
          />
        </div>
      </section>

      <hr className="mb-8" />

      <section className="mb-10">
        <div className="flex items-center text-2xl font-semibold text-gray-700 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width="40px"
            fill="#0D47A1"
          >
            <path d="M160-480v240-480 240Zm400 360q17 0 28.5-11.5T600-160q0-17-11.5-28.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120Zm240-400q17 0 28.5-11.5T840-560q0-17-11.5-28.5T800-600q-17 0-28.5 11.5T760-560q0 17 11.5 28.5T800-520Zm-560 0h200v-80H240v80Zm0 160h200v-80H240v80Zm-80 200q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720H160v480h200v80H160ZM560-40q-50 0-85-35t-35-85q0-39 22.5-70t57.5-43v-127h240v-47q-35-12-57.5-43T680-560q0-50 35-85t85-35q50 0 85 35t35 85q0 39-22.5 70T840-447v127H600v47q35 12 57.5 43t22.5 70q0 50-35 85t-85 35Z" />
          </svg>
          <h3 className="pl-3">User Flow Summary</h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart Visualization Container */}
          <div className="bg-white p-4 rounded-xl shadow-lgs border border-gray-100 w-full lg:w-7/12">
            <UserFlowBarChart data={derivedMetrics} />
          </div>

          {/* Data Cards for Chart Data */}
          <div className="w-full lg:w-5/12 grid grid-cols-2 gap-4">
            <MetricCard
              title="Total Entered Queue"
              value={derivedMetrics.totalEntered}
              colorClass="text-blue-700"
            />
            <MetricCard
              title="Checked In (Served)"
              value={derivedMetrics.totalServed}
              colorClass="text-green-600"
            />
            <MetricCard
              title="Exited Early"
              value={derivedMetrics.totalExitedEarly}
              colorClass="text-red-600"
            />
            <MetricCard
              title="Waiting at Close"
              value={derivedMetrics.waitingAtClose}
              colorClass="text-yellow-600"
            />
          </div>
        </div>
      </section>

      <hr className="mb-8" />

      <footer className="mt-10 pt-6 border-t border-gray-200 flex justify-center">
        <button
          onClick={() => navigate("/home")}
          className=" px-6 py-3 bg-[#0D47A1] text-white font-semibold rounded-lg shadow-md hover:bg-[#0a3d8f] transition-colors"
        >
          Return to Home
        </button>
      </footer>
    </div>
  );
}
