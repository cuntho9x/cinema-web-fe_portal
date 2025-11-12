'use client'

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/roomList.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faList, faPlus, faTableCellsLarge, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import SeatMapModal from "@/components/SeatMapModal";
import RoomCreateModal from "@/components/RoomCreateModal";
import RoomEditModal from "@/components/RoomEditModal";
import axios from "axios";

interface Theater {
  theater_id: number;
  theater_name: string;
  theater_title_url: string;
}

interface Room {
  room_id: number;
  room_name: string;
  room_slug: string;
  room_type: string;
  row: number;
  column: number;
  theater_id: number;
}

type RoomEditing = { 
  name: string; 
  type: string; 
  rows: string; 
  cols: string;
  roomId?: number;
  roomSlug?: string;
  theaterSlug?: string;
} | null;

function RoomTypeTag({ type }: { type: string }) {
  let className = "room-type-tag ";
  if (type === "IMAX") className += "imax";
  else if (type === "THREE_D") className += "gold";
  else className += "standard";
  
  const typeMap: { [key: string]: string } = {
    TWO_D: "2D",
    THREE_D: "3D",
    IMAX: "IMAX",
  };
  
  return <span className={className}>{typeMap[type] || type}</span>;
}

export default function RoomListPage() {
  const router = useRouter();
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [roomEditing, setRoomEditing] = useState<RoomEditing>(null);
  const [openSeatMap, setOpenSeatMap] = useState(false);
  const [selectedRoomForSeatMap, setSelectedRoomForSeatMap] = useState<{ theaterSlug: string; roomSlug: string; roomName: string; rows: number; cols: number } | null>(null);

  // Fetch theaters
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/theaters", {
          withCredentials: true,
        });
        setTheaters(response.data);
        if (response.data.length > 0) {
          setSelectedTheaterId(response.data[0].theater_id);
        }
      } catch (err) {
        console.error("Error fetching theaters:", err);
        setError("Không thể tải danh sách rạp chiếu");
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  // Fetch rooms when theater is selected
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedTheaterId) {
        setRooms([]);
        return;
      }

      try {
        setRoomsLoading(true);
        const response = await axios.get(`http://localhost:3000/rooms/theater/${selectedTheaterId}`, {
          withCredentials: true,
        });
        setRooms(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching rooms:", err);
        if (err.response?.status === 404) {
          setRooms([]);
          setError(null);
        } else {
          setError("Không thể tải danh sách phòng chiếu");
        }
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, [selectedTheaterId]);

  const selectedTheater = theaters.find(t => t.theater_id === selectedTheaterId);
  const selectedTheaterName = selectedTheater?.theater_name || "";
  const selectedTheaterSlug = selectedTheater?.theater_title_url || "";

  const handleRefresh = () => {
    if (selectedTheaterId) {
      const fetchRooms = async () => {
        try {
          setRoomsLoading(true);
          const response = await axios.get(`http://localhost:3000/rooms/theater/${selectedTheaterId}`, {
            withCredentials: true,
          });
          setRooms(response.data);
          setError(null);
        } catch (err: any) {
          console.error("Error fetching rooms:", err);
          setError("Không thể tải danh sách phòng chiếu");
        } finally {
          setRoomsLoading(false);
        }
      };
      fetchRooms();
    }
  };

  const handleDelete = async (room: Room) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa phòng ${room.room_name}?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/theaters/${selectedTheaterSlug}/rooms/${room.room_slug}`, {
        withCredentials: true,
      });
      alert("Xóa phòng thành công!");
      handleRefresh();
    } catch (err: any) {
      console.error("Error deleting room:", err);
      alert(err.response?.data?.message || "Không thể xóa phòng");
    }
  };

  if (loading) {
    return (
      <div className="room-list-layout">
        <AdminSidebar />
        <main className="room-list-main">
          <div className="room-list-container">
            <div className="room-list-loading">Đang tải...</div>
          </div>
        </main>
      </div>
    );
  }

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
          <span className="breadcrumb-current">{selectedTheaterName || "Danh sách phòng chiếu"}</span>
        </div>
        <div className="room-list-container">
          <div className="room-list-header">
            <select
              value={selectedTheaterId || ""}
              onChange={e => setSelectedTheaterId(Number(e.target.value))}
              className="room-list-dropdown"
            >
              <option value="">-- Chọn rạp chiếu --</option>
              {theaters.map(theater => (
                <option key={theater.theater_id} value={theater.theater_id}>
                  {theater.theater_name}
                </option>
              ))}
            </select>
            <span className="room-list-title">Danh sách phòng chiếu</span>
            <button 
              className="room-list-create-btn" 
              onClick={() => setOpenCreateModal(true)}
              disabled={!selectedTheaterId}
            >
              <FontAwesomeIcon icon={faPlus} /> Tạo phòng chiếu
            </button>
          </div>
          {error && (
            <div className="room-list-error">{error}</div>
          )}
          {!selectedTheaterId ? (
            <div className="room-list-empty">
              Vui lòng chọn rạp chiếu để xem danh sách phòng
            </div>
          ) : roomsLoading ? (
            <div className="room-list-loading">Đang tải danh sách phòng...</div>
          ) : (
            <div className="room-list-table-wrap">
              <div className="room-list-table-body">
                <table className="room-list-table">
                <thead>
                  <tr>
                    <th>Tên phòng chiếu</th>
                    <th>Loại phòng chiếu</th>
                    <th>Số lượng ghế (tối đa)</th>
                    <th>Số hàng</th>
                    <th>Số cột</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                        Không có phòng chiếu nào trong rạp này
                      </td>
                    </tr>
                  ) : (
                    rooms.map((room) => (
                      <tr key={room.room_id}>
                        <td>{room.room_name}</td>
                        <td><RoomTypeTag type={room.room_type} /></td>
                        <td>{room.row * room.column}</td>
                        <td>{room.row}</td>
                        <td>{room.column}</td>
                        <td>
                          <button 
                            className="room-action-btn view" 
                            title="Xem sơ đồ" 
                            onClick={() => {
                              setSelectedRoomForSeatMap({
                                theaterSlug: selectedTheaterSlug,
                                roomSlug: room.room_slug,
                                roomName: room.room_name,
                                rows: room.row,
                                cols: room.column,
                              });
                              setOpenSeatMap(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faTableCellsLarge} />
                          </button>
                          <button 
                            className="room-action-btn edit" 
                            title="Sửa" 
                            onClick={() => {
                              setRoomEditing({
                                name: room.room_name,
                                type: room.room_type,
                                rows: room.row.toString(),
                                cols: room.column.toString(),
                                roomId: room.room_id,
                                roomSlug: room.room_slug,
                                theaterSlug: selectedTheaterSlug,
                              });
                              setOpenEditModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button 
                            className="room-action-btn delete" 
                            title="Xóa"
                            onClick={() => handleDelete(room)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <RoomEditModal 
        open={openEditModal} 
        onClose={() => {
          setOpenEditModal(false);
          setRoomEditing(null);
        }} 
        room={roomEditing}
        onSuccess={handleRefresh}
      />
      <RoomCreateModal 
        open={openCreateModal} 
        onClose={() => setOpenCreateModal(false)}
        cinemaName={selectedTheaterName}
        theaterSlug={selectedTheaterSlug}
        onSuccess={handleRefresh}
      />
      <SeatMapModal 
        open={openSeatMap} 
        onClose={() => {
          setOpenSeatMap(false);
          setSelectedRoomForSeatMap(null);
        }}
        theaterSlug={selectedRoomForSeatMap?.theaterSlug}
        roomSlug={selectedRoomForSeatMap?.roomSlug}
        rows={selectedRoomForSeatMap?.rows}
        cols={selectedRoomForSeatMap?.cols}
        roomName={selectedRoomForSeatMap?.roomName}
      />
    </div>
  );
}
