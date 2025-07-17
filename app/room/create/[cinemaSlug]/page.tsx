'use client'

import React from "react";
import { useParams, useRouter } from "next/navigation";
import "../../../../styles/components/roomCreate.scss";

const cinemas = [
  { id: 1, name: "HCinema Aeon Hà Đông" },
  { id: 2, name: "CGV Vincom Bà Triệu" },
  { id: 3, name: "Lotte Cinema Landmark" },
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function RoomCreatePage() {
  const params = useParams();
  const router = useRouter();
  const cinemaSlug = params?.cinemaSlug as string;
  const cinema = cinemas.find(c => slugify(c.name) === cinemaSlug);

  return (
    <div className="room-create-modal-bg">
      <div className="room-create-modal">
        <div className="room-create-title">Tạo phòng chiếu cho rạp: <span style={{ color: '#2196f3' }}>{cinema?.name || cinemaSlug}</span></div>
        <form className="room-create-form">
          <label className="room-create-label">Tên phòng chiếu</label>
          <input className="room-create-input" placeholder="Nhập tên phòng chiếu" />

          <label className="room-create-label">Loại phòng chiếu</label>
          <select className="room-create-input">
            <option value="">Chọn loại phòng</option>
            <option value="Tiêu chuẩn">Tiêu chuẩn</option>
            <option value="GOLD CLASS">GOLD CLASS</option>
            <option value="IMAX">IMAX</option>
          </select>

          <label className="room-create-label">Số hàng</label>
          <input className="room-create-input" placeholder="Nhập số hàng" type="number" min={1} />

          <label className="room-create-label">Số cột</label>
          <input className="room-create-input" placeholder="Nhập số cột" type="number" min={1} />

          <button className="room-create-btn" type="submit">Lưu</button>
          <button className="room-create-back-btn" type="button" onClick={() => router.push(`/room/list`)}>&lt; Quay lại</button>
        </form>
      </div>
    </div>
  );
} 