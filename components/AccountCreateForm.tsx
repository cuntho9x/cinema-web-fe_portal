import React, { useState } from "react";

export default function AccountCreateForm({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "USER",
    status: "Hoạt động",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mock: log ra console
    console.log("Tạo user:", form);
  };

  return (
    <div className="account-detail-modal-bg" onClick={e => { if (e.target === e.currentTarget) onBack(); }}>
      <form className="account-detail-form" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <button className="account-detail-close" type="button" onClick={onBack}>×</button>
        <div className="account-detail-breadcrumb">
          Dashboard / Danh sách user / <b>Tạo user</b>
        </div>
        <div className="account-detail-action-bar">
          <button type="submit" className="account-detail-btn update">Tạo user</button>
        </div>
        <label>* Họ tên</label>
        <input name="name" value={form.name} onChange={handleChange} className="account-detail-input" required />
        <label>* Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="account-detail-input" required />
        <label>* Số điện thoại</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="account-detail-input" required />
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
          <div className="account-detail-avatar">{form.name ? form.name[0] : "?"}</div>
        </div>
        <button type="button" className="account-detail-btn avatar">Thay đổi ảnh đại diện</button>
      </form>
    </div>
  );
} 