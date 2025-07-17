"use client";
import React, { useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import "../../../styles/components/orderList.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const orders = [
  { id: "96175515", movie: "Monkey Man Báo Thù", showtime: "20:25 - 22:20", date: "06-05-2024", room: "IMAX - HCinema Aeon Hà Đông", status: "Đã thanh toán", total: 1066000, created: "06-05-2024" },
  { id: "45341960", movie: "Quý Cái!", showtime: "20:10 - 22:00", date: "24-04-2024", room: "GOLD CLASS - HCinema Vincom Royal City", status: "Đã thanh toán", total: 1884000, created: "24-04-2024" },
  { id: "81159823", movie: "SUGA | AGUST D TOUR 'D-DAY' The Movie", showtime: "20:10 - 22:00", date: "24-04-2024", room: "IMAX - HCinema Mac Plaza (Machinco)", status: "Đã thanh toán", total: 454300, created: "24-04-2024" },
  { id: "41709216", movie: "Thanh Xuân 18x2: Lộ Trình Hướng Về Em", showtime: "08:00 - 10:05", date: "19-04-2024", room: "Cinema 1 - HCinema Aeon Hà Đông", status: "Đã thanh toán", total: 1346800, created: "17-04-2024" },
  { id: "82640128", movie: "Godzilla x Kong: Đế Chế Mới", showtime: "20:10 - 22:15", date: "17-04-2024", room: "GOLD CLASS - HCinema Aeon Hà Đông", status: "Đã thanh toán", total: 580000, created: "17-04-2024" },
  { id: "12295234", movie: "Godzilla x Kong: Đế Chế Mới", showtime: "10:25 - 12:30", date: "17-04-2024", room: "Cinema 1 - HCinema Vincom Ocean Park", status: "Đã thanh toán", total: 648000, created: "16-04-2024" },
  { id: "10455176", movie: "Quý Cái!", showtime: "15:10 - 17:00", date: "16-04-2024", room: "GOLD CLASS - HCinema Vincom Royal City", status: "Đã hủy", total: 908000, created: "15-04-2024" },
  { id: "29413292", movie: "Điềm Báo Của Quỷ", showtime: "15:30 - 17:35", date: "15-04-2024", room: "IMAX - HCinema Hà Nội Centerpoint", status: "Đã thanh toán", total: 742000, created: "15-04-2024" },
  { id: "91711636", movie: "Người 'Bạn' Trong Tưởng Tượng", showtime: "12:45 - 14:40", date: "21-04-2024", room: "Cinema 2 - HCinema Vincom Ocean Park", status: "Đã thanh toán", total: 454000, created: "13-04-2024" },
  { id: "23390122", movie: "Godzilla x Kong: Đế Chế Mới", showtime: "20:25 - 22:30", date: "22-04-2024", room: "Cinema 2 - HCinema Aeon Hà Đông", status: "Đã thanh toán", total: 1015000, created: "13-04-2024" },
];

const statusColor: Record<string, string> = {
  "Đã thanh toán": "paid",
  "Đã hủy": "cancelled",
};

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN");
}

export default function OrderListPage() {
  const [page] = useState(1);
  const [orderList, setOrderList] = useState(orders);
  const router = useRouter();
  const statusOptions = ["Đã thanh toán", "Đã hủy", "Chờ xác nhận", "Đã xác nhận"];

  const handleStatusChange = (idx: number, newStatus: string) => {
    setOrderList(list => {
      const updated = [...list];
      updated[idx] = { ...updated[idx], status: newStatus };
      return updated;
    });
  };

  return (
    <div className="order-list-layout">
      <AdminSidebar />
      <main className="order-list-main">
        <div className="order-list-container">
          <div className="order-list-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Danh sách đơn hàng</span>
          </div>
          <div className="order-list-action-bar">
            <button className="order-list-btn refresh">⟳ Refresh</button>
          </div>
          <div className="order-list-table-wrap">
            <table className="order-list-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Tên phim</th>
                  <th>Suất chiếu</th>
                  <th>Phòng chiếu</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                  <th>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map((o, idx) => (
                  <tr key={o.id}>
                    <td className="order-list-link" style={{cursor:'pointer'}} onClick={() => router.push(`/order/detail/${o.id}`)}>{o.id}</td>
                    <td className="order-list-link">{o.movie}</td>
                    <td><span className="order-list-showtime-time time-orange">{o.showtime}</span> <span className="order-list-showtime-date date-green">{o.date}</span></td>
                    <td>{o.room}</td>
                    <td>
                      <select
                        className={`order-list-status ${statusColor[o.status]}`}
                        value={o.status}
                        onChange={e => handleStatusChange(idx, e.target.value)}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td>{formatMoney(o.total)}</td>
                    <td>{o.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="order-list-pagination">
            <button className="order-list-page-btn active">1</button>
            <button className="order-list-page-btn">2</button>
            <button className="order-list-page-btn">3</button>
            <span className="order-list-page-ellipsis">...</span>
            <button className="order-list-page-btn">5</button>
            <select className="order-list-page-size">
              <option>10 / page</option>
              <option>20 / page</option>
              <option>50 / page</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  );
} 