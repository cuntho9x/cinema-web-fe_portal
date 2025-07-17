import React, { useState } from "react";
import "../styles/components/showtimeList.scss";

export default function ShowtimeCreateModal({ open, onClose, movies }: { open: boolean; onClose: () => void; movies: { id: number; name: string }[] }) {
  const [form, setForm] = useState({
    movieId: movies[0]?.id || 1,
    startDate: "",
    endDate: "",
  });

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mock: gọi onClose luôn
    onClose();
  };

  // Đóng modal khi click ra ngoài
  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="showtime-create-modal-bg" onClick={handleBgClick}>
      <div className="showtime-create-modal" onClick={e => e.stopPropagation()}>
        <button className="showtime-create-close" type="button" onClick={onClose}>×</button>
        <div className="showtime-create-title">Tạo lịch chiếu mới</div>
        <form className="showtime-create-form" onSubmit={handleSubmit}>
          <label className="showtime-create-label">Chọn phim</label>
          <select className="showtime-create-input" name="movieId" value={form.movieId} onChange={handleChange}>
            {movies.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <label className="showtime-create-label">Ngày bắt đầu</label>
          <input className="showtime-create-input" name="startDate" value={form.startDate} onChange={handleChange} type="date" />

          <label className="showtime-create-label">Ngày kết thúc</label>
          <input className="showtime-create-input" name="endDate" value={form.endDate} onChange={handleChange} type="date" />

          <button className="showtime-create-btn" type="submit">Lưu</button>
        </form>
      </div>
    </div>
  );
} 