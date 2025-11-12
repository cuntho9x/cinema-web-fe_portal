"use client";

import React, { useState, useEffect } from "react";
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

  // Kiểm tra nếu đã đăng nhập với role customer thì clear cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userRes = await axios.get("http://localhost:3000/auth/me", {
          withCredentials: true,
        });
        
        // Nếu là customer thì clear cookie và yêu cầu đăng nhập lại
        if (userRes.data?.role === "customer") {
          await axios.post("http://localhost:3000/auth/logout", null, {
            withCredentials: true,
          });
          document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          localStorage.removeItem("user");
        } else if (userRes.data?.role === "admin") {
          // Nếu là admin thì redirect về trang chủ
          router.push("/");
        }
      } catch (err) {
        // Không có token hoặc token không hợp lệ, không làm gì
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email: emailOrPhone,
        password,
      }, {
        withCredentials: true,
      });
  
      const token = res.data.access_token;
      const decoded: any = jwtDecode(token);
  
      if (decoded.role !== "admin") {
        // Nếu không phải admin thì clear cookie và báo lỗi
        await axios.post("http://localhost:3000/auth/logout", null, {
          withCredentials: true,
        });
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setError("Chỉ tài khoản admin mới được đăng nhập.");
        return;
      }
  
      // Gọi /auth/me để lấy thông tin user và lưu vào localStorage
      const userRes = await axios.get("http://localhost:3000/auth/me", {
        withCredentials: true,
      });
      
      localStorage.setItem("user", JSON.stringify(userRes.data));
  
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
        <Image src="/banner/login.jpg" alt="Background" fill priority />
      </div>

      <div className="login-card">
        <h2>Đăng Nhập Tài Khoản</h2>
        <p>Chào mừng bạn quay lại!</p>

        <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <input
            type="text"
            placeholder="Email hoặc số điện thoại"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            autoComplete="off"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Đăng nhập</button>
        </form>

        <div className="links">
          <a href="#">Quên mật khẩu?</a>
          <a href="/register-admin">Tạo tài khoản</a>
        </div>
      </div>
    </div>
  );
}
