"use client";
import React from "react";
import AdminSidebar from "../../components/AdminSidebar";
import "../../styles/components/home.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const mockStats = [
  { label: "Doanh thu trong ngày (15/5/2025)", value: "760,000", color: "#2196f3" },
  { label: "Khách hàng mới (T5/2025)", value: "0", color: "#4caf50" },
  { label: "Tổng vé bán ra (T5/2025)", value: "9", color: "#ff9800" },
  { label: "Tổng doanh thu (T5/2025)", value: "1,826,000", color: "#f44336" },
];

const mockBarData = [
  { label: "Điểm mặt L...", value: 22 },
  { label: "Chị Chị Em...", value: 15 },
  { label: "15 phim bộ...", value: 13 },
  { label: "Top 10 phim...", value: 12 },
  { label: "13 phim lẻ...", value: 11 },
];

const mockLineData = [
  { month: "1/2025", value: 0 },
  { month: "2/2025", value: 0 },
  { month: "3/2025", value: 0 },
  { month: "4/2025", value: 90000000 },
  { month: "5/2025", value: 0 },
];

const mockMovieRevenue = [
  { name: "Monkey Man Báo Thù", tickets: 5, revenue: "1,066,000" },
  { name: "Cái Giá Của Hạnh Phúc", tickets: 4, revenue: "760,000" },
];

const mockCinemaRevenue = [
  { name: "HCinema Aeon Hà Đông", tickets: 9, revenue: "1,826,000" },
];

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
  // Simple SVG line chart
  const max = Math.max(...data.map((d) => d.value));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 320;
    const y = 160 - (d.value / max) * 140;
    return `${x},${y}`;
  });
  return (
    <svg width={340} height={180} style={{ background: "#fff0f6", borderRadius: 8, margin: 16 }}>
      <polyline
        fill="none"
        stroke="#e91e63"
        strokeWidth="3"
        points={points.join(" ")}
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * 320;
        const y = 160 - (d.value / max) * 140;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={4} fill="#e91e63" />
            <text x={x} y={170} fontSize={12} textAnchor="middle">{d.month}</text>
          </g>
        );
      })}
    </svg>
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
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fa" }}>
      <AdminSidebar />
      <main style={{ flex: 1, background: "#f6f8fa" }}>
        <div className="dashboard-container">
          <div className="dashboard-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-current">Dashboard</span>
          </div>
          <div className="dashboard-stats">
            {mockStats.map((stat, i) => (
              <StatBox key={i} {...stat} />
            ))}
          </div>
          <div className="dashboard-charts">
            <div>
              <div className="dashboard-table-title">Top bài viết được xem nhiều nhất</div>
              <BarChart data={mockBarData} />
            </div>
            <div>
              <div className="dashboard-table-title">Doanh thu theo tháng</div>
              <LineChart data={mockLineData} />
            </div>
          </div>
          <div className="dashboard-table-section">
            <div>
              <div className="dashboard-table-title">Doanh thu theo phim <span className="dashboard-link">Xem tất cả</span></div>
              <SimpleTable columns={["Tên phim", "Tổng vé bán ra", "Tổng doanh thu"]} data={mockMovieRevenue} />
            </div>
            <div>
              <div className="dashboard-table-title">Doanh thu theo rạp <span className="dashboard-link">Xem tất cả</span></div>
              <SimpleTable columns={["Rạp chiếu", "Tổng vé bán ra", "Tổng doanh thu"]} data={mockCinemaRevenue} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 