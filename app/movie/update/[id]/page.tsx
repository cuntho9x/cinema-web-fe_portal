"use client";
import React, { useState } from "react";
import AdminSidebar from "../../../../components/AdminSidebar";
import "../../../../styles/components/movieUpdate.scss";
import Link from "next/link";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const genreOptions = ["Hành động", "Hài", "Tình cảm", "Kinh dị", "Hoạt hình", "Chính kịch", "Phiêu lưu", "Khoa học - Viễn tưởng", "Giả tưởng", "Hình sự"].map(v => ({ value: v, label: v }));
const directorOptions = ["Anya Taylor-Joy", "Đạo diễn 2"].map(v => ({ value: v, label: v }));
const actorOptions = ["Nathan Jones", "Chris Hemsworth", "Alyla Browne", "Goran D. Kleut", "Tom Burke", "Lachy Hulme", "Angus Sampson", "CJ. Bloomfield"].map(v => ({ value: v, label: v }));
const countryOptions = ["Việt Nam", "Mỹ", "Hàn Quốc", "Nhật Bản"].map(v => ({ value: v, label: v }));
const statusOptions = ["Nháp", "Công khai"];
const graphicsOptions = ["2D", "3D", "IMAX"].map(v => ({ value: v, label: v }));
const translationOptions = ["Lồng tiếng", "Phụ đề"].map(v => ({ value: v, label: v }));
const ageOptions = ["P", "C13", "C16", "C18"];

export default function MovieUpdatePage() {
  const [tab, setTab] = useState(0);
  return (
    <div className="movie-update-layout">
      <AdminSidebar />
      <main className="movie-update-main">
        <div className="movie-update-container">
          <div className="movie-update-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-link">Danh sách phim</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Cập nhật phim</span>
          </div>
          <div className="movie-update-tabs">
            <button className={tab === 0 ? "movie-update-tab active" : "movie-update-tab"} onClick={() => setTab(0)}>Thông tin phim</button>
            <button className={tab === 1 ? "movie-update-tab active" : "movie-update-tab"} onClick={() => setTab(1)}>Đánh giá phim (0)</button>
          </div>
          {tab === 0 && (
            <>
              <div className="movie-update-action-bar">
                <Link href="/movie/list" className="movie-update-btn back">&lt; Quay lại</Link>
                <button className="movie-update-btn update">Cập nhật</button>
                <button className="movie-update-btn delete">Xóa phim</button>
              </div>
              <form className="movie-update-form">
                <div className="movie-update-form-col">
                  <label className="movie-update-label required">Tên phim</label>
                  <input className="movie-update-input" defaultValue="Furiosa: Câu Chuyện Từ Max Điên" />
                  <label className="movie-update-label required">Tên phim (tiếng anh)</label>
                  <input className="movie-update-input" defaultValue="Furiosa: A Mad Max Saga" />
                  <label className="movie-update-label required">Trailer</label>
                  <input className="movie-update-input" defaultValue="https://www.youtube.com/embed/yz96EBNwMGw?si=Qj6pYZPhkUdAHGsd" />
                  <label className="movie-update-label required">Mô tả</label>
                  <textarea className="movie-update-input" defaultValue="Câu chuyện bắt đầu từ lúc Thế giới sụp đổ, Furiosa phải tự cứu lấy mình để trở về nhà. Một cuộc phiêu lưu hành động độc lập khốc liệt, tiến truyện về..." rows={3} />
                  <label className="movie-update-label">Thể loại</label>
                  <Select
                    classNamePrefix="movie-update-select"
                    isMulti
                    defaultValue={genreOptions.filter(o => ["Khoa học - Viễn tưởng", "Gay cấn", "Hành động"].includes(o.value))}
                    options={genreOptions}
                  />
                  <label className="movie-update-label">Đạo diễn</label>
                  <Select
                    classNamePrefix="movie-update-select"
                    isMulti
                    defaultValue={directorOptions.filter(o => ["Anya Taylor-Joy"].includes(o.value))}
                    options={directorOptions}
                  />
                  <label className="movie-update-label">Diễn viên</label>
                  <Select
                    classNamePrefix="movie-update-select"
                    isMulti
                    defaultValue={actorOptions.filter(o => [
                      "Nathan Jones", "Chris Hemsworth", "Alyla Browne", "Goran D. Kleut", "Tom Burke", "Lachy Hulme", "Angus Sampson", "CJ. Bloomfield"
                    ].includes(o.value))}
                    options={actorOptions}
                  />
                </div>
                <div className="movie-update-form-col">
                  <label className="movie-update-label required">Hình thức chiếu</label>
                  <Select
                    classNamePrefix="movie-update-select"
                    isMulti
                    defaultValue={graphicsOptions.filter(o => ["2D"].includes(o.value))}
                    options={graphicsOptions}
                  />
                  <label className="movie-update-label required">Hình thức dịch</label>
                  <Select
                    classNamePrefix="movie-update-select"
                    isMulti
                    defaultValue={translationOptions.filter(o => ["Phụ đề"].includes(o.value))}
                    options={translationOptions}
                  />
                  <label className="movie-update-label required">Độ tuổi xem phim</label>
                  <select className="movie-update-input" defaultValue="C16">{ageOptions.map(a => <option key={a}>{a}</option>)}</select>
                  <label className="movie-update-label required">Ngày chiếu</label>
                  <input className="movie-update-input" type="date" defaultValue="2024-05-17" />
                  <label className="movie-update-label required">Năm phát hành</label>
                  <input className="movie-update-input" defaultValue="2024" />
                  <label className="movie-update-label required">Thời lượng phim (phút)</label>
                  <input className="movie-update-input" defaultValue="100" />
                  <label className="movie-update-label">Trạng thái</label>
                  <select className="movie-update-input" defaultValue="Công khai">
                    {statusOptions.map((s: string) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <label className="movie-update-label">Quốc gia</label>
                  <select className="movie-update-input" defaultValue="Mỹ">{countryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select>
                </div>
              </form>
            </>
          )}
          {tab === 1 && (
            <div className="movie-update-review-tab">Chưa có đánh giá nào cho phim này.</div>
          )}
        </div>
      </main>
    </div>
  );
} 