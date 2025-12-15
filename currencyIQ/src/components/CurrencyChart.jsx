import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { CURRENCY_API_BASE } from "../config";
// Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const CurrencyChart = ({ from, to }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  /* --- DATA FETCHING --- */
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);

      // Calculate date range (Today - Days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const format = (d) => d.toISOString().split("T")[0];

      try {
        const res = await fetch(
          `${CURRENCY_API_BASE}/${format(startDate)}..${format(
            endDate
          )}?from=${from}&to=${to}`
        );
        const data = await res.json();

        if (data.rates) {
          const labels = Object.keys(data.rates);
          const rates = labels.map((date) => data.rates[date][to]);

          // Format response for Chart.js
          setChartData({
            labels,
            datasets: [
              {
                fill: true,
                label: `${from} to ${to}`,
                data: rates,
                borderColor: "#818cf8",
                backgroundColor: (context) => {
                  const ctx = context.chart.ctx;
                  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                  gradient.addColorStop(0, "rgba(129, 140, 248, 0.4)");
                  gradient.addColorStop(1, "rgba(129, 140, 248, 0.0)");
                  return gradient;
                },
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 6,
                borderWidth: 2,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Chart Error", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => fetchHistory(), 300);
    return () => clearTimeout(timer);
  }, [from, to, days]);

  // Chart visual configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { display: false },
      y: {
        grid: { color: "#334155", borderDash: [5, 5] },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  return (
    <div className="w-full bg-slate-800/40 p-5 md:p-6 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="text-slate-200 font-bold text-lg">Market Trend</h3>
        </div>
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
          {[
            { label: "1W", val: 7 },
            { label: "1M", val: 30 },
            { label: "3M", val: 90 },
            { label: "1Y", val: 365 },
          ].map((tf) => (
            <button
              key={tf.label}
              onClick={() => setDays(tf.val)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                days === tf.val
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48 sm:h-64 w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col justify-end gap-2 animate-pulse">
            <div className="h-1/3 bg-slate-700/30 w-full rounded-t"></div>
            <div className="h-2/3 bg-slate-700/20 w-full rounded-t"></div>
          </div>
        ) : chartData ? (
          <Line options={options} data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Chart Unavailable
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyChart;
