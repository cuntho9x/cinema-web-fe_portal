import React, { useState, useEffect } from "react";
import "../styles/components/roomCreate.scss";

interface Room {
  name: string;
  type: string;
  rows: string;
  cols: string;
}

export default function RoomEditModal({ open, onClose, room }: { open: boolean; onClose: () => void; room: Room | null }) {
  const [form, setForm] = useState<Room>({ name: "", type: "", rows: "", cols: "" });

  useEffect(() => {
    if (room) setForm(room);
  }, [room]);

  if (!open || !room) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mock: gọi onClose luôn
    onClose();
  };

  return (
    <div className="room-create-modal-bg">
      <div className="room-create-modal">
        <div className="room-create-title">Cập nhật phòng chiếu</div>
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
          <button className="room-create-back-btn" type="button" onClick={onClose}>&lt; Quay lại</button>
        </form>
      </div>
    </div>
  );
} 