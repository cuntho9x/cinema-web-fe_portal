import React, { useState } from "react";

export default function AccountDetailForm({ user, onBack }: { user: any, onBack: () => void }) {
  const [form, setForm] = useState(user);
  const [tab, setTab] = useState<"info" | "history">("info");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f: typeof user) => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div className="account-detail-modal-bg" onClick={e => { if (e.target === e.currentTarget) onBack(); }}>
      <form className="account-detail-form" onClick={e => e.stopPropagation()}>
        <button className="account-detail-close" type="button" onClick={onBack}>×</button>
        <div className="account-detail-breadcrumb">
          Dashboard / Danh sách user / <b>{form.name}</b>
        </div>
        <div className="account-detail-tabs">
          <span className={tab === "info" ? "active" : ""} onClick={() => setTab("info")}>Thông tin user</span>
          <span className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>Lịch sử đặt vé</span>
        </div>
        <div className="account-detail-action-bar">
          <button type="button" className="account-detail-btn update">Cập nhật</button>
          <button type="button" className="account-detail-btn reset">Reset mật khẩu</button>
        </div>
        {tab === "info" ? (
          <>
            <label>* Họ tên</label>
            <input name="name" value={form.name} onChange={handleChange} className="account-detail-input" />
            <label>* Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="account-detail-input" disabled />
            <label>* Số điện thoại</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="account-detail-input" />
            <label>* Quyền</label>
            <select name="role" value={form.role} onChange={handleChange} className="account-detail-input">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <label>* Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange} className="account-detail-input">
              <option value="Hoạt động">Hoạt động</option>
              <option value="Không hoạt động">Không hoạt động</option>
            </select>
            <div className="account-detail-avatar-wrap">
              <div className="account-detail-avatar">{form.name[0]}</div>
            </div>
            <button type="button" className="account-detail-btn avatar">Thay đổi ảnh đại diện</button>
          </>
        ) : (
          <div>
            <table className="account-history-table">
              <thead>
                <tr>
                  <th>Mã vé</th>
                  <th>Phim</th>
                  <th>Rạp</th>
                  <th>Phòng</th>
                  <th>Ghế</th>
                  <th>Ngày giờ</th>
                  <th>Giá</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>123456</td>
                  <td>Monkey Man Báo Thù</td>
                  <td>CGV Vincom</td>
                  <td>Room 1</td>
                  <td>D5, D6</td>
                  <td>13-04-2024 19:00</td>
                  <td>180.000đ</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </form>
    </div>
  );
} 