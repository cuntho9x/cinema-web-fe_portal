"use client";
import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/seatPrice.scss";
import SeatPriceCreateModal from "@/components/SeatPriceCreateModal";

const seatTypes = [
  { key: 0, label: "Ghế thường", color: "#7c4dff" },
  { key: 1, label: "Ghế VIP", color: "#f44336" },
  { key: 2, label: "Ghế COUPLE", color: "#e040fb" },
  { key: 3, label: "Không khả dụng", color: "#222" },
];
const defaultRoomTypes = [
  { key: "standard", label: "Tiêu chuẩn", factor: 1 },
  { key: "gold", label: "Gold Class", factor: 1.2 },
  { key: "imax", label: "IMAX", factor: 1.5 },
];
const defaultShowTypes = [
  { key: "2d", label: "2D", factor: 1 },
  { key: "3d", label: "3D", factor: 1.3 },
  { key: "imax", label: "IMAX", factor: 1.5 },
];

export default function SeatPricePage() {
  const [basePrices, setBasePrices] = useState([60000, 90000, 120000, 0]);
  const [showTypes, setShowTypes] = useState(defaultShowTypes);
  const [roomTypes, setRoomTypes] = useState(defaultRoomTypes);
  const [selectedShowType, setSelectedShowType] = useState("2d");
  const [selectedRoomType, setSelectedRoomType] = useState("standard");
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleBasePriceChange = (idx: number, value: string) => {
    const v = parseInt(value.replace(/\D/g, ""), 10) || 0;
    setBasePrices(prices => prices.map((p, i) => (i === idx ? v : p)));
  };

  const getFinalPrice = (base: number) => {
    const room = roomTypes.find(r => r.key === selectedRoomType) || roomTypes[0];
    const show = showTypes.find(s => s.key === selectedShowType) || showTypes[0];
    return Math.round(base * room.factor * show.factor);
  };

  const handleCreatePrice = (data: any) => {
    // Nếu là showType mới thì thêm vào danh sách filter bar
    if (!showTypes.some(s => s.key === data.showType)) {
      setShowTypes(list => [...list, { key: data.showType, label: data.showType, factor: 1 }]);
      setSelectedShowType(data.showType);
    }
    // Nếu là roomType mới thì thêm vào danh sách filter bar
    if (!roomTypes.some(r => r.key === data.roomType)) {
      setRoomTypes(list => [...list, { key: data.roomType, label: data.roomType, factor: 1 }]);
      setSelectedRoomType(data.roomType);
    }
    // mock: log ra console
    console.log("Tạo giá vé mới:", data);
  };

  return (
    <div className="seat-price-layout">
      <AdminSidebar />
      <main className="seat-price-main">
        <div className="seat-price-container">
          <div className="seat-price-breadcrumb">
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Cấu hình giá ghế</span>
          </div>
          <h2 className="seat-price-title">Bảng giá các loại ghế</h2>
          <button className="seat-price-create-btn" onClick={() => setOpenCreateModal(true)}>+ Tạo giá vé mới</button>
          <div className="seat-price-filter-bar">
            <label>Hình thức chiếu:</label>
            <select value={selectedShowType} onChange={e => setSelectedShowType(e.target.value)}>
              {showTypes.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <label>Loại phòng chiếu:</label>
            <select value={selectedRoomType} onChange={e => setSelectedRoomType(e.target.value)}>
              {roomTypes.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>
          <table className="seat-price-table">
            <thead>
              <tr>
                <th>Loại ghế</th>
                <th>Màu</th>
                <th>Giá cơ bản (VNĐ)</th>
                <th>Hình thức chiếu</th>
                <th>Loại phòng chiếu</th>
                <th>Giá cuối cùng</th>
              </tr>
            </thead>
            <tbody>
              {seatTypes.map((type, idx) => (
                <tr key={type.key}>
                  <td>{type.label}</td>
                  <td><span style={{ display: 'inline-block', width: 28, height: 18, borderRadius: 6, background: type.color }}></span></td>
                  <td>
                    <input
                      className="seat-price-input"
                      type="number"
                      min={0}
                      value={basePrices[idx]}
                      onChange={e => handleBasePriceChange(idx, e.target.value)}
                      disabled={type.key === 3}
                    />
                  </td>
                  <td>{showTypes.find(s => s.key === selectedShowType)?.label}</td>
                  <td>{roomTypes.find(r => r.key === selectedRoomType)?.label}</td>
                  <td style={{ fontWeight: 600, color: '#2196f3' }}>
                    {type.key === 3 ? '-' : getFinalPrice(basePrices[idx]).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SeatPriceCreateModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onCreate={handleCreatePrice}
        />
      </main>
    </div>
  );
} 