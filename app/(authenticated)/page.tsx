"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/home.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface DashboardStats {
  todayRevenue: number;
  monthlyRevenue: number;
  totalTicketsSold: number;
  newCustomers: number;
  revenueByMovie: { movie_id: number; movie_title: string; revenue: number; tickets: number }[];
  revenueByTheater: { theater_id: number; theater_name: string; revenue: number; tickets: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="dashboard-stat-box" style={{ borderColor: color }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
    </div>
  );
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: 180, gap: 16, padding: 16 }}>
      {data.map((d, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ background: "#90caf9", width: 32, height: `${(d.value / max) * 140}px`, borderRadius: 4, marginBottom: 8 }} />
          <div style={{ fontSize: 12 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data }: { data: { month: string; value: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
        Không có dữ liệu
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1); // Ensure max is at least 1 to avoid division by zero
  const chartWidth = Math.max(700, data.length * 60); // Dynamic width based on data length (min 700px)
  const chartHeight = 280;
  const padding = { top: 30, right: 30, bottom: 50, left: 70 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Calculate points for the line
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * graphWidth;
    const y = padding.top + graphHeight - (d.value / max) * graphHeight;
    return { x, y, value: d.value };
  });

  // Create area path for gradient fill
  const areaPath = points.length > 0 
    ? `M ${points[0].x} ${padding.top + graphHeight} ${points.map(p => `L ${p.x} ${p.y}`).join(" ")} L ${points[points.length - 1].x} ${padding.top + graphHeight} Z`
    : "";

  // Create line path
  const linePath = points.length > 0
    ? `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`
    : "";

  // Get month number (already a number string from backend)
  const getMonthNumber = (monthStr: string) => {
    return monthStr;
  };

  // Format value for Y-axis
  const formatYAxisValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  // Y-axis ticks
  const yAxisTicks = 5;
  const yTickValues = Array.from({ length: yAxisTicks }, (_, i) => {
    return (max / (yAxisTicks - 1)) * i;
  });

  return (
    <div style={{ padding: "10px 0", width: "100%", overflowX: "auto" }}>
      <svg width={chartWidth} height={chartHeight} style={{ display: "block", minWidth: "100%" }}>
        {/* Gradient definition */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#764ba2" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTickValues.map((tick, i) => {
          const y = padding.top + graphHeight - (tick / max) * graphHeight;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + graphWidth}
                y2={y}
                stroke="#e3e8ee"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                fontSize="11"
                fill="#666"
                textAnchor="end"
              >
                {formatYAxisValue(tick)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaPath && (
          <path
            d={areaPath}
            fill="url(#areaGradient)"
            opacity="0.6"
          />
        )}

        {/* Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data points and labels */}
        {points.map((point, i) => (
          <g key={i}>
            {/* Hover circle (larger, transparent) */}
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="#667eea"
              opacity="0.2"
            />
            {/* Main circle */}
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#667eea"
              stroke="#fff"
              strokeWidth="2"
            />
            {/* Value label above point - only show if value > 0 */}
            {point.value > 0 && (
              <text
                x={point.x}
                y={point.y - 12}
                fontSize="10"
                fill="#667eea"
                textAnchor="middle"
                fontWeight="600"
              >
                {formatYAxisValue(point.value)}
              </text>
            )}
            {/* Month label below - show all months */}
            <text
              x={point.x}
              y={chartHeight - padding.bottom + 20}
              fontSize="11"
              fill="#666"
              textAnchor="middle"
              fontWeight="500"
            >
              {getMonthNumber(data[i].month)}
            </text>
          </g>
        ))}

        {/* Axis lines */}
        <line
          x1={padding.left}
          y1={padding.top + graphHeight}
          x2={padding.left + graphWidth}
          y2={padding.top + graphHeight}
          stroke="#d1d5db"
          strokeWidth="2"
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + graphHeight}
          stroke="#d1d5db"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function SimpleTable({ columns, data }: { columns: string[]; data: any[] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} style={{ borderBottom: "1px solid #ddd", padding: 8, textAlign: "left", background: "#f5f5f5" }}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((cell, j) => (
              <td key={j} style={{ padding: 8, borderBottom: "1px solid #eee" }}>{String(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function HomeDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }
  
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.role !== "admin") {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      }
    };
  
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<DashboardStats>(
          `http://localhost:3000/order/dashboard/stats?month=${selectedMonth}&year=${selectedYear}`,
          { withCredentials: true }
        );
        setStats(response.data);
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.response?.data?.message || "Không thể tải thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedMonth, selectedYear]);
  

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getCurrentMonthLabel = () => {
    return `T${selectedMonth}/${selectedYear}`;
  };

  const getTodayLabel = () => {
    const today = new Date();
    return formatDate(today);
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div>Đang tải...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#f44336" }}>{error}</div>
        </main>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statsData = [
    { 
      label: `Doanh thu trong ngày (${getTodayLabel()})`, 
      value: `${formatCurrency(stats.todayRevenue)}đ`, 
      color: "#2196f3" 
    },
    { 
      label: `Khách hàng mới (${getCurrentMonthLabel()})`, 
      value: `${stats.newCustomers}`, 
      color: "#4caf50" 
    },
    { 
      label: `Tổng vé bán ra (${getCurrentMonthLabel()})`, 
      value: `${stats.totalTicketsSold}`, 
      color: "#ff9800" 
    },
    { 
      label: `Tổng doanh thu (${getCurrentMonthLabel()})`, 
      value: `${formatCurrency(stats.monthlyRevenue)}đ`, 
      color: "#f44336" 
    },
  ];

  const movieRevenueData = stats.revenueByMovie.slice(0, 10).map(m => ({
    name: m.movie_title,
    tickets: m.tickets,
    revenue: formatCurrency(m.revenue),
  }));

  const theaterRevenueData = stats.revenueByTheater.map(t => ({
    name: t.theater_name,
    tickets: t.tickets,
    revenue: formatCurrency(t.revenue),
  }));

  const lineChartData = stats.revenueByMonth.map(m => ({
    month: m.month,
    value: m.revenue,
  }));

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-current">Dashboard</span>
          </div>

          {/* Filter Bar */}
          <div className="dashboard-filter-bar">
            <label>
              Tháng: 
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="dashboard-filter-select"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            </label>
            <label>
              Năm: 
              <input 
                type="number" 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="dashboard-filter-input"
                min="2020"
                max="2100"
              />
            </label>
          </div>

          <div className="dashboard-stats">
            {statsData.map((stat, i) => (
              <StatBox key={i} {...stat} />
            ))}
          </div>
          <div className="dashboard-charts">
            <div>
              <div className="dashboard-table-title">Doanh thu theo tháng (12 tháng gần nhất)</div>
              <div className="dashboard-chart-container">
                <LineChart data={lineChartData} />
              </div>
            </div>
          </div>
          <div className="dashboard-table-section">
            <div>
              <div className="dashboard-table-title">Doanh thu theo phim ({getCurrentMonthLabel()})</div>
              <SimpleTable 
                columns={["Tên phim", "Tổng vé bán ra", "Tổng doanh thu"]} 
                data={movieRevenueData} 
              />
            </div>
            <div>
              <div className="dashboard-table-title">Doanh thu theo rạp ({getCurrentMonthLabel()})</div>
              <SimpleTable 
                columns={["Rạp chiếu", "Tổng vé bán ra", "Tổng doanh thu"]} 
                data={theaterRevenueData} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 