"use client";
import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/cinemaCreate.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

export default function CinemaCreatePage() {
  return (
    <div className="cinema-create-layout">
      <AdminSidebar />
      <main className="cinema-create-main">
        <div className="cinema-create-container">
          <div className="cinema-create-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-link">Danh sách rạp chiếu</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Tạo rạp chiếu</span>
          </div>
          <div className="cinema-create-action-bar">
            <Link href="/cinema/list" className="cinema-create-btn back">&lt; Quay lại</Link>
            <button className="cinema-create-btn create">+ Tạo rạp chiếu</button>
          </div>
          <form className="cinema-create-form">
            <label className="cinema-create-label required">Tên rạp chiếu</label>
            <input className="cinema-create-input" placeholder="Enter name" />
            <label className="cinema-create-label required">Địa chỉ</label>
            <textarea className="cinema-create-input" placeholder="Enter address" rows={2} />
            <label className="cinema-create-label required">Địa chỉ map</label>
            <textarea className="cinema-create-input" placeholder="Enter map location" rows={2} />
          </form>
        </div>
      </main>
    </div>
  );
} 