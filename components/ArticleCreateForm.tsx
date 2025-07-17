import React, { useState } from "react";

const statusOptions = [
  { value: "draft", label: "Nháp" },
  { value: "public", label: "Công khai" },
];
const categoryOptions = [
  { value: "blog", label: "Blog" },
  { value: "review", label: "Review" },
];

export default function ArticleCreateForm({ onBack, initialData }: { onBack: () => void; initialData?: any }) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    status: initialData?.status || "draft",
    category: initialData?.category || "blog",
    content: initialData?.content || "",
    description: initialData?.description || "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onBack();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mock: log ra console
    if (initialData) {
      console.log("Sửa bài viết:", form, image);
    } else {
      console.log("Tạo bài viết:", form, image);
    }
  };
  return (
    <div className="article-create-modal-bg" onClick={handleBgClick}>
      <form className="article-create-form" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <button className="article-create-close" type="button" onClick={onBack}>×</button>
        <div className="article-create-row">
          <button className="article-create-btn" type="submit">+ Tạo bài viết</button>
        </div>
        <div className="article-create-grid">
          <div className="article-create-col">
            <label className="article-create-label">* Tiêu đề</label>
            <input className="article-create-input" name="title" value={form.title} onChange={handleChange} placeholder="Enter title" required />
          </div>
          <div className="article-create-col">
            <label className="article-create-label">* Trạng thái</label>
            <select className="article-create-input" name="status" value={form.status} onChange={handleChange}>
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="article-create-col">
            <label className="article-create-label">* Danh mục</label>
            <select className="article-create-input" name="category" value={form.category} onChange={handleChange}>
              {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="article-create-col">
            <label className="article-create-label">Ảnh bài viết</label>
            <input
              className="article-create-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 120, marginTop: 8, borderRadius: 6, border: '1px solid #eee' }} />
            )}
          </div>
        </div>
        <div className="article-create-block">
          <label className="article-create-label">* Nội dung</label>
          <textarea className="article-create-input" name="content" value={form.content} onChange={handleChange} rows={8} placeholder="Nhập nội dung..." required />
        </div>
        <div className="article-create-block">
          <label className="article-create-label">* Mô tả</label>
          <textarea className="article-create-input" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Enter description" required />
        </div>
      </form>
    </div>
  );
} 