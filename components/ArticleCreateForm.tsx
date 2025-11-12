import React, { useState, useEffect } from "react";
import axios from "axios";

const categoryOptions = [
  { value: "blog", label: "Blog" },
  { value: "review", label: "Review" },
];

interface Article {
  article_id: number;
  article_title: string;
  article_slug: string;
  article_thumbnail: string;
  article_type: string;
  article_content1: string;
  article_image1: string;
  article_content2: string;
  article_image2: string;
  article_content3: string;
}

// Helper function to create slug from title
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
};

export default function ArticleCreateForm({ onBack, initialData, onSuccess }: { onBack: () => void; initialData?: Article; onSuccess?: () => void }) {
  const [form, setForm] = useState({
    article_title: initialData?.article_title || "",
    article_type: initialData?.article_type || "blog",
    article_content1: initialData?.article_content1 || "",
    article_content2: initialData?.article_content2 || "",
    article_content3: initialData?.article_content3 || "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.article_thumbnail || null);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.article_thumbnail || "");
  const [imageInput, setImageInput] = useState<string>(initialData?.article_thumbnail || ""); // For URL input
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        article_title: initialData.article_title || "",
        article_type: initialData.article_type || "blog",
        article_content1: initialData.article_content1 || "",
        article_content2: initialData.article_content2 || "",
        article_content3: initialData.article_content3 || "",
      });
      setImagePreview(initialData.article_thumbnail || null);
      setImageUrl(initialData.article_thumbnail || "");
      setImageInput(initialData.article_thumbnail || "");
    }
  }, [initialData]);

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
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl("");
      setImageInput("");
    } else {
      setImage(null);
      setImagePreview(initialData?.article_thumbnail || null);
      setImageUrl(initialData?.article_thumbnail || "");
      setImageInput(initialData?.article_thumbnail || "");
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Update preview if URL is provided
    if (value && (value.startsWith('http') || value.startsWith('/'))) {
      setImageInput(value);
      setImagePreview(value);
      setImageUrl(value);
      setImage(null);
    } else if (!value) {
      setImageInput(value);
      if (!image) {
        setImagePreview(initialData?.article_thumbnail || null);
        setImageUrl(initialData?.article_thumbnail || "");
      }
    } else {
      setImageInput(value);
    }
  };

  const handleUploadImage = async () => {
    if (!image) {
      alert('Vui lòng chọn file ảnh để upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', image);
      formData.append('type', 'article');

      const response = await axios.post('/api/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const uploadedUrl = response.data.url;
        setImageUrl(uploadedUrl);
        setImagePreview(uploadedUrl);
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
    
    if (!form.article_title || !form.article_content1) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Nếu có file ảnh mới chưa upload, yêu cầu upload trước (trừ khi đã có URL)
    if (image && !imageUrl && !imageInput) {
      alert('Vui lòng upload ảnh trước khi lưu bài viết');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const articleSlug = initialData?.article_slug || createSlug(form.article_title);

      const articleData = {
        article_title: form.article_title,
        article_slug: articleSlug,
        article_thumbnail: imageUrl || imageInput || initialData?.article_thumbnail || "",
        article_type: form.article_type,
        article_content1: form.article_content1,
        article_image1: "", // Có thể mở rộng sau
        article_content2: form.article_content2 || "",
        article_image2: "", // Có thể mở rộng sau
        article_content3: form.article_content3 || "",
      };

      if (initialData) {
        // Update
        await axios.patch(`http://localhost:3000/article/${initialData.article_id}`, articleData, {
          withCredentials: true,
        });
        alert('Cập nhật bài viết thành công!');
      } else {
        // Create
        await axios.post('http://localhost:3000/article', articleData, {
          withCredentials: true,
        });
        alert('Tạo bài viết thành công!');
      }

      if (onSuccess) onSuccess();
      onBack();
    } catch (err: any) {
      console.error('Error saving article:', err);
      setError(err.response?.data?.message || 'Không thể lưu bài viết');
      alert(err.response?.data?.message || 'Không thể lưu bài viết');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="article-create-modal-bg" onClick={handleBgClick}>
      <div className="article-create-modal-wrap">
        <form className="article-create-form" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
          <button className="article-create-close" type="button" onClick={onBack}>×</button>
          <div className="article-create-title">
            {initialData ? "Sửa bài viết" : "Thêm bài viết"}
          </div>
          {error && (
            <div className="article-create-error">
              {error}
            </div>
          )}
          <div className="article-create-grid">
            <div className="article-create-col">
              <label className="article-create-label">Tiêu đề <span>*</span></label>
              <input className="article-create-input" name="article_title" value={form.article_title} onChange={handleChange} placeholder="Nhập tiêu đề bài viết" required disabled={saving} />
            </div>
            <div className="article-create-col">
              <label className="article-create-label">Danh mục <span>*</span></label>
              <select className="article-create-input" name="article_type" value={form.article_type} onChange={handleChange} disabled={saving}>
                {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className="article-create-col">
              <label className="article-create-label">Ảnh bài viết</label>
              <div className="article-create-upload-section">
                <input 
                  className="article-create-input" 
                  value={imageInput}
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
                  id="article-image-input"
                  disabled={uploading || saving}
                />
                <label
                  htmlFor="article-image-input"
                  className="article-create-upload-btn"
                >
                  Chọn ảnh
                </label>
                {image && !imageUrl && (
                  <button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={uploading || saving}
                    className="article-create-upload-submit"
                  >
                    {uploading ? "Đang upload..." : "Upload"}
                  </button>
                )}
              </div>
              {imagePreview && (
                <div className="article-create-preview">
                  <img src={imagePreview.startsWith('/') ? imagePreview : `/article/${imagePreview}`} alt="Preview" />
                </div>
              )}
            </div>
          </div>
          <div className="article-create-block">
            <label className="article-create-label">Nội dung chính <span>*</span></label>
            <textarea className="article-create-input" name="article_content1" value={form.article_content1} onChange={handleChange} rows={8} placeholder="Nhập nội dung chính của bài viết..." required disabled={saving} />
          </div>
          <div className="article-create-block">
            <label className="article-create-label">Nội dung phụ 1</label>
            <textarea className="article-create-input" name="article_content2" value={form.article_content2} onChange={handleChange} rows={4} placeholder="Nhập nội dung phụ 1 (tùy chọn)..." disabled={saving} />
          </div>
          <div className="article-create-block">
            <label className="article-create-label">Nội dung phụ 2</label>
            <textarea className="article-create-input" name="article_content3" value={form.article_content3} onChange={handleChange} rows={4} placeholder="Nhập nội dung phụ 2 (tùy chọn)..." disabled={saving} />
          </div>
          <div className="article-create-row">
            <button className="article-create-btn" type="submit" disabled={uploading || saving}>
              {saving ? (initialData ? "Đang cập nhật..." : "Đang tạo...") : (initialData ? "Cập nhật bài viết" : "+ Tạo bài viết")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 