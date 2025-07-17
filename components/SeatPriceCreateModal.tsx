import React, { useState } from "react";
import "../styles/components/seatPriceCreateModal.scss";

export default function SeatPriceCreateModal({ open, onClose, onCreate }: {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: any) => void;
}) {
  const [seatTypes, setSeatTypes] = useState([
    { key: 0, label: "Ghế thường", color: "#7c4dff" },
    { key: 1, label: "Ghế VIP", color: "#f44336" },
    { key: 2, label: "Ghế COUPLE", color: "#e040fb" },
    { key: 3, label: "Không khả dụng", color: "#222" },
  ]);
  const [roomTypes, setRoomTypes] = useState([
    { key: "standard", label: "Tiêu chuẩn", factor: 1 },
    { key: "gold", label: "Gold Class", factor: 1.2 },
    { key: "imax", label: "IMAX", factor: 1.5 },
  ]);
  const [showTypes, setShowTypes] = useState([
    { key: "2d", label: "2D", factor: 1 },
    { key: "3d", label: "3D", factor: 1.3 },
    { key: "imax", label: "IMAX", factor: 1.5 },
  ]);
  const [form, setForm] = useState({
    seatType: 0,
    basePrice: 60000,
    showType: "2d",
    roomType: "standard",
  });
  // State cho thêm mới
  const [newSeatType, setNewSeatType] = useState("");
  const [newShowType, setNewShowType] = useState("");
  const [newRoomType, setNewRoomType] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value }));
  };
  const getFinalPrice = () => {
    const room = roomTypes.find(r => r.key === form.roomType) || roomTypes[0];
    const show = showTypes.find(s => s.key === form.showType) || showTypes[0];
    return Math.round(form.basePrice * room.factor * show.factor);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreate) onCreate(form);
    onClose();
  };
  // Thêm loại ghế mới
  const handleAddSeatType = () => {
    if (!newSeatType.trim()) return;
    const newKey = Date.now();
    setSeatTypes(list => [...list, { key: newKey, label: newSeatType, color: "#888" }]);
    setForm(f => ({ ...f, seatType: newKey }));
    setNewSeatType("");
  };
  // Thêm hình thức chiếu mới
  const handleAddShowType = () => {
    if (!newShowType.trim()) return;
    const newKey = newShowType.toLowerCase().replace(/\s+/g, "_") + Date.now();
    setShowTypes(list => [...list, { key: newKey, label: newShowType, factor: 1 }]);
    setForm(f => ({ ...f, showType: newKey }));
    setNewShowType("");
  };
  // Thêm loại phòng mới
  const handleAddRoomType = () => {
    if (!newRoomType.trim()) return;
    const newKey = newRoomType.toLowerCase().replace(/\s+/g, "_") + Date.now();
    setRoomTypes(list => [...list, { key: newKey, label: newRoomType, factor: 1 }]);
    setForm(f => ({ ...f, roomType: newKey }));
    setNewRoomType("");
  };
  if (!open) return null;
  return (
    <div className="seat-price-create-modal-bg">
      <div className="seat-price-create-modal">
        <button className="seat-price-create-close" type="button" onClick={onClose}>×</button>
        <div className="seat-price-create-title">Tạo giá vé mới</div>
        <form className="seat-price-create-form" onSubmit={handleSubmit}>
          <label className="seat-price-create-label">Loại ghế</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="seat-price-create-input" name="seatType" value={form.seatType} onChange={handleChange}>
              {seatTypes.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <input className="seat-price-create-input" style={{ flex: 1 }} placeholder="Thêm loại ghế mới" value={newSeatType} onChange={e => setNewSeatType(e.target.value)} />
            <button type="button" className="seat-price-create-btn" style={{ padding: '0 12px', minWidth: 0 }} onClick={handleAddSeatType}>+</button>
          </div>
          <label className="seat-price-create-label">Giá cơ bản (VNĐ)</label>
          <input className="seat-price-create-input" type="number" name="basePrice" min={0} value={form.basePrice} onChange={handleChange} />
          <label className="seat-price-create-label">Hình thức chiếu</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="seat-price-create-input" name="showType" value={form.showType} onChange={handleChange}>
              {showTypes.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <input className="seat-price-create-input" style={{ flex: 1 }} placeholder="Thêm hình thức mới" value={newShowType} onChange={e => setNewShowType(e.target.value)} />
            <button type="button" className="seat-price-create-btn" style={{ padding: '0 12px', minWidth: 0 }} onClick={handleAddShowType}>+</button>
          </div>
          <label className="seat-price-create-label">Loại phòng chiếu</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="seat-price-create-input" name="roomType" value={form.roomType} onChange={handleChange}>
              {roomTypes.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
            <input className="seat-price-create-input" style={{ flex: 1 }} placeholder="Thêm loại phòng mới" value={newRoomType} onChange={e => setNewRoomType(e.target.value)} />
            <button type="button" className="seat-price-create-btn" style={{ padding: '0 12px', minWidth: 0 }} onClick={handleAddRoomType}>+</button>
          </div>
          <div className="seat-price-create-final">
            <span>Giá cuối cùng:</span>
            <span className="seat-price-create-final-value">{getFinalPrice().toLocaleString()} VNĐ</span>
          </div>
          <button className="seat-price-create-btn" type="submit">Tạo giá vé</button>
        </form>
      </div>
    </div>
  );
} 