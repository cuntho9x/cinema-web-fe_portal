"use client";
import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/accountList.scss";
import AccountDetailForm from "@/components/AccountDetailForm";
import AccountCreateForm from "@/components/AccountCreateForm";

const users = [
  { id: 1, name: "Phạm Đình Tiến", email: "phamdinhthien@gmail.com", phone: "0709732310", role: "USER", status: "Kích hoạt", created: "13-04-2024" },
  { id: 2, name: "Phan Hải Tiến", email: "phanhaitien@gmail.com", phone: "0866793860", role: "USER", status: "Kích hoạt", created: "13-04-2024" },
  { id: 3, name: "Mai Đạt Thiên", email: "maidatthien@gmail.com", phone: "0700990728", role: "ADMIN", status: "Kích hoạt", created: "13-04-2024" },
  { id: 4, name: "Tăng Vũ Phúc", email: "tangvuphuc@gmail.com", phone: "0352137182", role: "USER", status: "Kích hoạt", created: "13-04-2024" },
  { id: 5, name: "Trịnh Đạt Yên", email: "trinhdatyen@gmail.com", phone: "0569526127", role: "USER", status: "Kích hoạt", created: "13-04-2024" },
  { id: 6, name: "Huỳnh Dương Vinh", email: "huynhduongvinh@gmail.com", phone: "0810531212", role: "USER", status: "Kích hoạt", created: "13-04-2024" },
  { id: 7, name: "Đỗ Đức Hùng", email: "doduchung@gmail.com", phone: "0326533366", role: "ADMIN", status: "Kích hoạt", created: "13-04-2024" },
];

export default function AccountListPage() {
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL");
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const filteredUsers = users.filter(u => roleFilter === "ALL" || u.role === roleFilter);
  return (
    <div className="account-list-layout">
      <AdminSidebar />
      <main className="account-list-main">
        <div className="account-list-container">
          <div className="account-list-breadcrumb">Dashboard / Danh sách user</div>
          <div className="account-list-action-bar">
            <button className="account-list-btn create" onClick={() => setOpenCreate(true)}>+ Tạo user</button>
            <button className="account-list-btn refresh">⟳ Refresh</button>
            <select className="account-list-role-filter" value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)}>
              <option value="ALL">Tất cả</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="account-list-table-wrap">
            <table className="account-list-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Quyền</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="account-avatar">{u.name[0]}</div>
                    </td>
                    <td className="account-link" onClick={() => setSelectedUser(u)}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      <span className={`account-role ${u.role === "ADMIN" ? "admin" : "user"}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className="account-status">{u.status}</span>
                    </td>
                    <td>{u.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {openCreate && (
        <AccountCreateForm onBack={() => setOpenCreate(false)} />
      )}
      {selectedUser && (
        <AccountDetailForm user={selectedUser} onBack={() => setSelectedUser(null)} />
      )}
    </div>
  );
} 