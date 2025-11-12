"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/foodList.scss";
import FoodCreateForm from "@/components/FoodCreateForm";
import FoodEditForm from "@/components/FoodEditForm";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

interface Food {
  food_id: number;
  food_img: string | null;
  food_name: string;
  food_description: string | null;
  food_price: number;
}

export default function FoodListPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editFood, setEditFood] = useState<Food | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Food[]>("http://localhost:3000/food", {
        withCredentials: true,
      });
      setFoods(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error("Error fetching foods:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách combo");
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleDelete = async (foodId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa combo này?")) {
      return;
    }

    try {
      setDeletingId(foodId);
      await axios.delete(`http://localhost:3000/food/${foodId}`, {
        withCredentials: true,
      });
      alert("Xóa combo thành công!");
      fetchFoods();
    } catch (err: any) {
      console.error("Error deleting food:", err);
      alert(err.response?.data?.message || "Không thể xóa combo");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    fetchFoods();
  };

  const handleCreateSuccess = () => {
    setOpenCreate(false);
    fetchFoods();
  };

  const handleEditSuccess = () => {
    setEditFood(null);
    fetchFoods();
  };

  return (
    <div className="food-list-layout">
      <AdminSidebar />
      <main className="food-list-main">
        <div className="food-list-container">
          <div className="food-list-breadcrumb">Dashboard / Danh sách combo đồ ăn</div>
          <div className="food-list-action-bar">
            <button className="food-list-btn create" onClick={() => setOpenCreate(true)}>
              <FontAwesomeIcon icon={faPlus} />
              Thêm combo
            </button>
            <button className="food-list-btn refresh" onClick={handleRefresh}>⟳ Refresh</button>
          </div>
          {error && (
            <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px" }}>
              {error}
            </div>
          )}
          {loading ? (
            <div style={{ padding: "24px", textAlign: "center" }}>Đang tải...</div>
          ) : (
            <div className="food-list-table-wrap">
              <div className="food-list-table-body">
                <table className="food-list-table">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Tên combo</th>
                      <th>Mô tả</th>
                      <th>Giá</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                  {foods.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "24px" }}>
                        Không có combo nào
                      </td>
                    </tr>
                  ) : (
                    foods.map(f => (
                      <tr key={f.food_id}>
                        <td>
                          {f.food_img ? (
                            <img 
                              src={f.food_img.startsWith('/') ? f.food_img : `/catalog/${f.food_img}`} 
                              alt={f.food_name} 
                              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }} 
                            />
                          ) : (
                            <div style={{ width: 60, height: 60, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                              No Image
                            </div>
                          )}
                        </td>
                        <td>{f.food_name}</td>
                        <td>{f.food_description || "-"}</td>
                        <td style={{ fontWeight: 600, color: "#2196f3" }}>{Number(f.food_price).toLocaleString('vi-VN')}đ</td>
                        <td>
                          <button 
                            className="food-action-btn edit" 
                            title="Sửa" 
                            onClick={() => setEditFood(f)}
                            disabled={deletingId === f.food_id}
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button 
                            className="food-action-btn delete" 
                            title="Xóa"
                            onClick={() => handleDelete(f.food_id)}
                            disabled={deletingId === f.food_id}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      {openCreate && (
        <FoodCreateForm onBack={() => setOpenCreate(false)} onSuccess={handleCreateSuccess} />
      )}
      {editFood && (
        <FoodEditForm food={editFood} onBack={() => setEditFood(null)} onSuccess={handleEditSuccess} />
      )}
    </div>
  );
} 