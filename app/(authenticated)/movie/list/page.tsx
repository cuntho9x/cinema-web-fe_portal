"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/movieList.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface Genre {
  id: number;
  name: string;
}

interface MovieGenre {
  genre: Genre;
}

interface Movie {
  movie_id: number;
  movie_title: string;
  release_date: string;
  country: string;
  status: string;
  movieGenres: MovieGenre[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MovieResponse {
  movies: Movie[];
  pagination: Pagination;
}

function GenreTag({ children }: { children: React.ReactNode }) {
  return <span className="movie-genre-tag">{children}</span>;
}

function StatusTag({ status }: { status: string }) {
  const statusMap: { [key: string]: string } = {
    nowShowing: "Đang chiếu",
    comingSoon: "Sắp chiếu",
    stopped: "Dừng chiếu",
  };
  const statusText = statusMap[status] || status;
  let statusClass = "movie-status-tag";
  if (status === "nowShowing") statusClass += " status-showing";
  else if (status === "comingSoon") statusClass += " status-coming";
  else if (status === "stopped") statusClass += " status-stopped";
  return <span className={statusClass}>{statusText}</span>;
}

function CountryTag({ country }: { country: string }) {
  return <span>{country}</span>;
}

export default function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchMovies = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
      };
      if (search.trim()) {
        params.search = search.trim();
      }
      const response = await axios.get<MovieResponse>("http://localhost:3000/movie", {
        params,
        withCredentials: true,
      });
      
      // Xử lý response - có thể là object với movies và pagination hoặc array trực tiếp
      if (response.data && typeof response.data === 'object' && 'movies' in response.data) {
        // Format mới với pagination
        setMovies(response.data.movies || []);
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        });
      } else if (Array.isArray(response.data)) {
        // Format cũ - trả về array trực tiếp (fallback)
        setMovies(response.data);
        setPagination({
          page: 1,
          limit: 10,
          total: response.data.length,
          totalPages: Math.ceil(response.data.length / 10),
        });
      } else {
        setMovies([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        });
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Không thể tải danh sách phim");
      setMovies([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    fetchMovies(1, searchTerm);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatYear = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.getFullYear();
  };

  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = pagination.totalPages;
    const current = currentPage;

    if (totalPages <= 7) {
      // Nếu có ít hơn 7 trang, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Nếu có nhiều hơn 7 trang, hiển thị với dấu "..."
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (current >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="movie-list-layout">
      <AdminSidebar />
      <main className="movie-list-main">
        <div className="movie-list-container">
          <div className="movie-list-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Danh sách phim</span>
          </div>
          <div className="movie-list-action-bar">
            <Link href="/movie/create" className="movie-list-btn create">+ Tạo phim</Link>
            <button className="movie-list-btn refresh" onClick={() => fetchMovies(currentPage, searchTerm)}>⟳ Refresh</button>
          </div>
          
          {/* Search Bar */}
          <div className="movie-list-search-bar">
            <form onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phim theo tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="search-btn">
                Tìm kiếm
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                    fetchMovies(1, "");
                  }}
                  className="clear-btn"
                >
                  Xóa
                </button>
              )}
            </form>
          </div>

          {loading ? (
            <div className="movie-list-loading">Đang tải...</div>
          ) : error ? (
            <div className="movie-list-error">{error}</div>
          ) : (
            <>
              <div className="movie-list-table-wrap">
                <div className="movie-list-table-body">
                  <table className="movie-list-table">
                  <thead>
                    <tr>
                      <th>Tên phim</th>
                      <th>Thể loại</th>
                      <th>Năm phát hành</th>
                      <th>Nước</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!movies || movies.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                          {searchTerm ? "Không tìm thấy phim nào" : "Không có phim nào"}
                        </td>
                      </tr>
                    ) : (
                      movies.map((movie) => (
                        <tr key={movie.movie_id}>
                          <td>
                            <Link href={`/movie/update/${movie.movie_id}`} className="movie-link">
                              {movie.movie_title}
                            </Link>
                          </td>
                          <td>
                            {movie.movieGenres && Array.isArray(movie.movieGenres) && movie.movieGenres.length > 0 ? (
                              movie.movieGenres.map((mg, i) => (
                                <GenreTag key={i}>{mg.genre.name}</GenreTag>
                              ))
                            ) : (
                              <span style={{ color: "#999" }}>Chưa có thể loại</span>
                            )}
                          </td>
                          <td>{formatYear(movie.release_date)}</td>
                          <td><CountryTag country={movie.country} /></td>
                          <td><StatusTag status={movie.status} /></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 0 && (
                <div className="movie-list-pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </button>

                  {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                          ...
                        </span>
                      );
                    }

                    const pageNumber = page as number;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={currentPage === pageNumber ? "active" : ""}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Sau
                  </button>
                </div>
              )}

              {/* Pagination Info */}
              {pagination.total > 0 && (
                <div className="movie-list-pagination-info">
                  Hiển thị {((currentPage - 1) * pagination.limit) + 1} - {Math.min(currentPage * pagination.limit, pagination.total)} trong tổng số {pagination.total} phim
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
