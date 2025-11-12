"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/orderList.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import axios from "axios";

axios.defaults.withCredentials = true;

interface Theater {
  theater_id: number;
  theater_name: string;
}

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
  };
  scheduleShowtime: {
    id: number;
    show_date: string;
    start_time: string;
    end_time: string;
    movie: {
      movie_id: number;
      movie_title: string;
      movie_poster?: string;
    };
    theater: {
      theater_id: number;
      theater_name: string;
    };
    room: {
      room_id: number;
      room_name: string;
      room_type: string;
    };
  };
  tickets: Array<{
    ticket_id: number;
    price: number;
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

const statusOptions: Array<{ value: string; label: string }> = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "COMPLETED", label: "Đã thanh toán" },
];

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

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTheaterId, setSelectedTheaterId] = useState<string>("");
  const [selectedOrderDate, setSelectedOrderDate] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const router = useRouter();

  // Fetch theaters
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await axios.get("http://localhost:3000/theaters");
        setTheaters(response.data);
      } catch (err) {
        console.error("Error fetching theaters:", err);
      }
    };
    fetchTheaters();
  }, []);

  // Fetch orders with filters
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (selectedTheaterId) {
        params.append("theaterId", selectedTheaterId);
      }
      if (selectedOrderDate) {
        params.append("orderDate", selectedOrderDate);
      }
      const url = `http://localhost:3000/order/all${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await axios.get(url);
      setOrders(response.data);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedTheaterId, selectedOrderDate]);

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      await axios.patch(`http://localhost:3000/order/status/${orderId}`, {
        status: newStatus,
      });
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus as any } : order
        )
      );
    } catch (err: any) {
      console.error("Error updating order status:", err);
      alert(err.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleClearFilters = () => {
    setSelectedTheaterId("");
    setSelectedOrderDate("");
  };

  if (loading && orders.length === 0) {
    return (
      <div className="order-list-layout">
        <AdminSidebar />
        <main className="order-list-main">
          <div className="order-list-container">
            <div className="order-list-loading">Đang tải danh sách đơn hàng...</div>
          </div>
        </main>
      </div>
    );
  }

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

          {/* Filter Bar */}
          <div className="order-list-filter-bar">
            <div className="filter-group">
              <label>Rạp chiếu</label>
              <select
                className="order-list-filter-select"
                value={selectedTheaterId}
                onChange={(e) => setSelectedTheaterId(e.target.value)}
              >
                <option value="">Tất cả rạp</option>
                {theaters.map((theater) => (
                  <option key={theater.theater_id} value={theater.theater_id}>
                    {theater.theater_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Ngày đặt</label>
              <input
                type="date"
                className="order-list-filter-input"
                value={selectedOrderDate}
                onChange={(e) => setSelectedOrderDate(e.target.value)}
              />
            </div>

            <button className="order-list-filter-clear-btn" onClick={handleClearFilters}>
              Xóa bộ lọc
            </button>

            <button className="order-list-btn refresh" onClick={handleRefresh}>
              ⟳ Refresh
            </button>
          </div>

          {error && <div className="order-list-error">{error}</div>}

          {orders.length === 0 ? (
            <div className="order-list-empty">Không có đơn hàng nào</div>
          ) : (
            <>
              <div className="order-list-table-wrap">
                <div className="order-list-table-body">
                  <table className="order-list-table">
                    <thead>
                      <tr>
                        <th>Mã đơn hàng</th>
                        <th>Tên phim</th>
                        <th>Suất chiếu</th>
                        <th>Phòng chiếu - Rạp chiếu</th>
                        <th>Trạng thái</th>
                        <th>Tổng tiền</th>
                        <th>Ngày đặt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const showDate = formatDate(order.scheduleShowtime.show_date);
                        const showTime = `${formatDateTime(order.scheduleShowtime.start_time)} - ${formatDateTime(order.scheduleShowtime.end_time)}`;
                        const roomInfo = `${order.scheduleShowtime.room.room_name} - ${order.scheduleShowtime.theater.theater_name}`;
                        const finalPrice = order.total_price - order.discount;
                        const isUpdating = updatingStatus === order.order_id;

                        return (
                          <tr key={order.order_id}>
                            <td>
                              <span
                                className="order-list-link"
                                style={{ cursor: "pointer" }}
                                onClick={() => router.push(`/order/detail/${order.order_id}`)}
                              >
                                {order.order_id}
                              </span>
                            </td>
                            <td className="order-list-link">{order.scheduleShowtime.movie.movie_title}</td>
                            <td>
                              <span className="order-list-showtime-time time-orange">{showTime}</span>{" "}
                              <span className="order-list-showtime-date date-green">{showDate}</span>
                            </td>
                            <td>{roomInfo}</td>
                            <td>
                              <select
                                className={`order-list-status-select status-${order.status.toLowerCase()}`}
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                disabled={isUpdating}
                              >
                                {statusOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              {isUpdating && <span className="order-list-updating">Đang cập nhật...</span>}
                            </td>
                            <td>{formatMoney(finalPrice)} đ</td>
                            <td>{formatDate(order.order_date)}</td>
                          </tr>
                        );
                      })}
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
