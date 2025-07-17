"use client";
import React, { useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import "../../../styles/components/articleList.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import ArticleCreateForm from "../../../components/ArticleCreateForm";

const articles = [
  { id: 1, title: "Danh sách phim hay Netflix tháng 3/2024", author: "ADMIN", category: "review", views: 17, status: "Công khai", created: "29-02-2024", image: "/uudai1.jpg" },
  { id: 2, title: "Danh sách phim hay Netflix tháng 12/2023", author: "ADMIN", category: "review", views: 10, status: "Công khai", created: "29-02-2024", image: "/uudai2.jpg" },
  { id: 3, title: "Danh sách phim hay Netflix tháng 4/2023", author: "ADMIN", category: "review", views: 1, status: "Công khai", created: "29-02-2024", image: "/uudai2.jpg" },
  { id: 4, title: "Danh sách phim hay Netflix tháng 2/2022", author: "Hiên Super", category: "review", views: 10, status: "Công khai", created: "29-02-2024", image: "/uudai2.jpg" },
  { id: 5, title: "Danh sách phim hay Netflix tháng 1/2022", author: "ADMIN", category: "review", views: 11, status: "Công khai", created: "29-02-2024", image: "/uudai2.jpg" },
  { id: 6, title: "Danh sách phim hay Netflix tháng 11/2021", author: "Hiên Super", category: "review", views: 0, status: "Công khai", created: "29-02-2024", image: "/uudai2.jpg" },
  { id: 7, title: "Danh sách phim hay Netflix tháng 10/2021", author: "ADMIN", category: "review", views: 0, status: "Công khai", created: "29-02-2024", image: "/uudai2.jpg" },
  { id: 8, title: "Danh sách phim hay Netflix tháng 9/2023", author: "Hiên Super", category: "review", views: 0, status: "Công khai", created: "29-02-2024", image: "/uudai2.jpg" },
  { id: 9, title: "20 phim kinh dị kịch tính trên Netflix khiến bạn sởn gai ốc", author: "Hiên Super", category: "review", views: 0, status: "Công khai", created: "29-02-2024", image: "/uudai2.jpg" },
  { id: 10, title: "Top 9 phim hoạt hình hay trên Netflix năm 2021", author: "ADMIN", category: "review", views: 19, status: "Công khai", created: "29-02-2024", image: "/uudai2.jpg" },
];

export default function ArticleListPage() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editArticle, setEditArticle] = useState<typeof articles[0] | null>(null);
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
            <button className="article-list-btn create" onClick={() => setOpenCreateModal(true)}>+ Viết bài</button>
            <button className="article-list-btn refresh">⟳ Refresh</button>
          </div>
          <div className="article-list-table-wrap">
            <table className="article-list-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Tác giả</th>
                  <th>Danh mục</th>
                  <th>Lượt xem</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id}>
                    <td>
                      {a.image ? (
                        <img src={a.image} alt="thumb" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                      ) : (
                        <div style={{ width: 48, height: 36, background: '#f5f5f5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 18, border: '1px solid #eee' }}>?</div>
                      )}
                    </td>
                    <td className="article-list-link" style={{ cursor: 'pointer' }} onClick={() => setEditArticle(a)}>{a.title}</td>
                    <td className="article-list-link">{a.author}</td>
                    <td><span className="article-list-category">{a.category}</span></td>
                    <td>{a.views}</td>
                    <td><span className="article-list-status public">{a.status}</span></td>
                    <td>{a.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {openCreateModal && (
          <div className="article-create-modal-bg">
            <div className="article-create-modal-wrap">
              <ArticleCreateForm onBack={() => setOpenCreateModal(false)} />
            </div>
          </div>
        )}
        {editArticle && (
          <div className="article-create-modal-bg">
            <div className="article-create-modal-wrap">
              <ArticleCreateForm onBack={() => setEditArticle(null)} initialData={editArticle} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 