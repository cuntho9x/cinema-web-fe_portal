"use client";
import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/cinemaCreate.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CinemaCreatePage() {
  const router = useRouter();
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [theaterName, setTheaterName] = useState("");
  const [theaterAddress, setTheaterAddress] = useState("");
  const [theaterPhoneNumber, setTheaterPhoneNumber] = useState("");
  const [theaterTitleUrl, setTheaterTitleUrl] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!theaterName || !theaterAddress || !theaterPhoneNumber || !theaterTitleUrl || !mapUrl) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const createData = {
        theater_name: theaterName,
        theater_address: theaterAddress,
        theater_phoneNumber: theaterPhoneNumber,
        theater_title_url: theaterTitleUrl,
        map_url: mapUrl,
      };
      
      await axios.post('http://localhost:3000/theaters', createData, {
        withCredentials: true,
      });
      
      alert("Tạo rạp chiếu thành công!");
      router.push("/cinema/list");
    } catch (err: any) {
      console.error("Error creating theater:", err);
      setError(err.response?.data?.message || "Không thể tạo rạp chiếu");
      alert(err.response?.data?.message || "Không thể tạo rạp chiếu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cinema-create-layout">
      <AdminSidebar />
      <main className="cinema-create-main">
        <div className="cinema-create-container">
          <div className="cinema-create-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <Link href="/cinema/list" className="breadcrumb-link">Danh sách rạp chiếu</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Tạo rạp chiếu</span>
          </div>
          {error && (
            <div className="cinema-create-error">
              {error}
            </div>
          )}
          <div className="cinema-create-action-bar">
            <Link href="/cinema/list" className="cinema-create-btn back">&lt; Quay lại</Link>
            <button className="cinema-create-btn create" onClick={handleCreate} disabled={saving}>
              {saving ? "Đang tạo..." : "+ Tạo rạp chiếu"}
            </button>
          </div>
          <form className="cinema-create-form" onSubmit={handleCreate}>
            <label className="cinema-create-label required">Tên rạp chiếu</label>
            <input 
              className="cinema-create-input" 
              placeholder="Nhập tên rạp chiếu"
              value={theaterName}
              onChange={(e) => setTheaterName(e.target.value)}
              required
            />
            <label className="cinema-create-label required">Địa chỉ</label>
            <textarea 
              className="cinema-create-input" 
              placeholder="Nhập địa chỉ rạp chiếu"
              rows={2}
              value={theaterAddress}
              onChange={(e) => setTheaterAddress(e.target.value)}
              required
            />
            <label className="cinema-create-label required">Số điện thoại</label>
            <input 
              className="cinema-create-input" 
              placeholder="Nhập số điện thoại"
              value={theaterPhoneNumber}
              onChange={(e) => setTheaterPhoneNumber(e.target.value)}
              required
            />
            <label className="cinema-create-label required">URL slug</label>
            <input 
              className="cinema-create-input" 
              placeholder="Nhập URL slug (ví dụ: rap-chieu-1)"
              value={theaterTitleUrl}
              onChange={(e) => setTheaterTitleUrl(e.target.value)}
              required
            />
            <label className="cinema-create-label required">Địa chỉ map</label>
            <textarea 
              className="cinema-create-input" 
              placeholder="Nhập URL Google Maps embed hoặc tọa độ"
              rows={3}
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              required
            />
            {mapUrl && (
              <div className="cinema-create-map-preview">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="320"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map Preview"
                />
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
