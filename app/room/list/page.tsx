'use client'

import React, { useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import "../../../styles/components/roomList.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faList, faPlus, faTableCellsLarge, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import SeatMapModal from "../../../components/SeatMapModal";
import RoomCreateModal from "../../../components/RoomCreateModal";
import RoomEditModal from "../../../components/RoomEditModal";

const cinemas = [
  { id: 1, name: "HCinema Aeon Hà Đông" },
  { id: 2, name: "CGV Vincom Bà Triệu" },
  { id: 3, name: "Lotte Cinema Landmark" },
];

const mockRooms = [
  { name: "Cinema 1", type: "Tiêu chuẩn", seats: 224, rows: "14 (A -> N)", cols: "16 (1 -> 16)", created: "01-04-2024", typeColor: "standard", cinemaId: 1 },
  { name: "GOLD CLASS", type: "GOLD CLASS", seats: 144, rows: "12 (A -> L)", cols: "12 (1 -> 12)", created: "01-04-2024", typeColor: "gold", cinemaId: 1 },
  { name: "Cinema 2", type: "Tiêu chuẩn", seats: 252, rows: "14 (A -> N)", cols: "18 (1 -> 18)", created: "01-04-2024", typeColor: "standard", cinemaId: 2 },
  { name: "IMAX", type: "IMAX", seats: 320, rows: "16 (A -> P)", cols: "20 (1 -> 20)", created: "01-04-2024", typeColor: "imax", cinemaId: 3 },
];

type RoomEditing = { name: string; type: string; rows: string; cols: string } | null;

function RoomTypeTag({ type }: { type: string }) {
  let className = "room-type-tag ";
  if (type === "GOLD CLASS") className += "gold";
  else if (type === "IMAX") className += "imax";
  else className += "standard";
  return <span className={className}>{type}</span>;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function RoomListPage() {
  const [selectedCinema, setSelectedCinema] = useState<number>(cinemas[0].id);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [roomEditing, setRoomEditing] = useState<RoomEditing>(null);
  const [openSeatMap, setOpenSeatMap] = useState(false);
  const filteredRooms = mockRooms.filter(r => r.cinemaId === selectedCinema);
  const selectedCinemaName = cinemas.find(c => c.id === selectedCinema)?.name || "";
  const router = useRouter();

  return (
    <div className="room-list-layout">
      <AdminSidebar />
      <main className="room-list-main">
        <div className="room-list-breadcrumb">
          <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
          <span className="breadcrumb-link">Dashboard</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-link">Danh sách rạp chiếu</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{selectedCinemaName}</span>
        </div>
        <div className="room-list-container">
          <div className="room-list-header">
            <select
              value={selectedCinema}
              onChange={e => setSelectedCinema(Number(e.target.value))}
              className="room-list-dropdown"
            >
              {cinemas.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <span className="room-list-title">Danh sách phòng chiếu</span>
            <button className="room-list-create-btn" onClick={() => setOpenCreateModal(true)}>
              <FontAwesomeIcon icon={faPlus} /> Tạo phòng chiếu
            </button>
          </div>
          <div className="room-list-table-wrap">
            <table className="room-list-table">
              <thead>
                <tr>
                  <th>Tên phòng chiếu</th>
                  <th>Loại phòng chiếu</th>
                  <th>Số lượng ghế (tối đa)</th>
                  <th>Số hàng</th>
                  <th>Số cột</th>
                  <th>Ngày tạo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room, idx) => (
                  <tr key={idx}>
                    <td>{room.name}</td>
                    <td><RoomTypeTag type={room.type} /></td>
                    <td>{room.seats}</td>
                    <td>{room.rows}</td>
                    <td>{room.cols}</td>
                    <td>{room.created}</td>
                    <td>
                      <button className="room-action-btn view" title="Xem sơ đồ" onClick={() => setOpenSeatMap(true)}><FontAwesomeIcon icon={faTableCellsLarge} /></button>
                      <button className="room-action-btn edit" title="Sửa" onClick={() => {
                        setRoomEditing({
                          name: room.name,
                          type: room.type,
                          rows: room.rows.split(" ")[0],
                          cols: room.cols.split(" ")[0],
                        });
                        setOpenEditModal(true);
                      }}><FontAwesomeIcon icon={faPen} /></button>
                      <button className="room-action-btn delete" title="Xóa"><FontAwesomeIcon icon={faTrash} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <RoomEditModal open={openEditModal} onClose={() => setOpenEditModal(false)} room={roomEditing} />
      <RoomCreateModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} cinemaName={selectedCinemaName} />
      <SeatMapModal open={openSeatMap} onClose={() => setOpenSeatMap(false)} />
    </div>
  );
} 