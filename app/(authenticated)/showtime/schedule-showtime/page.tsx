"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/showtimeSchedule.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ScheduleShowtimeCreateModal from "@/components/ScheduleShowtimeCreateModal";

interface Theater {
  theater_id: number;
  theater_name: string;
}

interface Room {
  room_id: number;
  room_name: string;
  theater_id: number;
}

interface Movie {
  movie_id: number;
  movie_title: string;
  movie_poster: string | null;
  duration: number;
}

interface ScheduleShowtime {
  id: number;
  movie_id: number;
  theater_id: number;
  room_id: number;
  show_date: string;
  start_time: string;
  end_time: string;
  graphics_type: string;
  translation_type: string;
  movie: Movie;
  theater: Theater;
  room: Room;
}

export default function ScheduleShowtimePage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showtimes, setShowtimes] = useState<ScheduleShowtime[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  
  const [selectedTheaterId, setSelectedTheaterId] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Fetch theaters
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await axios.get("http://localhost:3000/theaters", {
          withCredentials: true,
        });
        setTheaters(response.data);
      } catch (err) {
        console.error("Error fetching theaters:", err);
      }
    };
    fetchTheaters();
  }, []);

  // Fetch rooms when theater is selected
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedTheaterId) {
        setRooms([]);
        setSelectedRoomId(null);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/rooms/theater/${selectedTheaterId}`, {
          withCredentials: true,
        });
        setRooms(response.data);
        setSelectedRoomId(null);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setRooms([]);
      }
    };

    fetchRooms();
  }, [selectedTheaterId]);

  const handleSearch = async () => {
    if (!selectedTheaterId || !selectedRoomId || !selectedDate) {
      alert("Vui lòng chọn đầy đủ: Rạp, Phòng và Ngày chiếu");
      setShowtimes([]);
      setHasSearched(false);
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);
      setHasSearched(true);
      
      const params: any = {
        theaterId: selectedTheaterId.toString(),
        roomId: selectedRoomId.toString(),
        showDate: selectedDate,
      };
      
      const response = await axios.get<ScheduleShowtime[]>("http://localhost:3000/schedule-showtime", {
        params,
        withCredentials: true,
      });
      
      const showtimesData = Array.isArray(response.data) ? response.data : [];
      
      const filteredShowtimes = showtimesData.filter(showtime => {
        if (showtime.theater_id !== selectedTheaterId) return false;
        if (showtime.room_id !== selectedRoomId) return false;
        const showDate = new Date(showtime.show_date);
        const selectedDateObj = new Date(selectedDate + 'T00:00:00');
        const showDateOnly = new Date(showDate.getFullYear(), showDate.getMonth(), showDate.getDate());
        const selectedDateOnly = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), selectedDateObj.getDate());
        
        if (showDateOnly.getTime() !== selectedDateOnly.getTime()) return false;
        
        return true;
      });
      
      setShowtimes(filteredShowtimes);
    } catch (err: any) {
      console.error("Error fetching showtimes:", err);
      setError("Không thể tải danh sách xuất chiếu");
      setShowtimes([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatGraphicsType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      TWO_D: "2D",
      THREE_D: "3D",
      IMAX: "IMAX",
    };
    return typeMap[type] || type;
  };

  const formatTranslationType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      LongTieng: "Lồng tiếng",
      PhuDe: "Phụ đề",
    };
    return typeMap[type] || type;
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  return (
    <div className="showtime-schedule-layout">
      <AdminSidebar />
      <main className="showtime-schedule-main">
        <div className="showtime-schedule-container">
          <div className="showtime-schedule-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Danh sách xuất chiếu</span>
          </div>

          {/* Action Bar */}
          <div className="showtime-schedule-action-bar">
            <button 
              className="showtime-schedule-create-btn" 
              onClick={() => setOpenCreateModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              Tạo suất chiếu
            </button>
          </div>

          {/* Search Filter - Horizontal Layout */}
          <div className="showtime-schedule-filter-bar">
            <div className="filter-item">
              <label>
                Rạp chiếu <span className="required-mark">*</span>
              </label>
              <select
                value={selectedTheaterId || ""}
                onChange={(e) => setSelectedTheaterId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">-- Chọn rạp chiếu --</option>
                {theaters.map((theater) => (
                  <option key={theater.theater_id} value={theater.theater_id}>
                    {theater.theater_name}
                  </option>
                ))}
            </select>
            </div>

            <div className="filter-item">
              <label>
                Phòng chiếu <span className="required-mark">*</span>
              </label>
              <select
                value={selectedRoomId || ""}
                onChange={(e) => setSelectedRoomId(e.target.value ? Number(e.target.value) : null)}
                disabled={!selectedTheaterId || rooms.length === 0}
              >
                <option value="">-- Chọn phòng chiếu --</option>
                {rooms.map((room) => (
                  <option key={room.room_id} value={room.room_id}>
                    {room.room_name}
                  </option>
                ))}
            </select>
            </div>

            <div className="filter-item">
              <label>
                Ngày chiếu <span className="required-mark">*</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={searchLoading || !selectedTheaterId || !selectedRoomId || !selectedDate}
              className="showtime-schedule-search-btn"
            >
              <FontAwesomeIcon icon={faSearch} />
              {searchLoading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>

          {error && (
            <div className="showtime-error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
          </div>
          )}

          {/* Results Table - Max 10 rows with scroll */}
          {hasSearched && searchLoading ? (
            <div className="showtime-loading-state">
              <div className="loading-icon">⏳</div>
              <div className="loading-text">Đang tìm kiếm...</div>
          </div>
          ) : hasSearched && !searchLoading && showtimes.length > 0 ? (
          <div className="showtime-schedule-table-wrap">
              <div className="showtime-table-header">
                <span className="header-icon">🎬</span>
                <span>Danh sách xuất chiếu</span>
                <span className="header-count">{showtimes.length} suất</span>
              </div>
              <div className="showtime-table-body">
            <table className="showtime-schedule-table">
              <thead>
                <tr>
                      <th>Phim</th>
                      <th>Ngày chiếu</th>
                      <th>Giờ bắt đầu</th>
                      <th>Giờ kết thúc</th>
                      <th>Loại hình ảnh</th>
                      <th>Loại phụ đề</th>
                      <th>Thời lượng</th>
                </tr>
              </thead>
              <tbody>
                    {showtimes.map((showtime) => (
                      <tr key={showtime.id}>
                        <td>
                          <div className="movie-info">
                            {showtime.movie.movie_poster && (
                              <img
                                src={showtime.movie.movie_poster}
                                alt={showtime.movie.movie_title}
                                className="showtime-movie-poster"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            )}
                            <span className="showtime-schedule-movie-link">{showtime.movie.movie_title}</span>
                          </div>
                        </td>
                        <td>{formatDate(showtime.show_date)}</td>
                        <td>
                          <span className="time-orange">{formatTime(showtime.start_time)}</span>
                        </td>
                        <td>
                          <span className="time-orange">{formatTime(showtime.end_time)}</span>
                        </td>
                        <td>
                          <span className="showtime-schedule-format">{formatGraphicsType(showtime.graphics_type)}</span>
                        </td>
                        <td>
                          <span className="subtitle-green">{formatTranslationType(showtime.translation_type)}</span>
                        </td>
                        <td>{showtime.movie.duration} phút</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </div>
          ) : hasSearched && !searchLoading && showtimes.length === 0 ? (
            <div className="showtime-empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">Không tìm thấy xuất chiếu</div>
              <div className="empty-message">
                Không có xuất chiếu nào cho rạp, phòng và ngày đã chọn
              </div>
            </div>
          ) : null}
        </div>
      </main>
      {openCreateModal && (
        <ScheduleShowtimeCreateModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onSuccess={() => {
            // Refresh danh sách nếu đã search
            if (hasSearched) {
              handleSearch();
            }
          }}
        />
      )}
    </div>
  );
} 
