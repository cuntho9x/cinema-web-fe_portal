import React, { useState } from "react";
import "../styles/components/roomCreate.scss";

export default function RoomCreateModal({ open, onClose, cinemaName }: { open: boolean; onClose: () => void; cinemaName: string }) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    rows: "",
    cols: "",
  });

  if (!open) return null;

  // Đóng modal khi click ra ngoài
  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mock: gọi onClose luôn
    onClose();
  };

  return (
    <div className="room-create-modal-bg" onClick={handleBgClick}>
      <div className="room-create-modal" onClick={e => e.stopPropagation()}>
        <button className="room-create-close" type="button" onClick={onClose}>×</button>
        <div className="room-create-title">Tạo phòng chiếu cho rạp: <span style={{ color: '#2196f3' }}>{cinemaName}</span></div>
        <form className="room-create-form" onSubmit={handleSubmit}>
          <label className="room-create-label">Tên phòng chiếu</label>
          <input className="room-create-input" name="name" value={form.name} onChange={handleChange} placeholder="Nhập tên phòng chiếu" />

          <label className="room-create-label">Loại phòng chiếu</label>
          <select className="room-create-input" name="type" value={form.type} onChange={handleChange}>
            <option value="">Chọn loại phòng</option>
            <option value="Tiêu chuẩn">Tiêu chuẩn</option>
            <option value="GOLD CLASS">GOLD CLASS</option>
            <option value="IMAX">IMAX</option>
          </select>

          <label className="room-create-label">Số hàng</label>
          <input className="room-create-input" name="rows" value={form.rows} onChange={handleChange} placeholder="Nhập số hàng" type="number" min={1} />

          <label className="room-create-label">Số cột</label>
          <input className="room-create-input" name="cols" value={form.cols} onChange={handleChange} placeholder="Nhập số cột" type="number" min={1} />

          <button className="room-create-btn" type="submit">Lưu</button>
        </form>
      </div>
    </div>
  );
} 