"use client";
import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/showtimeList.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import ShowtimeCreateModal from "@/components/ShowtimeCreateModal";
import ShowtimeEditModal, { ShowtimeEditing } from "@/components/ShowtimeEditModal";

const mockMovies = [
  {
    id: 1,
    name: "Furiosa: Câu Chuyện Từ Max Điên",
  },
  {
    id: 2,
    name: "Lật Mặt 7: Một Điều Ước",
  },
  {
    id: 3,
    name: "Mickey 17",
  },
  {
    id: 4,
    name: "Những Người Bạn Tưởng Tượng",
  },
  {
    id: 5,
    name: "Joker: Folie à Deux - Điên Có Đôi",
  },
  {
    id: 6,
    name: "Những Mảnh Ghép Cảm Xúc 2",
  },
  {
    id: 7,
    name: "Ngôi Đền Kỳ Quái 4",
  },
  {
    id: 8,
    name: "Garfield - Mèo Béo Siêu Quậy",
  },
  {
    id: 9,
    name: "Hành Tinh Khỉ: Vương Quốc Mới",
  },
  {
    id: 10,
    name: "Kẻ Thế Thân",
  },
];

const mockShowtimes = [
  { movie: "Mickey 17", time: "28-02-2025 - 23-03-2025", status: "Sắp chiếu" },
  { movie: "Joker: Folie à Deux - Điên Có Đôi", time: "04-10-2024 - 10-11-2024", status: "Sắp chiếu" },
  { movie: "Những Mảnh Ghép Cảm Xúc 2", time: "14-06-2024 - 28-07-2024", status: "Sắp chiếu" },
  { movie: "Garfield - Mèo Béo Siêu Quậy", time: "31-05-2024 - 30-06-2024", status: "Sắp chiếu" },
  { movie: "Ngôi Đền Kỳ Quái 4", time: "31-05-2024 - 23-06-2024", status: "Sắp chiếu" },
  { movie: "Hành Tinh Khỉ: Vương Quốc Mới", time: "24-05-2024 - 07-07-2024", status: "Sắp chiếu" },
  { movie: "Furiosa: Câu Chuyện Từ Max Điên", time: "17-05-2024 - 16-06-2024", status: "Sắp chiếu" },
  { movie: "Những Người Bạn Tưởng Tượng", time: "17-05-2024 - 16-06-2024", status: "Sắp chiếu" },
  { movie: "Kẻ Thế Thân", time: "03-05-2024 - 19-06-2024", status: "Đang chiếu" },
  { movie: "Lật Mặt 7: Một Điều Ước", time: "26-04-2024 - 02-06-2024", status: "Đang chiếu" },
];

function StatusTag({ status }: { status: string }) {
  return (
    <span className={
      status === "Đang chiếu"
        ? "showtime-status-tag now"
        : "showtime-status-tag upcoming"
    }>
      {status}
    </span>
  );
}

function getShowtimeStatus(start: string, end: string) {
  // start, end: dd-MM-yyyy
  const [ds, ms, ys] = start.split("-").map(Number);
  const [de, me, ye] = end.split("-").map(Number);
  const startDate = new Date(ys, ms - 1, ds, 0, 0, 0);
  const endDate = new Date(ye, me - 1, de, 23, 59, 59);
  const now = new Date();
  if (now < startDate) return "Sắp chiếu";
  if (now > endDate) return "Dừng chiếu";
  return "Đang chiếu";
}

export default function ShowtimeListPage() {
  const [page] = useState(1);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [showtimeEditing, setShowtimeEditing] = useState<ShowtimeEditing | null>(null);
  return (
    <div className="showtime-list-layout">
      <AdminSidebar />
      <main className="showtime-list-main">
        <div className="showtime-list-container">
          <div className="showtime-list-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Danh sách lịch chiếu</span>
          </div>
          <div className="showtime-list-action-bar">
            <button className="showtime-list-btn create" onClick={() => setOpenCreateModal(true)}>+ Tạo lịch chiếu</button>
            <button className="showtime-list-btn refresh">⟳ Refresh</button>
          </div>
          <div className="showtime-list-table-wrap">
            <table className="showtime-list-table">
              <thead>
                <tr>
                  <th>Phim chiếu</th>
                  <th>Thời gian chiếu</th>
                  <th>Phân loại</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mockShowtimes.map((item, idx) => {
                  const [start, end] = item.time.split(" - ");
                  const status = getShowtimeStatus(start, end);
                  const movieId = mockMovies.find(m => m.name === item.movie)?.id || 1;
                  return (
                    <tr key={idx}>
                      <td><Link href="#" className="showtime-movie-link">{item.movie}</Link></td>
                      <td>{item.time}</td>
                      <td><StatusTag status={status} /></td>
                      <td>
                        <button className="showtime-action-btn edit" title="Sửa" onClick={() => {
                          setShowtimeEditing({
                            movieId,
                            startDate: `${start.split("-").reverse().join("-")}`,
                            endDate: `${end.split("-").reverse().join("-")}`,
                          });
                          setOpenEditModal(true);
                        }}><FontAwesomeIcon icon={faPen} /></button>
                        <button className="showtime-action-btn delete" title="Xóa"><FontAwesomeIcon icon={faTrash} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="showtime-list-pagination">
            <button className="showtime-list-page-btn active">1</button>
            <button className="showtime-list-page-btn">2</button>
            <button className="showtime-list-page-btn">3</button>
            <span className="showtime-list-page-ellipsis">...</span>
            <button className="showtime-list-page-btn">5</button>
          </div>
        </div>
      </main>
      <ShowtimeCreateModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} movies={mockMovies} />
      <ShowtimeEditModal open={openEditModal} onClose={() => setOpenEditModal(false)} movies={mockMovies} showtime={showtimeEditing} />
    </div>
  );
} 