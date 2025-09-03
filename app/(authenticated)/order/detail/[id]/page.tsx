"use client";
import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/orderDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const order = {
  id: "96175515",
  movie: "Monkey Man Báo Thù",
  showtime: "20:25 - 22:20",
  date: "06-05-2024",
  room: "IMAX",
  cinema: "HCinema Aeon Hà Đông",
  created: "06-05-2024",
  status: "Đã xác nhận",
  customer: {
    name: "Hiên Super",
    phone: "0344005816",
    email: "hien@gmail.com",
    status: "Đã xác nhận",
    total: 1066000,
    discount: 0,
    final: 1066000,
  },
  seats: [
    { code: "A1", type: "Ghế thường", price: 100000 },
    { code: "C2", type: "Ghế thường", price: 100000 },
    { code: "C3", type: "Ghế thường", price: 100000 },
    { code: "C4", type: "Ghế thường", price: 100000 },
    { code: "D4", type: "Ghế thường", price: 100000 },
  ],
  services: [
    { name: "HCINEMA COMBO", qty: 1, price: 113000 },
    { name: "MY COMBO", qty: 1, price: 87000 },
    { name: "LADIES LOVE SET", qty: 2, price: 183000 },
  ],
};

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN");
}

export default function OrderDetailPage() {
  const router = useRouter();
  return (
    <div className="order-detail-layout">
      <AdminSidebar />
      <main className="order-detail-main">
        <div className="order-detail-container">
          <div className="order-detail-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-link">Danh sách đơn hàng</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Đơn hàng {order.id}</span>
          </div>
          <button className="order-detail-back-btn" onClick={() => router.back()}>&lt; Quay lại</button>
          <div className="order-detail-content">
            <div className="order-detail-col">
              <div className="order-detail-title">Thông tin đơn hàng</div>
              <div className="order-detail-row"><b>Mã đơn hàng:</b> {order.id}</div>
              <div className="order-detail-row"><b>Phim:</b> <span className="order-detail-link">{order.movie}</span></div>
              <div className="order-detail-row"><b>Giờ chiếu:</b> <span className="order-detail-showtime time-orange">{order.showtime}</span></div>
              <div className="order-detail-row"><b>Ngày chiếu:</b> {order.date}</div>
              <div className="order-detail-row"><b>Phòng chiếu:</b> {order.room}</div>
              <div className="order-detail-row"><b>Rạp chiếu:</b> <span className="order-detail-link">{order.cinema}</span></div>
              <div className="order-detail-row"><b>Ngày đặt:</b> {order.created}</div>
            </div>
            <div className="order-detail-col">
              <div className="order-detail-title">Thông tin khách hàng</div>
              <div className="order-detail-row"><b>Khách hàng:</b> <span className="order-detail-link">{order.customer.name}</span></div>
              <div className="order-detail-row"><b>Điện thoại:</b> {order.customer.phone}</div>
              <div className="order-detail-row"><b>Email:</b> {order.customer.email}</div>
              <div className="order-detail-row"><b>Trạng thái:</b> <span className="order-detail-status paid">{order.customer.status}</span></div>
              <div className="order-detail-row"><b>Thành tiền:</b> <span className="order-detail-money">{formatMoney(order.customer.total)}</span></div>
              <div className="order-detail-row"><b>Giảm giá:</b> <span className="order-detail-money">{formatMoney(order.customer.discount)}</span></div>
              <div className="order-detail-row"><b>Tổng tiền:</b> <span className="order-detail-money">{formatMoney(order.customer.final)}</span></div>
            </div>
            <div className="order-detail-col order-detail-col-wide">
              <div className="order-detail-title">Ghế & Dịch vụ</div>
              <table className="order-detail-seat-table">
                <thead>
                  <tr>
                    <th>Thông tin ghế</th>
                    <th>Loại ghế</th>
                    <th>Giá tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.seats.map((s, idx) => (
                    <tr key={s.code}>
                      <td>{s.code}</td>
                      <td><span className="order-detail-seat-type">{s.type}</span></td>
                      <td>{formatMoney(s.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="order-detail-service-table">
                <thead>
                  <tr>
                    <th>Tên dịch vụ</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.services.map((s, idx) => (
                    <tr key={s.name}>
                      <td><span className="order-detail-link">{s.name}</span></td>
                      <td>{s.qty}</td>
                      <td>{formatMoney(s.price)}</td>
                      <td>{formatMoney(s.price * s.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 