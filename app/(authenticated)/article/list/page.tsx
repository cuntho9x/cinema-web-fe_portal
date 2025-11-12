"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/articleList.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import ArticleCreateForm from "@/components/ArticleCreateForm";
import axios from "axios";

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

export default function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Article[]>("http://localhost:3000/article", {
        withCredentials: true,
      });
      setArticles(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error("Error fetching articles:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách bài viết");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (articleId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      return;
    }

    try {
      setDeletingId(articleId);
      await axios.delete(`http://localhost:3000/article/${articleId}`, {
        withCredentials: true,
      });
      alert("Xóa bài viết thành công!");
      fetchArticles();
    } catch (err: any) {
      console.error("Error deleting article:", err);
      alert(err.response?.data?.message || "Không thể xóa bài viết");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    fetchArticles();
  };

  const handleCreateSuccess = () => {
    setOpenCreateModal(false);
    fetchArticles();
  };

  const handleEditSuccess = () => {
    setEditArticle(null);
    fetchArticles();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="article-list-layout">
      <AdminSidebar />
      <main className="article-list-main">
        <div className="article-list-container">
          <div className="article-list-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Danh sách bài viết</span>
          </div>
          <div className="article-list-action-bar">
            <button className="article-list-btn create" onClick={() => setOpenCreateModal(true)}>
              <FontAwesomeIcon icon={faPlus} />
              Viết bài
            </button>
            <button className="article-list-btn refresh" onClick={handleRefresh}>⟳ Refresh</button>
          </div>
          {error && (
            <div style={{ padding: "12px", background: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px" }}>
              {error}
            </div>
          )}
          {loading ? (
            <div style={{ padding: "24px", textAlign: "center" }}>Đang tải...</div>
          ) : (
            <div className="article-list-table-wrap">
              <div className="article-list-table-body">
                <table className="article-list-table">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Tiêu đề</th>
                      <th>Danh mục</th>
                      <th>Ngày tạo</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "24px" }}>
                        Không có bài viết nào
                      </td>
                    </tr>
                  ) : (
                    articles.map(a => (
                      <tr key={a.article_id}>
                        <td>
                          {a.article_thumbnail ? (
                            <img 
                              src={a.article_thumbnail.startsWith('/') ? a.article_thumbnail : `/article/${a.article_thumbnail}`} 
                              alt="thumb" 
                              style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} 
                            />
                          ) : (
                            <div style={{ width: 48, height: 36, background: '#f5f5f5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 18, border: '1px solid #eee' }}>?</div>
                          )}
                        </td>
                        <td>{a.article_title}</td>
                        <td><span className="article-list-category">{a.article_type}</span></td>
                        <td>-</td>
                        <td>
                          <button 
                            className="article-action-btn edit" 
                            title="Sửa" 
                            onClick={() => setEditArticle(a)}
                            disabled={deletingId === a.article_id}
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button 
                            className="article-action-btn delete" 
                            title="Xóa"
                            onClick={() => handleDelete(a.article_id)}
                            disabled={deletingId === a.article_id}
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
        {openCreateModal && (
          <div className="article-create-modal-bg">
            <div className="article-create-modal-wrap">
              <ArticleCreateForm onBack={() => setOpenCreateModal(false)} onSuccess={handleCreateSuccess} />
            </div>
          </div>
        )}
        {editArticle && (
          <div className="article-create-modal-bg">
            <div className="article-create-modal-wrap">
              <ArticleCreateForm onBack={() => setEditArticle(null)} initialData={editArticle} onSuccess={handleEditSuccess} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 