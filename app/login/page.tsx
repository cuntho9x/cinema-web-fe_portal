"use client";

import React from "react";
import "@/styles/components/login.scss"; // ✅ import toàn cục
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="login-wrapper">
      {/* Nền ảnh */}
      <div className="background-image">
        <Image src="/login.jpg" alt="Background" fill priority />
      </div>

      {/* Form đăng nhập */}
      <div className="login-card">
        <h2>Đăng Nhập Tài Khoản</h2>
        <p>Chào mừng bạn quay lại!</p>
        <input type="text" placeholder="Email hoặc số điện thoại" />
        <input type="password" placeholder="Mật khẩu" />
        <button>Đăng nhập</button>

        <div className="links">
          <a href="#">Quên mật khẩu?</a>
          <a href="#">Tạo tài khoản</a>
        </div>
      </div>
    </div>
  );
}
