"use client";
import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/showtimeSchedule.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import ShowtimeScheduleCreateModal from "@/components/ShowtimeScheduleCreateModal";

const cinemas = [
  { id: 1, name: "HCinema Aeon Hà Đông" },
  { id: 2, name: "CGV Vincom Bà Triệu" },
  { id: 3, name: "Lotte Cinema Landmark" },
];
const rooms = [
  { id: 1, name: "Cinema 1", cinemaId: 1 },
  { id: 2, name: "GOLD CLASS", cinemaId: 1 },
  { id: 3, name: "Cinema 2", cinemaId: 2 },
  { id: 4, name: "IMAX", cinemaId: 3 },
];
const showtimes = [
  { id: 1, movie: "Tà Khúc Triệu Vong", format: "2D", subtitle: "Phụ đề", time: "08:00 - 09:45", type: "Theo lịch", status: "Đã chiếu", roomId: 1 },
  { id: 2, movie: "Kẻ Thế Thân", format: "2D", subtitle: "Phụ đề", time: "10:15 - 12:10", type: "Theo lịch", status: "Đang chiếu", roomId: 1 },
  { id: 3, movie: "Người 'Bạn' Trong Tưởng Tượng", format: "2D", subtitle: "Phụ đề", time: "12:40 - 14:35", type: "Theo lịch", status: "Sắp chiếu", roomId: 1 },
  { id: 4, movie: "Lật Mặt 7: Một Điều Ước", format: "2D", subtitle: "Phụ đề", time: "15:05 - 17:15", type: "Theo lịch", status: "Sắp chiếu", roomId: 1 },
  { id: 5, movie: "Cái Giá Của Hạnh Phúc", format: "2D", subtitle: "Phụ đề", time: "17:45 - 20:00", type: "Theo lịch", status: "Sắp chiếu", roomId: 1 },
  { id: 6, movie: "Vây Hãm: Kẻ Trừng Phạt", format: "2D", subtitle: "Phụ đề", time: "20:30 - 22:20", type: "Theo lịch", status: "Sắp chiếu", roomId: 1 },
  { id: 7, movie: "Người 'Bạn' Trong Tưởng Tượng", format: "2D", subtitle: "Phụ đề", time: "22:50 - 00:45", type: "Theo lịch", status: "Sắp chiếu", roomId: 1 },
];

const statusColor: Record<string, string> = {
  "Đã chiếu": "shown",
  "Đang chiếu": "showing",
  "Sắp chiếu": "upcoming",
};

export default function ShowtimeSchedulePage() {
  const [selectedCinema, setSelectedCinema] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(1);
  const [date, setDate] = useState("2024-05-16");
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const filteredRooms = rooms.filter(r => r.cinemaId === selectedCinema);
  const filteredShowtimes = showtimes.filter(s => s.roomId === selectedRoom);
  const cinemaName = cinemas.find(c => c.id === selectedCinema)?.name || "";
  const roomName = filteredRooms.find(r => r.id === selectedRoom)?.name || "";

  return (
    <div className="showtime-schedule-layout">
      <AdminSidebar />
      <main className="showtime-schedule-main">
        <div className="showtime-schedule-container">
          <div className="showtime-schedule-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Danh sách suất chiếu</span>
          </div>
          <div className="showtime-schedule-filter-bar">
            <label>Rạp chiếu:</label>
            <select value={selectedCinema} onChange={e => {
              setSelectedCinema(Number(e.target.value));
              setSelectedRoom(rooms.find(r => r.cinemaId === Number(e.target.value))?.id || 1);
            }}>
              {cinemas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label>Phòng chiếu:</label>
            <select value={selectedRoom} onChange={e => setSelectedRoom(Number(e.target.value))}>
              {filteredRooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <label>Ngày chiếu:</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <button className="showtime-schedule-search-btn">Tìm kiếm</button>
          </div>
          <div className="showtime-schedule-date-bar">
            <span>Lịch chiếu ngày: <b>{date.split("-").reverse().join("-")}</b></span>
            <span className="showtime-schedule-cinema">Rạp: {cinemas.find(c => c.id === selectedCinema)?.name}</span>
          </div>
          <div className="showtime-schedule-table-wrap">
            <table className="showtime-schedule-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Phim chiếu</th>
                  <th>Hình thức chiếu</th>
                  <th>Hình thức dịch</th>
                  <th>Thời gian chiếu</th>
                  <th>Loại suất chiếu</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredShowtimes.map(s => (
                  <tr key={s.id}>
                    <td><span className="showtime-schedule-row-icon">≡</span></td>
                    <td><span className="showtime-schedule-movie-link">{s.movie}</span></td>
                    <td><span className="showtime-schedule-format">{s.format}</span></td>
                    <td><span className="showtime-schedule-subtitle subtitle-green">{s.subtitle}</span></td>
                    <td><span className="showtime-schedule-time time-orange">{s.time}</span></td>
                    <td><span className="showtime-schedule-type type-green">{s.type}</span></td>
                    <td><span className={`showtime-schedule-status ${statusColor[s.status]}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="showtime-schedule-create-btn" onClick={() => setOpenCreateModal(true)}>
            + Thêm lịch chiếu
          </button>
        </div>
        <ShowtimeScheduleCreateModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          cinema={cinemaName}
          room={roomName}
          date={date}
        />
      </main>
    </div>
  );
} 