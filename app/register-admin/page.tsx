"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import "@/styles/components/register-admin.scss";
import { useRouter } from "next/navigation";

export default function RegisterAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    try {
      const response = await axios.post("http://localhost:3000/auth/register-admin", {
        email,
        full_name: fullName,
        password,
        gender,
        phone_number: phoneNumber,
        birthday,
        address,
      });

      setSuccess("Đăng ký admin thành công!");
      setError("");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      setSuccess("");
    }
  };

  return (
    <div className="register-admin-wrapper">
      <div className="background-image">
        <Image src="/banner/login.jpg" alt="Background" fill priority />
      </div>
      <div className="register-admin-card">
        <h2>Đăng ký tài khoản Admin</h2>
        <p>Tạo tài khoản quản trị viên mới</p>

        <form autoComplete="off" onSubmit={handleRegister}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            type="text"
            name="full_name"
            placeholder="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <div className="form-row">
            <select 
              name="gender"
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
              autoComplete="off"
              required
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>

            <input
              type="tel"
              name="phone_number"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <input
            type="date"
            name="birthday"
            placeholder="Ngày sinh"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="off"
            required
          />

          <button type="submit">Đăng ký Admin</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="links">
          <a href="/login">Đã có tài khoản? Đăng nhập</a>
        </div>
      </div>
    </div>
  );
}
