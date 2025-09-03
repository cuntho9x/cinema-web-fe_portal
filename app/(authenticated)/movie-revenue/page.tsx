"use client";
import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/movieRevenue.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const mockBarData = [
  { label: "SUGA | Agust D TOUR 'D-DAY' The Movie", value: 32, revenue: 8677300 },
  { label: "Kung Fu Panda 4", value: 11, revenue: 4282000 },
  { label: "Quý Cái", value: 26, revenue: 7791000 },
  { label: "Quật Mộ Trùng Ma", value: 8, revenue: 2671000 },
  { label: "Monkey Man Báo Thù", value: 23, revenue: 8118000 },
  { label: "Người Tình Quỷ Ám", value: 15, revenue: 5123000 },
  { label: "Hoa Quang", value: 17, revenue: 3890000 },
  { label: "Điều Hoa Mạc", value: 9, revenue: 2100000 },
  { label: "Cái Giá Của Hạnh Phúc", value: 12, revenue: 3120000 },
  { label: "Godzilla X Kong", value: 27, revenue: 9210000 },
  { label: "Biệt Đội Săn Ma", value: 29, revenue: 10123000 },
  { label: "Ngày Tàn Của Địa Cầu", value: 19, revenue: 6120000 },
  { label: "Điểm Báo Cuối Cùng", value: 31, revenue: 7890000 },
  { label: "Thanh Xuân Rực Rỡ", value: 14, revenue: 5230000 },
];

const mockTable = [
  { name: "SUGA | Agust D TOUR 'D-DAY' The Movie", tickets: 32, revenue: "8,677,300" },
  { name: "Kung Fu Panda 4", tickets: 11, revenue: "4,282,000" },
  { name: "Quý Cái", tickets: 26, revenue: "7,791,000" },
  { name: "Quật Mộ Trùng Ma", tickets: 8, revenue: "2,671,000" },
  { name: "Monkey Man Báo Thù", tickets: 23, revenue: "8,118,000" },
];

function BarChart({ data, color, label }: { data: { label: string; value: number }[]; color: string; label: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ width: "100%", height: 260, display: "flex", flexDirection: "column" }}>
      <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-end", height: 180, gap: 8, width: "100%", overflowX: "auto" }}>
        {data.map((d, i) => (
          <div key={i} style={{ textAlign: "center", flex: 1, minWidth: 40 }}>
            <div style={{ background: color, width: 24, height: `${(d.value / max) * 140}px`, borderRadius: 4, margin: "0 auto 6px auto" }} />
            <div style={{ fontSize: 11, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", maxWidth: 60 }}>{d.label.length > 14 ? d.label.slice(0, 14) + "..." : d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleTable({ columns, data }: { columns: string[]; data: any[] }) {
  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((cell, j) => (
              <td key={j}>{String(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function MovieRevenuePage() {
  const [dateFrom, setDateFrom] = useState("2024-04-01");
  const [dateTo, setDateTo] = useState("2024-05-15");
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fa" }}>
      <AdminSidebar />
      <main style={{ flex: 1, background: "#f6f8fa" }}>
        <div className="movie-revenue-container">
          <div className="movie-revenue-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Doanh thu theo phim</span>
          </div>
          <div className="movie-revenue-chart-box" style={{ marginBottom: 16 }}>
            <div className="movie-revenue-filter-bar">
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              <span style={{ color: "#888" }}>-</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
              <button className="movie-revenue-btn load">⟳ Load dữ liệu</button>
              <button className="movie-revenue-btn export">⭳ Xuất báo cáo</button>
            </div>
            <div className="movie-revenue-charts-row">
              <div className="movie-revenue-chart-box">
                <BarChart data={mockBarData.map(d => ({ label: d.label, value: d.value }))} color="#64b5f6" label="Số vé bán ra theo phim" />
              </div>
              <div className="movie-revenue-chart-box">
                <BarChart data={mockBarData.map(d => ({ label: d.label, value: d.revenue }))} color="#ffb6c1" label="Doanh thu theo phim" />
              </div>
            </div>
          </div>
          <div className="movie-revenue-table-section">
            <div>
              <SimpleTable columns={["Tên phim", "Tổng vé bán ra", "Tổng doanh thu"]} data={mockTable} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 