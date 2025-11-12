"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/accountList.scss";
import AccountDetailForm from "@/components/AccountDetailForm";
import axios from "axios";

interface User {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string | null;
  role: string;
  avatar_img: string | null;
  created_at: string;
}

export default function AccountListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN" | "customer">("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/account/all', {
        withCredentials: true,
      });
      setUsers(response.data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Không thể tải danh sách user');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    if (roleFilter === "ALL") return true;
    // Map role values: 'customer' -> 'USER', 'admin' -> 'ADMIN'
    const userRole = u.role === 'customer' ? 'USER' : u.role === 'admin' ? 'ADMIN' : u.role.toUpperCase();
    return userRole === roleFilter;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getAvatarDisplay = (user: User) => {
    if (user.avatar_img) {
      return user.avatar_img.startsWith('/') ? user.avatar_img : `/user/${user.avatar_img}`;
    }
    return null;
  };

  const getRoleDisplay = (role: string) => {
    if (role === 'customer') return 'USER';
    if (role === 'admin') return 'ADMIN';
    return role.toUpperCase();
  };
  return (
    <div className="account-list-layout">
      <AdminSidebar />
      <main className="account-list-main">
        <div className="account-list-container">
          <div className="account-list-breadcrumb">Dashboard / Danh sách user</div>
          <div className="account-list-action-bar">
            <button className="account-list-btn refresh" onClick={fetchUsers}>⟳ Refresh</button>
            <select className="account-list-role-filter" value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)}>
              <option value="ALL">Tất cả</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {error && (
            <div className="account-list-error">{error}</div>
          )}
          {loading ? (
            <div className="account-list-loading">Đang tải...</div>
          ) : (
            <div className="account-list-table-wrap">
              <div className="account-list-table-body">
                <table className="account-list-table">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Quyền</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(u => {
                        const avatarUrl = getAvatarDisplay(u);
                        return (
                          <tr key={u.user_id}>
                            <td>
                              {avatarUrl ? (
                                <img src={avatarUrl} alt={u.full_name} className="account-avatar-img" />
                              ) : (
                                <div className="account-avatar">{u.full_name[0]?.toUpperCase()}</div>
                              )}
                            </td>
                            <td className="account-link" onClick={() => setSelectedUser(u)}>{u.full_name}</td>
                            <td>{u.email}</td>
                            <td>{u.phone_number || '-'}</td>
                            <td>
                              <span className={`account-role ${getRoleDisplay(u.role) === "ADMIN" ? "admin" : "user"}`}>
                                {getRoleDisplay(u.role)}
                              </span>
                            </td>
                            <td>{formatDate(u.created_at)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                          Không có user nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      {selectedUser && (
        <AccountDetailForm user={selectedUser} onBack={() => setSelectedUser(null)} onSuccess={fetchUsers} />
      )}
    </div>
  );
} 