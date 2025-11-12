import React, { useState } from "react";
import "../styles/components/roomCreate.scss";
import axios from "axios";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function RoomCreateModal({ 
  open, 
  onClose, 
  cinemaName,
  theaterSlug,
  onSuccess
}: { 
  open: boolean; 
  onClose: () => void; 
  cinemaName: string;
  theaterSlug: string;
  onSuccess?: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    rows: "",
    cols: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.type || !form.rows || !form.cols) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!theaterSlug) {
      alert('Không tìm thấy thông tin rạp chiếu');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const roomSlug = slugify(form.name);
      const roomTypeMap: { [key: string]: string } = {
        "Tiêu chuẩn": "TWO_D",
        "2D": "TWO_D",
        "3D": "THREE_D",
        "IMAX": "IMAX",
      };

      const createData = {
        room_name: form.name,
        room_slug: roomSlug,
        room_type: roomTypeMap[form.type] || form.type,
        row: parseInt(form.rows),
        column: parseInt(form.cols),
      };

      await axios.post(`http://localhost:3000/theaters/${theaterSlug}/rooms`, createData, {
        withCredentials: true,
      });

      alert("Tạo phòng chiếu thành công!");
      setForm({ name: "", type: "", rows: "", cols: "" });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Error creating room:", err);
      setError(err.response?.data?.message || "Không thể tạo phòng chiếu");
      alert(err.response?.data?.message || "Không thể tạo phòng chiếu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="room-create-modal-bg" onClick={handleBgClick}>
      <div className="room-create-modal" onClick={(e) => e.stopPropagation()}>
        <button className="room-create-close" type="button" onClick={onClose}>×</button>
        <div className="room-create-title">
          Tạo phòng chiếu cho rạp: <span className="room-create-title-cinema">{cinemaName}</span>
        </div>
        {error && (
          <div className="room-create-error">
            {error}
          </div>
        )}
        <form className="room-create-form" onSubmit={handleSubmit}>
          <label className="room-create-label required">Tên phòng chiếu</label>
          <input 
            className="room-create-input" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Nhập tên phòng chiếu"
            required
          />

          <label className="room-create-label required">Loại phòng chiếu</label>
          <select 
            className="room-create-input" 
            name="type" 
            value={form.type} 
            onChange={handleChange}
            required
          >
            <option value="">Chọn loại phòng</option>
            <option value="TWO_D">2D</option>
            <option value="THREE_D">3D</option>
            <option value="IMAX">IMAX</option>
          </select>

          <label className="room-create-label required">Số hàng</label>
          <input 
            className="room-create-input" 
            name="rows" 
            value={form.rows} 
            onChange={handleChange} 
            placeholder="Nhập số hàng" 
            type="number" 
            min={1}
            required
          />

          <label className="room-create-label required">Số cột</label>
          <input 
            className="room-create-input" 
            name="cols" 
            value={form.cols} 
            onChange={handleChange} 
            placeholder="Nhập số cột" 
            type="number" 
            min={1}
            required
          />

          <button 
            className="room-create-btn" 
            type="submit"
            disabled={saving}
          >
            {saving ? "Đang tạo..." : "Lưu"}
          </button>
        </form>
      </div>
    </div>
  );
}
