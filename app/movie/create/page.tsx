"use client";
import React, { useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import "../../../styles/components/movieCreate.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const genreOptions = ["Hành động", "Hài", "Tình cảm", "Kinh dị", "Hoạt hình", "Chính kịch", "Phiêu lưu", "Khoa học - Viễn tưởng", "Giả tưởng", "Hình sự"];
const directorOptions = ["Đạo diễn 1", "Đạo diễn 2"];
const actorOptions = ["Diễn viên 1", "Diễn viên 2"];
const countryOptions = ["Việt Nam", "Mỹ", "Hàn Quốc", "Nhật Bản"];
const statusOptions = ["Nháp", "Công khai"];
const graphicsOptions = ["2D", "3D", "IMAX"];
const translationOptions = ["Lồng tiếng", "Phụ đề"];
const ageOptions = ["P", "C13", "C16", "C18"];

export default function MovieCreatePage() {
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [trailer, setTrailer] = useState<File | null>(null);

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPoster(file);
      setPosterPreview(URL.createObjectURL(file));
    } else {
      setPoster(null);
      setPosterPreview(null);
    }
  };
  const handleTrailerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setTrailer(file);
    } else {
      setTrailer(null);
    }
  };

  return (
    <div className="movie-create-layout">
      <AdminSidebar />
      <main className="movie-create-main">
        <div className="movie-create-container">
          <div className="movie-create-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-link">Danh sách phim</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Tạo phim</span>
          </div>
          <div className="movie-create-action-bar">
            <Link href="/movie/list" className="movie-create-btn back">&lt; Quay lại</Link>
            <button className="movie-create-btn create">+ Tạo phim</button>
          </div>
          <form className="movie-create-form">
            <div className="movie-create-form-col">
              <label className="movie-create-label required">Tên phim</label>
              <input className="movie-create-input" placeholder="Enter name" />
              <label className="movie-create-label required">Tên phim (tiếng anh)</label>
              <input className="movie-create-input" placeholder="Enter english name" />
              <label className="movie-create-label required">Poster phim</label>
              <input
                className="movie-create-input"
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
              />
              {posterPreview && (
                <img src={posterPreview} alt="Poster preview" style={{ maxWidth: '100%', maxHeight: 160, marginTop: 8, borderRadius: 6, border: '1px solid #eee' }} />
              )}
              <label className="movie-create-label required">Trailer</label>
              <input
                className="movie-create-input"
                type="file"
                accept="video/*"
                onChange={handleTrailerChange}
              />
              {trailer && (
                <div style={{ marginTop: 8, color: '#1976d2', fontSize: 14 }}>
                  Video: {trailer.name}
                </div>
              )}
              <label className="movie-create-label required">Mô tả</label>
              <textarea className="movie-create-input" placeholder="Enter description" rows={3} />
              <label className="movie-create-label">Thể loại</label>
              <select className="movie-create-input"><option>Select genres</option>{genreOptions.map(g => <option key={g}>{g}</option>)}</select>
              <label className="movie-create-label">Đạo diễn</label>
              <select className="movie-create-input"><option>Select directors</option>{directorOptions.map(d => <option key={d}>{d}</option>)}</select>
              <label className="movie-create-label">Diễn viên</label>
              <select className="movie-create-input"><option>Select actors</option>{actorOptions.map(a => <option key={a}>{a}</option>)}</select>
            </div>
            <div className="movie-create-form-col">
              <label className="movie-create-label required">Hình thức chiếu</label>
              <select className="movie-create-input"><option>Select a graphics</option>{graphicsOptions.map(g => <option key={g}>{g}</option>)}</select>
              <label className="movie-create-label required">Hình thức dịch</label>
              <select className="movie-create-input"><option>Select a graphics</option>{translationOptions.map(g => <option key={g}>{g}</option>)}</select>
              <label className="movie-create-label required">Độ tuổi xem phim</label>
              <select className="movie-create-input"><option>Select a age</option>{ageOptions.map(a => <option key={a}>{a}</option>)}</select>
              <label className="movie-create-label required">Ngày chiếu</label>
              <input className="movie-create-input" type="date" />
              <label className="movie-create-label required">Năm phát hành</label>
              <input className="movie-create-input" placeholder="Enter release year" />
              <label className="movie-create-label required">Thời lượng phim (phút)</label>
              <input className="movie-create-input" placeholder="Enter duration" />
              <label className="movie-create-label">Trạng thái</label>
              <select className="movie-create-input"><option>Nháp</option>{statusOptions.map(s => <option key={s}>{s}</option>)}</select>
              <label className="movie-create-label">Quốc gia</label>
              <select className="movie-create-input"><option>Select a country</option>{countryOptions.map(c => <option key={c}>{c}</option>)}</select>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 