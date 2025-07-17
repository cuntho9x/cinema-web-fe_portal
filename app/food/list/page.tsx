"use client";
import React from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import "../../../styles/components/foodList.scss";
import FoodCreateForm from "../../../components/FoodCreateForm";
import FoodEditForm from "../../../components/FoodEditForm";

const foods = [
  {
    id: 1,
    food_img: "/combo1.png",
    food_name: "Combo 1",
    food_description: "Bắp + 2 nước ngọt",
    food_price: 69000,
  },
  {
    id: 2,
    food_img: "/combo1.png",
    food_name: "Combo 2",
    food_description: "Bắp + 1 nước ngọt",
    food_price: 49000,
  },
  {
    id: 3,
    food_img: "/combo1.png",
    food_name: "Combo 3",
    food_description: "Bắp phô mai + 2 nước ngọt",
    food_price: 79000,
  },
];

export default function FoodListPage() {
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editFood, setEditFood] = React.useState<any | null>(null);
  return (
    <div className="food-list-layout">
      <AdminSidebar />
      <main className="food-list-main">
        <div className="food-list-container">
          <div className="food-list-breadcrumb">Dashboard / Danh sách combo đồ ăn</div>
          <div className="food-list-action-bar">
            <button className="food-list-btn create" onClick={() => setOpenCreate(true)}>+ Thêm combo</button>
            <button className="food-list-btn refresh">⟳ Refresh</button>
          </div>
          <div className="food-list-table-wrap">
            <table className="food-list-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên combo</th>
                  <th>Mô tả</th>
                  <th>Giá</th>
                </tr>
              </thead>
              <tbody>
                {foods.map(f => (
                  <tr key={f.id}>
                    <td>
                      <img src={f.food_img} alt={f.food_name} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }} />
                    </td>
                    <td className="food-list-link" onClick={() => setEditFood(f)}>{f.food_name}</td>
                    <td>{f.food_description}</td>
                    <td style={{ fontWeight: 600, color: "#2196f3" }}>{f.food_price.toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {openCreate && (
        <FoodCreateForm onBack={() => setOpenCreate(false)} />
      )}
      {editFood && (
        <FoodEditForm food={editFood} onBack={() => setEditFood(null)} />
      )}
    </div>
  );
} 