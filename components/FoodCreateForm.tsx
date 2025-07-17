import React, { useState } from "react";

export default function FoodCreateForm({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({
    food_img: null as File | null,
    food_img_preview: "",
    food_name: "",
    food_description: "",
    food_price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, food_img: file, food_img_preview: URL.createObjectURL(file) }));
    } else {
      setForm(f => ({ ...f, food_img: null, food_img_preview: "" }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mock: log ra console
    console.log("Tạo combo:", form);
  };
  return (
    <div className="food-create-modal-bg" onClick={e => { if (e.target === e.currentTarget) onBack(); }}>
      <form className="food-create-form" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <button className="food-create-close" type="button" onClick={onBack}>×</button>
        <div className="food-create-title">Thêm combo đồ ăn</div>
        <label>Ảnh combo</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="food-create-input" />
        {form.food_img_preview && (
          <img src={form.food_img_preview} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #eee", marginBottom: 8 }} />
        )}
        <label>Tên combo</label>
        <input name="food_name" value={form.food_name} onChange={handleChange} className="food-create-input" required />
        <label>Mô tả</label>
        <textarea name="food_description" value={form.food_description} onChange={handleChange} className="food-create-input" rows={2} required />
        <label>Giá</label>
        <input name="food_price" value={form.food_price} onChange={handleChange} className="food-create-input" type="number" min={0} required />
        <button type="submit" className="food-create-btn">Tạo combo</button>
      </form>
    </div>
  );
} 