"use client";
import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/movieList.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const mockMovies = [
  {
    id: 1,
    name: "Furiosa: Câu Chuyện Từ Max Điên",
    year: 2024,
    genres: ["Hành động", "Gay cấn", "Khoa học - Viễn tưởng"],
    showDate: "17-05-2024",
    status: "Công khai",
    created: "13-04-2024",
  },
  {
    id: 2,
    name: "Lật Mặt 7: Một Điều Ước",
    year: 2024,
    genres: ["Hài", "Gia đình", "Tình cảm"],
    showDate: "26-04-2024",
    status: "Công khai",
    created: "13-04-2024",
  },
  {
    id: 3,
    name: "Mickey 17",
    year: 2025,
    genres: ["Chính kịch", "Phiêu lưu", "Khoa học - Viễn tưởng"],
    showDate: "28-02-2025",
    status: "Công khai",
    created: "13-04-2024",
  },
  {
    id: 4,
    name: "Những Người Bạn Tưởng Tượng",
    year: 2024,
    genres: ["Hài", "Gia đình", "Chính kịch", "Hoạt hình", "Giả tưởng"],
    showDate: "17-05-2024",
    status: "Công khai",
    created: "13-04-2024",
  },
  {
    id: 5,
    name: "Joker: Folie à Deux - Điên Có Đôi",
    year: 2024,
    genres: ["Chính kịch", "Gay cấn", "Hình sự"],
    showDate: "04-10-2024",
    status: "Công khai",
    created: "13-04-2024",
  },
  {
    id: 6,
    name: "Những Mảnh Ghép Cảm Xúc 2",
    year: 2024,
    genres: ["Hài", "Gia đình", "Chính kịch", "Hoạt hình"],
    showDate: "14-06-2024",
    status: "Công khai",
    created: "13-04-2024",
  },
  {
    id: 7,
    name: "Ngôi Đền Kỳ Quái 4",
    year: 2024,
    genres: ["Hài", "Kinh dị"],
    showDate: "31-05-2024",
    status: "Công khai",
    created: "13-04-2024",
  },
  {
    id: 8,
    name: "Garfield - Mèo Béo Siêu Quậy",
    year: 2024,
    genres: ["Hài", "Gia đình", "Hoạt hình"],
    showDate: "31-05-2024",
    status: "Công khai",
    created: "13-04-2024",
  },
  {
    id: 9,
    name: "Hành Tinh Khỉ: Vương Quốc Mới",
    year: 2024,
    genres: ["Hành động", "Khoa học - Viễn tưởng"],
    showDate: "24-05-2024",
    status: "Công khai",
    created: "13-04-2024",
  },
  {
    id: 10,
    name: "Kẻ Thế Thân",
    year: 2024,
    genres: ["Hài", "Hành động", "Gay cấn"],
    showDate: "03-05-2024",
    status: "Công khai",
    created: "13-04-2024",
  },
];

function GenreTag({ children }: { children: React.ReactNode }) {
  return <span className="movie-genre-tag">{children}</span>;
}

function StatusTag({ status }: { status: string }) {
  return <span className="movie-status-tag">{status}</span>;
}

function ShowDateTag({ date }: { date: string }) {
  return <span className="movie-showdate-tag">{date}</span>;
}

export default function MovieListPage() {
  const [page, setPage] = useState(1);
  return (
    <div className="movie-list-layout">
      <AdminSidebar />
      <main className="movie-list-main">
        <div className="movie-list-container">
          <div className="movie-list-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Danh sách phim</span>
          </div>
          <div className="movie-list-action-bar">
            <Link href="/movie/create" className="movie-list-btn create">+ Tạo phim</Link>
            <button className="movie-list-btn refresh">C Refresh</button>
          </div>
          <div className="movie-list-table-wrap">
            <table className="movie-list-table">
              <thead>
                <tr>
                  <th>Tên phim</th>
                  <th>Năm phát hành</th>
                  <th>Thể loại</th>
                  <th>Lịch chiếu</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {mockMovies.map((movie, idx) => (
                  <tr key={idx}>
                    <td>
                      <Link href={`/movie/update/${movie.id || idx + 1}`} className="movie-link">{movie.name}</Link>
                    </td>
                    <td>{movie.year}</td>
                    <td>
                      {movie.genres.map((g, i) => (
                        <GenreTag key={i}>{g}</GenreTag>
                      ))}
                    </td>
                    <td><ShowDateTag date={movie.showDate} /></td>
                    <td><StatusTag status={movie.status} /></td>
                    <td>{movie.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="movie-list-pagination">
            <button className="movie-list-page-btn active">1</button>
            <button className="movie-list-page-btn">2</button>
            <button className="movie-list-page-btn">3</button>
            <span className="movie-list-page-ellipsis">...</span>
            <button className="movie-list-page-btn">24</button>
            <select className="movie-list-page-size">
              <option>10 / page</option>
              <option>20 / page</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  );
} 