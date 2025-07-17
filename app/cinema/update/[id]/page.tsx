"use client";
import React from "react";
import AdminSidebar from "../../../../components/AdminSidebar";
import "../../../../styles/components/cinemaUpdate.scss";
import Link from "next/link";

const mockRooms = [
  { name: "Cinema 1", type: "Tiêu chuẩn", seats: 224, rows: "14 (A -> N)", cols: "16 (1 -> 16)", created: "01-04-2024", typeColor: "standard" },
  { name: "GOLD CLASS", type: "GOLD CLASS", seats: 144, rows: "12 (A -> L)", cols: "12 (1 -> 12)", created: "01-04-2024", typeColor: "gold" },
  { name: "Cinema 2", type: "Tiêu chuẩn", seats: 252, rows: "14 (A -> N)", cols: "18 (1 -> 18)", created: "01-04-2024", typeColor: "standard" },
  { name: "IMAX", type: "IMAX", seats: 320, rows: "16 (A -> P)", cols: "20 (1 -> 20)", created: "01-04-2024", typeColor: "imax" },
];

function RoomTypeTag({ type }: { type: string }) {
  let className = "room-type-tag ";
  if (type === "GOLD CLASS") className += "gold";
  else if (type === "IMAX") className += "imax";
  else className += "standard";
  return <span className={className}>{type}</span>;
}

export default function CinemaUpdatePage() {
  return (
    <div className="cinema-update-layout">
      <AdminSidebar />
      <main className="cinema-update-main">
        <div className="cinema-update-container">
          <div className="cinema-update-breadcrumb">Dashboard / Danh sách rạp chiếu / HCinema Aeon Hà Đông</div>
          <div className="cinema-update-action-bar">
            <Link href="/cinema/list" className="cinema-update-btn back">&lt; Quay lại</Link>
            <button className="cinema-update-btn update">Cập nhật</button>
            <button className="cinema-update-btn delete">Xóa rạp chiếu</button>
          </div>
          <div className="cinema-update-form-row">
            <form className="cinema-update-form">
              <label className="cinema-update-label required">Tên rạp chiếu</label>
              <input className="cinema-update-input" defaultValue="HCinema Aeon Hà Đông" />
              <label className="cinema-update-label required">Địa chỉ</label>
              <textarea className="cinema-update-input" defaultValue="Tầng 3 & 4 - TTTM AEON MALL HÀ ĐÔNG, P. Dương Nội, Q. Hà Đông, Hà Nội" rows={2} />
              <label className="cinema-update-label required">Địa chỉ map</label>
              <textarea className="cinema-update-input" defaultValue="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11862.5525173755!2d105.7506271!3d20.9884221!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313453d63131b779%3A0xf003217a9a255f2c!2sCGV%20Aeon%20Mall%20Dong!5e0!3m2!1svi!2s!4v1714129837391!5m2!1svi!2s" rows={2} />
            </form>
            <div className="cinema-update-map-box">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11862.5525173755!2d105.7506271!3d20.9884221!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313453d63131b779%3A0xf003217a9a255f2c!2sCGV%20Aeon%20Mall%20Dong!5e0!3m2!1svi!2s!4v1714129837391!5m2!1svi!2s"
                width="100%"
                height="320"
                style={{ border: 0, borderRadius: 8, width: '100%', height: '320px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 