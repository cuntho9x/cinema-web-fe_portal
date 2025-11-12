import React, { useState, useEffect } from "react";
import axios from "axios";

interface Food {
  food_id: number;
  food_img: string | null;
  food_name: string;
  food_description: string | null;
  food_price: number;
}

export default function FoodEditForm({ food, onBack, onSuccess }: { food: Food; onBack: () => void; onSuccess?: () => void }) {
  const [form, setForm] = useState({
    food_img: null as File | null,
    food_img_preview: food.food_img || "",
    food_img_url: food.food_img || "",
    food_img_input: food.food_img || "", // For URL input
    food_name: food.food_name || "",
    food_description: food.food_description || "",
    food_price: food.food_price ? String(food.food_price) : "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm({
      food_img: null,
      food_img_preview: food.food_img || "",
      food_img_url: food.food_img || "",
      food_img_input: food.food_img || "",
      food_name: food.food_name || "",
      food_description: food.food_description || "",
      food_price: food.food_price ? String(food.food_price) : "",
    });
  }, [food]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }
      setForm(f => ({ ...f, food_img: file, food_img_preview: URL.createObjectURL(file), food_img_url: "", food_img_input: "" }));
    } else {
      setForm(f => ({ ...f, food_img: null, food_img_preview: food.food_img || "", food_img_url: food.food_img || "", food_img_input: food.food_img || "" }));
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Update preview if URL is provided
    if (value && (value.startsWith('http') || value.startsWith('/'))) {
      setForm(f => ({ ...f, food_img_input: value, food_img_preview: value, food_img_url: value, food_img: null }));
    } else if (!value && !form.food_img) {
      setForm(f => ({ ...f, food_img_input: value, food_img_preview: food.food_img || "", food_img_url: food.food_img || "" }));
    } else {
      setForm(f => ({ ...f, food_img_input: value }));
    }
  };

  const handleUploadImage = async () => {
    if (!form.food_img) {
      alert('Vui lòng chọn file ảnh để upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', form.food_img);
      formData.append('type', 'food');

      const response = await axios.post('/api/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const uploadedUrl = response.data.url;
        setForm(f => ({ ...f, food_img_url: uploadedUrl, food_img_preview: uploadedUrl }));
        alert('Upload ảnh thành công!');
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.error || 'Không thể upload ảnh. Vui lòng thử lại.');
      alert(err.response?.data?.error || 'Không thể upload ảnh. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.food_name || !form.food_price) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Nếu có file ảnh mới chưa upload, yêu cầu upload trước (trừ khi đã có URL)
    if (form.food_img && !form.food_img_url && !form.food_img_input) {
      alert('Vui lòng upload ảnh trước khi cập nhật combo');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData: any = {
        food_name: form.food_name,
        food_description: form.food_description || undefined,
        food_price: parseFloat(form.food_price),
      };

      // Cập nhật ảnh nếu có thay đổi (URL input hoặc uploaded URL)
      if (form.food_img_url || form.food_img_input) {
        updateData.food_img = form.food_img_url || form.food_img_input;
      }

      await axios.put(`http://localhost:3000/food/${food.food_id}`, updateData, {
        withCredentials: true,
      });

      alert('Cập nhật combo thành công!');
      if (onSuccess) onSuccess();
      onBack();
    } catch (err: any) {
      console.error('Error updating food:', err);
      setError(err.response?.data?.message || 'Không thể cập nhật combo');
      alert(err.response?.data?.message || 'Không thể cập nhật combo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="food-create-modal-bg" onClick={e => { if (e.target === e.currentTarget) onBack(); }}>
      <form className="food-create-form" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <button className="food-create-close" type="button" onClick={onBack}>×</button>
        <div className="food-create-title">Sửa combo đồ ăn</div>
        {error && (
          <div className="food-create-error">
            {error}
          </div>
        )}
        <label>Ảnh combo</label>
        <div className="food-create-upload-section">
          <input 
            className="food-create-input" 
            value={form.food_img_input}
            onChange={handleImageInputChange}
            placeholder="URL hoặc upload file"
            disabled={uploading || saving}
            style={{ flex: 1 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="food-image-input-edit"
            disabled={uploading || saving}
          />
          <label
            htmlFor="food-image-input-edit"
            className="food-create-upload-btn"
          >
            Chọn ảnh
          </label>
          {form.food_img && !form.food_img_url && (
            <button
              type="button"
              onClick={handleUploadImage}
              disabled={uploading || saving}
              className="food-create-upload-submit"
            >
              {uploading ? "Đang upload..." : "Upload"}
            </button>
          )}
        </div>
        {form.food_img_preview && (
          <div className="food-create-preview">
            <img src={form.food_img_preview.startsWith('/') ? form.food_img_preview : `/catalog/${form.food_img_preview}`} alt="preview" />
          </div>
        )}
        <label>Tên combo <span>*</span></label>
        <input name="food_name" value={form.food_name} onChange={handleChange} className="food-create-input" placeholder="Nhập tên combo" required disabled={saving} />
        <label>Mô tả</label>
        <textarea name="food_description" value={form.food_description} onChange={handleChange} className="food-create-input" rows={8} placeholder="Nhập mô tả combo (tùy chọn)..." disabled={saving} />
        <label>Giá <span>*</span></label>
        <input name="food_price" value={form.food_price} onChange={handleChange} className="food-create-input" type="number" min={0} step="1000" placeholder="Nhập giá combo" required disabled={saving} />
        <button type="submit" className="food-create-btn" disabled={uploading || saving}>
          {saving ? "Đang cập nhật..." : "Cập nhật combo"}
        </button>
      </form>
    </div>
  );
} 