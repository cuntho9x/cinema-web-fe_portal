"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/orderDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

axios.defaults.withCredentials = true;

interface Order {
  order_id: number;
  order_date: string;
  total_price: number;
  discount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  payment_method?: string;
  user: {
    user_id: number;
    full_name: string;
    email: string;
    phone_number?: string;
    address?: string;
  };
  scheduleShowtime: {
    id: number;
    show_date: string;
    start_time: string;
    end_time: string;
    graphics_type: string;
    translation_type: string;
    movie: {
      movie_id: number;
      movie_title: string;
      movie_poster?: string;
      movieGenres?: Array<{
        genre: {
          id: number;
          name: string;
        };
      }>;
    };
    theater: {
      theater_id: number;
      theater_name: string;
      theater_address: string;
    };
    room: {
      room_id: number;
      room_name: string;
      room_type: string;
    };
  };
  tickets: Array<{
    ticket_id: number;
    ticket_code: string;
    price: number;
    status: string;
    seat: {
      seat_code: string;
      seat_type: string;
    };
  }>;
}

const statusMap: { [key: string]: string } = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy",
  COMPLETED: "Đã thanh toán",
};

const seatTypeMap: { [key: string]: string } = {
  STANDARD: "Ghế thường",
  VIP: "Ghế VIP",
  COUPLE: "Ghế đôi",
};

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN");
}

// Parse date from string to avoid timezone issues
function parseDateString(dateStr: string): { day: number; month: number; year: number } {
  // Handle various date formats: "2025-11-07T00:00:00.000Z", "2025-11-07 00:00:00", etc.
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return {
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      day: parseInt(day, 10),
    };
  }
  // Fallback: use UTC methods to avoid timezone issues
  const d = new Date(dateStr);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

function formatDate(dateString: string) {
  const parsed = parseDateString(dateString);
  return `${String(parsed.day).padStart(2, "0")}/${String(parsed.month).padStart(2, "0")}/${parsed.year}`;
}

function formatDateTime(dateString: string) {
  // Parse time directly from string to avoid timezone issues
  const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})[\sT](\d{2}):(\d{2}):(\d{2})/);
  if (match) {
    const [, , , , hour, minute] = match;
    return `${hour}:${minute}`;
  }
  // Fallback: use UTC time
  const date = new Date(dateString);
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:3000/order/detail/${orderId}`);
        setOrder(response.data);
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.response?.data?.message || "Không thể tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-detail-layout">
        <AdminSidebar />
        <main className="order-detail-main">
          <div className="order-detail-container">
            <div className="order-detail-loading">Đang tải chi tiết đơn hàng...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-layout">
        <AdminSidebar />
        <main className="order-detail-main">
          <div className="order-detail-container">
            <div className="order-detail-error">{error || "Không tìm thấy đơn hàng"}</div>
          </div>
        </main>
      </div>
    );
  }

  const showDate = formatDate(order.scheduleShowtime.show_date);
  const showTime = `${formatDateTime(order.scheduleShowtime.start_time)} - ${formatDateTime(order.scheduleShowtime.end_time)}`;
  const finalPrice = order.total_price - order.discount;

  return (
    <div className="order-detail-layout">
      <AdminSidebar />
      <main className="order-detail-main">
        <div className="order-detail-container">
          <div className="order-detail-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
              Dashboard
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-link" onClick={() => router.push("/order/list")} style={{ cursor: "pointer" }}>
              Danh sách đơn hàng
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Đơn hàng {order.order_id}</span>
          </div>
          <button className="order-detail-back-btn" onClick={() => router.back()}>
            &lt; Quay lại
          </button>
          <div className="order-detail-content">
            <div className="order-detail-col">
              <div className="order-detail-title">Thông tin đơn hàng</div>
              <div className="order-detail-row">
                <b>Mã đơn hàng:</b> {order.order_id}
              </div>
              <div className="order-detail-row">
                <b>Phim:</b> <span className="order-detail-link">{order.scheduleShowtime.movie.movie_title}</span>
              </div>
              <div className="order-detail-row">
                <b>Giờ chiếu:</b> <span className="order-detail-showtime time-orange">{showTime}</span>
              </div>
              <div className="order-detail-row">
                <b>Ngày chiếu:</b> {showDate}
              </div>
              <div className="order-detail-row">
                <b>Phòng chiếu:</b> {order.scheduleShowtime.room.room_name} ({order.scheduleShowtime.room.room_type})
              </div>
              <div className="order-detail-row">
                <b>Rạp chiếu:</b> <span className="order-detail-link">{order.scheduleShowtime.theater.theater_name}</span>
              </div>
              <div className="order-detail-row">
                <b>Địa chỉ rạp:</b> {order.scheduleShowtime.theater.theater_address}
              </div>
              <div className="order-detail-row">
                <b>Ngày đặt:</b> {formatDate(order.order_date)}
              </div>
              <div className="order-detail-row">
                <b>Trạng thái:</b>{" "}
                <span className={`order-detail-status status-${order.status.toLowerCase()}`}>
                  {statusMap[order.status] || order.status}
                </span>
              </div>
              {order.payment_method && (
                <div className="order-detail-row">
                  <b>Phương thức thanh toán:</b> {order.payment_method}
                </div>
              )}
            </div>
            <div className="order-detail-col">
              <div className="order-detail-title">Thông tin khách hàng</div>
              <div className="order-detail-row">
                <b>Khách hàng:</b> <span className="order-detail-link">{order.user.full_name}</span>
              </div>
              <div className="order-detail-row">
                <b>Điện thoại:</b> {order.user.phone_number || "N/A"}
              </div>
              <div className="order-detail-row">
                <b>Email:</b> {order.user.email}
              </div>
              {order.user.address && (
                <div className="order-detail-row">
                  <b>Địa chỉ:</b> {order.user.address}
                </div>
              )}
              <div className="order-detail-row">
                <b>Thành tiền:</b> <span className="order-detail-money">{formatMoney(order.total_price)} đ</span>
              </div>
              <div className="order-detail-row">
                <b>Giảm giá:</b> <span className="order-detail-money">{formatMoney(order.discount)} đ</span>
              </div>
              <div className="order-detail-row">
                <b>Tổng tiền:</b> <span className="order-detail-money">{formatMoney(finalPrice)} đ</span>
              </div>
            </div>
            <div className="order-detail-col order-detail-col-wide">
              <div className="order-detail-title">Thông tin vé</div>
              <table className="order-detail-seat-table">
                <thead>
                  <tr>
                    <th>Mã vé</th>
                    <th>Ghế</th>
                    <th>Loại ghế</th>
                    <th>Giá tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {order.tickets.map((ticket) => (
                    <tr key={ticket.ticket_id}>
                      <td>{ticket.ticket_code}</td>
                      <td>{ticket.seat.seat_code}</td>
                      <td>
                        <span className="order-detail-seat-type">{seatTypeMap[ticket.seat.seat_type] || ticket.seat.seat_type}</span>
                      </td>
                      <td>{formatMoney(ticket.price)} đ</td>
                      <td>
                        <span className={`order-detail-status status-${ticket.status.toLowerCase()}`}>
                          {ticket.status}
                        </span>
                      </td>
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
