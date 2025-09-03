"use client";

import React, { useState } from "react";
import "@/styles/components/login.scss";
import Image from "next/image";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

export default function LoginPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email: emailOrPhone,
        password,
      });
  
      const token = res.data.access_token;
      const decoded: any = jwtDecode(token);
  
      if (decoded.role !== "admin") {
        setError("Chỉ tài khoản admin mới được đăng nhập.");
        return;
      }
  
      // Ghi cookie (hoặc localStorage tuỳ cách bạn fetch ở FE)
      document.cookie = `token=${token}; path=/`;
  
      // Cập nhật user hiện tại dùng SWR
      mutate('/auth/me'); // gọi lại API lấy thông tin user
  
      // Chuyển về trang chính
      router.push("/");
    } catch (err: any) {
      setError("Email hoặc mật khẩu không đúng.");
    }
  };
  

  return (
    <div className="login-wrapper">
      <div className="background-image">
        <Image src="/login.jpg" alt="Background" fill priority />
      </div>

      <div className="login-card">
        <h2>Đăng Nhập Tài Khoản</h2>
        <p>Chào mừng bạn quay lại!</p>
        <input
          type="text"
          placeholder="Email hoặc số điện thoại"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Đăng nhập</button>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <div className="links">
          <a href="#">Quên mật khẩu?</a>
          <a href="#">Tạo tài khoản</a>
        </div>
      </div>
    </div>
  );
}
