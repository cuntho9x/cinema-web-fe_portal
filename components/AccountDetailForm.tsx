import React, { useState, useEffect } from "react";
import axios from "axios";

interface User {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string | null;
  gender: string | null;
  address: string | null;
  role: string;
  avatar_img: string | null;
  created_at: string;
}

interface Order {
  order_id: number;
  order_date: string;
  total_price: number;
  scheduleShowtime: {
    movie: {
      movie_title: string;
    };
    theater: {
      theater_name: string;
    };
    room: {
      room_name: string;
    };
  };
  tickets: Array<{
    seat: {
      seat_code: string;
    };
    price: number;
  }>;
}

export default function AccountDetailForm({ user, onBack, onSuccess }: { user: User; onBack: () => void; onSuccess?: () => void }) {
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"info" | "history">("info");
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/account/${user.user_id}`, {
          withCredentials: true,
        });
        setUserDetail(response.data);
        setRole(response.data.role);
      } catch (err: any) {
        console.error('Error fetching user detail:', err);
        setError('Không thể tải thông tin user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [user.user_id]);

  useEffect(() => {
    if (tab === "history") {
      fetchOrders();
    }
  }, [tab, user.user_id]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get(`http://localhost:3000/account/${user.user_id}/orders`, {
        withCredentials: true,
      });
      setOrders(response.data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải lịch sử đơn hàng');
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    try {
      setSaving(true);
      setError(null);
      await axios.put(`http://localhost:3000/account/${user.user_id}`, {
        role: role,
      }, {
        withCredentials: true,
      });
      alert('Cập nhật quyền thành công!');
      if (onSuccess) onSuccess();
      // Refresh user detail
      const response = await axios.get(`http://localhost:3000/account/${user.user_id}`, {
        withCredentials: true,
      });
      setUserDetail(response.data);
      setRole(response.data.role);
    } catch (err: any) {
      console.error('Error updating role:', err);
      setError(err.response?.data?.message || 'Không thể cập nhật quyền');
      alert(err.response?.data?.message || 'Không thể cập nhật quyền');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const getAvatarDisplay = (userData: User | null) => {
    if (userData?.avatar_img) {
      return userData.avatar_img.startsWith('/') ? userData.avatar_img : `/user/${userData.avatar_img}`;
    }
    return null;
  };

  const getGenderDisplay = (gender: string | null) => {
    if (gender === 'male') return 'Nam';
    if (gender === 'female') return 'Nữ';
    return '-';
  };

  const getRoleDisplay = (roleValue: string) => {
    if (roleValue === 'customer') return 'USER';
    if (roleValue === 'admin') return 'ADMIN';
    return roleValue.toUpperCase();
  };

  const displayUser = userDetail || user;
  const avatarUrl = getAvatarDisplay(displayUser);

  return (
    <div className="account-detail-modal-bg" onClick={e => { if (e.target === e.currentTarget) onBack(); }}>
      <form className="account-detail-form" onClick={e => e.stopPropagation()}>
        <button className="account-detail-close" type="button" onClick={onBack}>×</button>
        <div className="account-detail-breadcrumb">
          Dashboard / Danh sách user / <b>{displayUser.full_name}</b>
        </div>
        <div className="account-detail-tabs">
          <span className={tab === "info" ? "active" : ""} onClick={() => setTab("info")}>Thông tin user</span>
          <span className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>Lịch sử đơn hàng</span>
        </div>
        {error && (
          <div className="account-detail-error">{error}</div>
        )}
        {loading && tab === "info" ? (
          <div className="account-detail-loading">Đang tải...</div>
        ) : tab === "info" ? (
          <>
            <div className="account-detail-avatar-wrap">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayUser.full_name} className="account-detail-avatar-img" />
              ) : (
                <div className="account-detail-avatar">{displayUser.full_name[0]?.toUpperCase()}</div>
              )}
            </div>
            <label>Họ và tên</label>
            <input 
              name="full_name" 
              value={displayUser.full_name} 
              className="account-detail-input" 
              disabled 
            />
            <label>Email</label>
            <input 
              name="email" 
              value={displayUser.email} 
              className="account-detail-input" 
              disabled 
            />
            <label>Số điện thoại</label>
            <input 
              name="phone_number" 
              value={displayUser.phone_number || ''} 
              className="account-detail-input" 
              disabled 
            />
            <label>Giới tính</label>
            <input 
              name="gender" 
              value={getGenderDisplay(displayUser.gender)} 
              className="account-detail-input" 
              disabled 
            />
            <label>Địa chỉ</label>
            <input 
              name="address" 
              value={displayUser.address || ''} 
              className="account-detail-input" 
              disabled 
            />
            <label>Quyền <span style={{ color: '#f44336' }}>*</span></label>
            <select 
              name="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="account-detail-input"
              disabled={saving}
            >
              <option value="customer">USER</option>
              <option value="admin">ADMIN</option>
            </select>
            <div className="account-detail-action-bar">
              <button 
                type="button" 
                className="account-detail-btn update" 
                onClick={handleUpdateRole}
                disabled={saving || role === displayUser.role}
              >
                {saving ? "Đang cập nhật..." : "Cập nhật quyền"}
              </button>
            </div>
          </>
        ) : (
          <div className="account-detail-tab-content">
            {ordersLoading ? (
              <div className="account-detail-loading">Đang tải lịch sử đơn hàng...</div>
            ) : orders.length > 0 ? (
              <table className="account-history-table">
                <thead>
                  <tr>
                    <th>ID Order</th>
                    <th>Phim</th>
                    <th>Rạp</th>
                    <th>Phòng</th>
                    <th>Ghế</th>
                    <th>Ngày đặt</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const seats = order.tickets.map(t => t.seat.seat_code).join(', ');
                    const totalPrice = order.tickets.reduce((sum, t) => sum + t.price, 0);
                    return (
                      <tr key={order.order_id}>
                        <td>{order.order_id}</td>
                        <td>{order.scheduleShowtime.movie.movie_title}</td>
                        <td>{order.scheduleShowtime.theater.theater_name}</td>
                        <td>{order.scheduleShowtime.room.room_name}</td>
                        <td>{seats || '-'}</td>
                        <td>{formatDateTime(order.order_date)}</td>
                        <td>{formatMoney(totalPrice)} đ</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Không có đơn hàng nào
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
