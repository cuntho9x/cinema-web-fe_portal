import React, { useState } from "react";
import "../styles/components/showtimeScheduleCreateModal.scss";

const mockMovies = [
  { id: 1, name: "Monkey Man Báo Thù", status: "Đang chiếu" },
  { id: 2, name: "Kẻ Thế Thân", status: "Sắp chiếu" },
  { id: 3, name: "Lật Mặt 7", status: "Đã chiếu" },
];
const formats = ["2D", "3D", "IMAX"];
const subtitles = ["Phụ đề", "Lồng tiếng"];

const statusColor: Record<string, string> = {
  "Đã chiếu": "shown",
  "Đang chiếu": "showing",
  "Sắp chiếu": "upcoming",
};

export default function ShowtimeScheduleCreateModal({ open, onClose, cinema, room, date }: {
  open: boolean;
  onClose: () => void;
  cinema: string;
  room: string;
  date: string;
}) {
  const [form, setForm] = useState({
    movieId: mockMovies[0].id,
    format: formats[0],
    subtitle: subtitles[0],
    start: "",
    end: "",
  });
  if (!open) return null;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };
  const selectedMovie = mockMovies.find(m => m.id === Number(form.movieId));
  return (
    <div className="showtime-schedule-create-modal-bg">
      <div className="showtime-schedule-create-modal">
        <button className="showtime-schedule-create-close" type="button" onClick={onClose}>×</button>
        <div className="showtime-schedule-create-title">
          Thêm suất chiếu ({cinema} - {room})
        </div>
        <form className="showtime-schedule-create-form" onSubmit={handleSubmit}>
          <label className="showtime-schedule-create-label">Phim chiếu</label>
          <div className="showtime-schedule-movie-select-wrap">
            <select
              className="showtime-schedule-create-input"
              name="movieId"
              value={form.movieId}
              onChange={handleChange}
            >
              {mockMovies.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            {selectedMovie && (
              <span className={`showtime-schedule-movie-status ${statusColor[selectedMovie.status]}`}>{selectedMovie.status}</span>
            )}
          </div>
          <label className="showtime-schedule-create-label">Ngày chiếu</label>
          <input
            className="showtime-schedule-create-input"
            type="date"
            value={date}
            disabled
          />
          <label className="showtime-schedule-create-label">Hình thức chiếu</label>
          <select
            className="showtime-schedule-create-input"
            name="format"
            value={form.format}
            onChange={handleChange}
          >
            {formats.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <label className="showtime-schedule-create-label">Hình thức dịch</label>
          <select
            className="showtime-schedule-create-input"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
          >
            {subtitles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <label className="showtime-schedule-create-label">Thời gian chiếu</label>
          <div className="showtime-schedule-time-range">
            <input
              className="showtime-schedule-create-input"
              type="time"
              name="start"
              value={form.start}
              onChange={handleChange}
              required
            />
            <span className="showtime-schedule-time-sep">--</span>
            <input
              className="showtime-schedule-create-input"
              type="time"
              name="end"
              value={form.end}
              onChange={handleChange}
              required
            />
          </div>
          <button className="showtime-schedule-create-btn" type="submit">Tạo suất chiếu</button>
        </form>
      </div>
    </div>
  );
} 