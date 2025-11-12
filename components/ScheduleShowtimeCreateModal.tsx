import React, { useState, useEffect } from "react";
import axios from "axios";
import "@/styles/components/showtimeSchedule.scss";

interface Movie {
  movie_id: number;
  movie_title: string;
  duration?: number;
}

interface Theater {
  theater_id: number;
  theater_name: string;
}

interface Room {
  room_id: number;
  room_name: string;
  theater_id: number;
}

interface ScheduleShowtimeCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ScheduleShowtimeCreateModal({ open, onClose, onSuccess }: ScheduleShowtimeCreateModalProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieDuration, setMovieDuration] = useState<number>(120); // Default 120 minutes

  const [form, setForm] = useState({
    movie_id: "",
    theater_id: "",
    room_id: "",
    show_date: "",
    start_time: "",
    graphics_type: "TWO_D" as "TWO_D" | "THREE_D" | "IMAX",
    translation_type: "PhuDe" as "LongTieng" | "PhuDe",
  });

  // Fetch movies
  useEffect(() => {
    if (open) {
      const fetchMovies = async () => {
        try {
          const response = await axios.get("http://localhost:3000/movie/all-for-schedule", {
            withCredentials: true,
          });
          setMovies(response.data || []);
          if (response.data && response.data.length > 0) {
            setForm(f => ({ ...f, movie_id: response.data[0].movie_id.toString() }));
            setSelectedMovie(response.data[0]);
          }
        } catch (err) {
          console.error("Error fetching movies:", err);
        }
      };
      fetchMovies();
    }
  }, [open]);

  // Fetch theaters
  useEffect(() => {
    if (open) {
      const fetchTheaters = async () => {
        try {
          const response = await axios.get("http://localhost:3000/theaters", {
            withCredentials: true,
          });
          setTheaters(response.data || []);
        } catch (err) {
          console.error("Error fetching theaters:", err);
        }
      };
      fetchTheaters();
    }
  }, [open]);

  // Fetch rooms when theater is selected
  useEffect(() => {
    const fetchRooms = async () => {
      if (!form.theater_id) {
        setRooms([]);
        setForm(f => ({ ...f, room_id: "" }));
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/rooms/theater/${form.theater_id}`, {
          withCredentials: true,
        });
        setRooms(response.data || []);
        setForm(f => ({ ...f, room_id: "" }));
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setRooms([]);
      }
    };

    if (open && form.theater_id) {
      fetchRooms();
    }
  }, [form.theater_id, open]);

  // Update selected movie and fetch duration
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (form.movie_id) {
        try {
          const response = await axios.get(`http://localhost:3000/movie/id/${form.movie_id}`, {
            withCredentials: true,
          });
          if (response.data) {
            setSelectedMovie({
              movie_id: response.data.movie_id,
              movie_title: response.data.movie_title,
              duration: response.data.duration,
            });
            setMovieDuration(response.data.duration || 120);
          }
        } catch (err) {
          console.error("Error fetching movie details:", err);
        }
      }
    };

    if (open && form.movie_id) {
      fetchMovieDetails();
    }
  }, [form.movie_id, open]);

  // Set default date to today
  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split("T")[0];
      setForm(f => ({ ...f, show_date: today }));
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError(null);
  };

  // Calculate end time from start time + movie duration
  const calculateEndTime = (showDate: string, startTime: string, duration: number): Date => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDateTime = new Date(showDate + "T" + startTime + ":00");
    startDateTime.setHours(hours, minutes, 0, 0);
    
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000); // duration in minutes
    return endDateTime;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.movie_id || !form.theater_id || !form.room_id || !form.show_date || !form.start_time) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Calculate start and end time
      const startDateTime = new Date(form.show_date + "T" + form.start_time + ":00");
      const endDateTime = calculateEndTime(form.show_date, form.start_time, movieDuration);

      // Prepare data for API
      const createData = {
        movie_id: parseInt(form.movie_id),
        theater_id: parseInt(form.theater_id),
        room_id: parseInt(form.room_id),
        show_date: new Date(form.show_date + "T00:00:00").toISOString(),
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        graphics_type: form.graphics_type,
        translation_type: form.translation_type,
      };

      await axios.post("http://localhost:3000/schedule-showtime", createData, {
        withCredentials: true,
      });

      alert("Tạo suất chiếu thành công!");
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err: any) {
      console.error("Error creating showtime:", err);
      setError(err.response?.data?.message || "Không thể tạo suất chiếu");
      alert(err.response?.data?.message || "Không thể tạo suất chiếu");
    } finally {
      setSaving(false);
    }
  };

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setError(null);
    setRooms([]);
    setSelectedMovie(null);
    setMovieDuration(120);
    // Reset form to default values
    if (movies.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      setForm({
        movie_id: movies[0].movie_id.toString(),
        theater_id: "",
        room_id: "",
        show_date: today,
        start_time: "",
        graphics_type: "TWO_D",
        translation_type: "PhuDe",
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setForm({
        movie_id: "",
        theater_id: "",
        room_id: "",
        show_date: today,
        start_time: "",
        graphics_type: "TWO_D",
        translation_type: "PhuDe",
      });
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="showtime-create-modal-bg" onClick={handleBgClick}>
      <div className="showtime-create-modal" onClick={e => e.stopPropagation()}>
        <button className="showtime-create-close" type="button" onClick={handleClose}>×</button>
        <div className="showtime-create-title">Tạo suất chiếu mới</div>
        {error && (
          <div className="showtime-create-error">{error}</div>
        )}
        <form className="showtime-create-form" onSubmit={handleSubmit}>
          <label className="showtime-create-label">
            Phim <span style={{ color: "#f44336" }}>*</span>
          </label>
          <select
            className="showtime-create-input"
            name="movie_id"
            value={form.movie_id}
            onChange={handleChange}
            required
            disabled={saving || loading}
          >
            <option value="">-- Chọn phim --</option>
            {movies.map(movie => (
              <option key={movie.movie_id} value={movie.movie_id}>
                {movie.movie_title}
              </option>
            ))}
          </select>

          <label className="showtime-create-label">
            Rạp chiếu <span style={{ color: "#f44336" }}>*</span>
          </label>
          <select
            className="showtime-create-input"
            name="theater_id"
            value={form.theater_id}
            onChange={handleChange}
            required
            disabled={saving || loading}
          >
            <option value="">-- Chọn rạp chiếu --</option>
            {theaters.map(theater => (
              <option key={theater.theater_id} value={theater.theater_id}>
                {theater.theater_name}
              </option>
            ))}
          </select>

          <label className="showtime-create-label">
            Phòng chiếu <span style={{ color: "#f44336" }}>*</span>
          </label>
          <select
            className="showtime-create-input"
            name="room_id"
            value={form.room_id}
            onChange={handleChange}
            required
            disabled={saving || loading || !form.theater_id || rooms.length === 0}
          >
            <option value="">-- Chọn phòng chiếu --</option>
            {rooms.map(room => (
              <option key={room.room_id} value={room.room_id}>
                {room.room_name}
              </option>
            ))}
          </select>

          <label className="showtime-create-label">
            Ngày chiếu <span style={{ color: "#f44336" }}>*</span>
          </label>
          <input
            className="showtime-create-input"
            type="date"
            name="show_date"
            value={form.show_date}
            onChange={handleChange}
            required
            disabled={saving}
          />

          <label className="showtime-create-label">
            Giờ bắt đầu <span style={{ color: "#f44336" }}>*</span>
          </label>
          <input
            className="showtime-create-input"
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required
            disabled={saving}
          />

          <label className="showtime-create-label">
            Loại hình ảnh <span style={{ color: "#f44336" }}>*</span>
          </label>
          <select
            className="showtime-create-input"
            name="graphics_type"
            value={form.graphics_type}
            onChange={handleChange}
            required
            disabled={saving}
          >
            <option value="TWO_D">2D</option>
            <option value="THREE_D">3D</option>
            <option value="IMAX">IMAX</option>
          </select>

          <label className="showtime-create-label">
            Loại phụ đề <span style={{ color: "#f44336" }}>*</span>
          </label>
          <select
            className="showtime-create-input"
            name="translation_type"
            value={form.translation_type}
            onChange={handleChange}
            required
            disabled={saving}
          >
            <option value="PhuDe">Phụ đề</option>
            <option value="LongTieng">Lồng tiếng</option>
          </select>

          {selectedMovie && form.start_time && movieDuration && (
            <div className="showtime-create-info">
              <p><strong>Thời lượng phim:</strong> {movieDuration} phút</p>
              <p><strong>Giờ kết thúc dự kiến:</strong> {
                (() => {
                  const endTime = calculateEndTime(form.show_date, form.start_time, movieDuration);
                  return endTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                })()
              }</p>
            </div>
          )}

          <button
            className="showtime-create-btn"
            type="submit"
            disabled={saving || loading}
          >
            {saving ? "Đang tạo..." : "Tạo suất chiếu"}
          </button>
        </form>
      </div>
    </div>
  );
}

