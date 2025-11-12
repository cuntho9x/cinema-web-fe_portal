"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/cinemaUpdate.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface Theater {
  theater_id: number;
  theater_name: string;
  theater_address: string;
  theater_phoneNumber: string;
  theater_title_url: string;
  map_url: string;
}

export default function CinemaUpdatePage() {
  const params = useParams();
  const router = useRouter();
  const theaterId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theater, setTheater] = useState<Theater | null>(null);
  
  // Form state
  const [theaterName, setTheaterName] = useState("");
  const [theaterAddress, setTheaterAddress] = useState("");
  const [theaterPhoneNumber, setTheaterPhoneNumber] = useState("");
  const [theaterTitleUrl, setTheaterTitleUrl] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/theaters/id/${theaterId}`, {
          withCredentials: true,
        });
        const theaterData = response.data;
        setTheater(theaterData);
        
        // Set form values
        setTheaterName(theaterData.theater_name || "");
        setTheaterAddress(theaterData.theater_address || "");
        setTheaterPhoneNumber(theaterData.theater_phoneNumber || "");
        setTheaterTitleUrl(theaterData.theater_title_url || "");
        setMapUrl(theaterData.map_url || "");
        
      } catch (err: any) {
        console.error("Error fetching theater:", err);
        if (err.response?.status === 404) {
          setError(`Không tìm thấy rạp chiếu với ID: ${theaterId}. Có thể rạp đã bị xóa hoặc ID không đúng.`);
        } else {
          setError(err.response?.data?.message || err.message || "Không thể tải dữ liệu rạp chiếu");
        }
      } finally {
        setLoading(false);
      }
    };

    if (theaterId) {
      fetchData();
    }
  }, [theaterId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!theaterName || !theaterAddress || !theaterPhoneNumber || !theaterTitleUrl || !mapUrl) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const updateData = {
        theater_name: theaterName,
        theater_address: theaterAddress,
        theater_phoneNumber: theaterPhoneNumber,
        theater_title_url: theaterTitleUrl,
        map_url: mapUrl,
      };
      
      await axios.patch(`http://localhost:3000/theaters/id/${theaterId}`, updateData, {
        withCredentials: true,
      });
      
      alert("Cập nhật rạp chiếu thành công!");
      router.push("/cinema/list");
    } catch (err: any) {
      console.error("Error updating theater:", err);
      setError(err.response?.data?.message || "Không thể cập nhật rạp chiếu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa rạp chiếu này?")) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:3000/theaters/id/${theaterId}`, {
        withCredentials: true,
      });
      alert("Xóa rạp chiếu thành công!");
      router.push("/cinema/list");
    } catch (err: any) {
      console.error("Error deleting theater:", err);
      setError(err.response?.data?.message || "Không thể xóa rạp chiếu");
    }
  };

  if (loading) {
    return (
      <div className="cinema-update-layout">
        <AdminSidebar />
        <main className="cinema-update-main">
          <div className="cinema-update-container">
            <div style={{ padding: "20px", textAlign: "center" }}>Đang tải...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !theater) {
    return (
      <div className="cinema-update-layout">
        <AdminSidebar />
        <main className="cinema-update-main">
          <div className="cinema-update-container">
            <div style={{ padding: "20px", textAlign: "center", color: "red" }}>{error}</div>
            <Link href="/cinema/list" className="cinema-update-btn back">&lt; Quay lại</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cinema-update-layout">
      <AdminSidebar />
      <main className="cinema-update-main">
        <div className="cinema-update-container">
          <div className="cinema-update-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <Link href="/cinema/list" className="breadcrumb-link">Danh sách rạp chiếu</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{theaterName || "Cập nhật rạp chiếu"}</span>
          </div>
          {error && (
            <div style={{ padding: "10px", margin: "10px", background: "#ffebee", color: "#c62828", borderRadius: "4px" }}>
              {error}
            </div>
          )}
          <div className="cinema-update-action-bar">
            <Link href="/cinema/list" className="cinema-update-btn back">&lt; Quay lại</Link>
            <button className="cinema-update-btn update" onClick={handleUpdate} disabled={saving}>
              {saving ? "Đang lưu..." : "Cập nhật"}
            </button>
            <button className="cinema-update-btn delete" onClick={handleDelete} disabled={saving}>
              Xóa rạp chiếu
            </button>
          </div>
          <div className="cinema-update-form-row">
            <form className="cinema-update-form" onSubmit={handleUpdate}>
              <label className="cinema-update-label required">Tên rạp chiếu</label>
              <input 
                className="cinema-update-input" 
                value={theaterName}
                onChange={(e) => setTheaterName(e.target.value)}
                required
              />
              <label className="cinema-update-label required">Địa chỉ</label>
              <textarea 
                className="cinema-update-input" 
                rows={2}
                value={theaterAddress}
                onChange={(e) => setTheaterAddress(e.target.value)}
                required
              />
              <label className="cinema-update-label required">Số điện thoại</label>
              <input 
                className="cinema-update-input" 
                value={theaterPhoneNumber}
                onChange={(e) => setTheaterPhoneNumber(e.target.value)}
                required
              />
              <label className="cinema-update-label required">URL slug</label>
              <input 
                className="cinema-update-input" 
                value={theaterTitleUrl}
                onChange={(e) => setTheaterTitleUrl(e.target.value)}
                required
              />
              <label className="cinema-update-label required">Địa chỉ map</label>
              <textarea 
                className="cinema-update-input" 
                rows={3}
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                required
              />
            </form>
            <div className="cinema-update-map-box">
              {mapUrl ? (
              <iframe
                  src={mapUrl}
                width="100%"
                height="320"
                style={{ border: 0, borderRadius: 8, width: '100%', height: '320px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '320px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: '#f5f5f5',
                  borderRadius: 8,
                  color: '#999'
                }}>
                  Nhập URL map để xem preview
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
