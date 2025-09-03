"use client";
import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/cinemaList.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const mockCinemas = [
  {
    id: 1,
    name: "CGV Aeon Mall Hà Đông",
    address: "Tầng 4, TTTM Aeon Mall Hà Đông, P. Dương Nội, Q. Hà Đông, Hà Nội",
    map: "21.001, 105.800",
    created: "13-04-2024",
  },
  {
    id: 2,
    name: "Lotte Cinema Landmark",
    address: "Tầng 5, Keangnam Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội",
    map: "21.017, 105.783",
    created: "13-04-2024",
  },
  {
    id: 3,
    name: "BHD Star Vincom Phạm Ngọc Thạch",
    address: "Tầng 8, Vincom Center, 2 Phạm Ngọc Thạch, Đống Đa, Hà Nội",
    map: "21.013, 105.834",
    created: "13-04-2024",
  },
  {
    id: 4,
    name: "Galaxy Mipec Long Biên",
    address: "Tầng 5, Mipec Long Biên, 2 Long Biên 2, Long Biên, Hà Nội",
    map: "21.048, 105.886",
    created: "13-04-2024",
  },
  {
    id: 5,
    name: "Beta Cineplex Mỹ Đình",
    address: "Tầng 3, The Garden, Mễ Trì, Nam Từ Liêm, Hà Nội",
    map: "21.028, 105.776",
    created: "13-04-2024",
  },
];

export default function CinemaListPage() {
  const [page, setPage] = useState(1);
  return (
    <div className="cinema-list-layout">
      <AdminSidebar />
      <main className="cinema-list-main">
        <div className="cinema-list-container">
          <div className="cinema-list-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Danh sách rạp chiếu</span>
          </div>
          <div className="cinema-list-action-bar">
            <Link href="/cinema/create" className="cinema-list-btn create">+ Tạo rạp chiếu</Link>
            <button className="cinema-list-btn refresh">C Refresh</button>
          </div>
          <div className="cinema-list-table-wrap">
            <table className="cinema-list-table">
              <thead>
                <tr>
                  <th>Tên rạp chiếu</th>
                  <th>Địa chỉ</th>
                  <th>Địa chỉ map</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {mockCinemas.map((cinema, idx) => (
                  <tr key={idx}>
                    <td>
                      <Link href={`/cinema/update/${cinema.id}`} className="cinema-link">{cinema.name}</Link>
                    </td>
                    <td>{cinema.address}</td>
                    <td>{cinema.map}</td>
                    <td>{cinema.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cinema-list-pagination">
            <button className="cinema-list-page-btn active">1</button>
            <button className="cinema-list-page-btn">2</button>
            <button className="cinema-list-page-btn">3</button>
            <span className="cinema-list-page-ellipsis">...</span>
            <button className="cinema-list-page-btn">24</button>
            <select className="cinema-list-page-size">
              <option>10 / page</option>
              <option>20 / page</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  );
} 