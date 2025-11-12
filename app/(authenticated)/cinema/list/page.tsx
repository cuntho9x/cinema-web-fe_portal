"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/cinemaList.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface Theater {
  theater_id: number;
  theater_name: string;
  theater_address: string;
  theater_phoneNumber: string;
  theater_title_url: string;
  map_url: string;
}

export default function CinemaListPage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/theaters", {
        withCredentials: true,
      });
      setTheaters(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching theaters:", err);
      setError("Không thể tải danh sách rạp chiếu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

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
            <button className="cinema-list-btn refresh" onClick={fetchTheaters}>⟳ Refresh</button>
          </div>
          {loading ? (
            <div className="cinema-list-loading">Đang tải...</div>
          ) : error ? (
            <div className="cinema-list-error">{error}</div>
          ) : (
            <>
              <div className="cinema-list-table-wrap">
                <div className="cinema-list-table-body">
                  <table className="cinema-list-table">
                  <thead>
                    <tr>
                      <th>Tên rạp chiếu</th>
                      <th>Địa chỉ</th>
                      <th>Địa chỉ map</th>
                      <th>Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {theaters.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                          Không có rạp chiếu nào
                        </td>
                      </tr>
                    ) : (
                      theaters.map((theater) => (
                        <tr key={theater.theater_id}>
                          <td>
                            <Link href={`/cinema/update/${theater.theater_id}`} className="cinema-link">
                              {theater.theater_name}
                            </Link>
                          </td>
                          <td>{theater.theater_address}</td>
                          <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {theater.map_url}
                          </td>
                          <td>{theater.theater_phoneNumber}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
