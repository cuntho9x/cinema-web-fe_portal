"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/movieUpdate.scss";
import Link from "next/link";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

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
  movie_title_url: string;
  movie_poster?: string;
  movie_trailer?: string;
  duration: number;
  release_date: string;
  movie_review?: string;
  country: string;
  movie_producer: string;
  directors?: string;
  cast?: string;
  movie_description?: string;
  status: string;
  graphics_type: string;
  translation_type: string;
  age_restriction: string;
  movieGenres: MovieGenre[];
}

const countryOptions = [
  { value: "VietNam", label: "Việt Nam" },
  { value: "My", label: "Mỹ" },
  { value: "HanQuoc", label: "Hàn Quốc" },
  { value: "NhatBan", label: "Nhật Bản" },
];

const statusOptions = [
  { value: "nowShowing", label: "Đang chiếu" },
  { value: "comingSoon", label: "Sắp chiếu" },
  { value: "stopped", label: "Dừng chiếu" },
];

const graphicsOptions = [
  { value: "TWO_D", label: "2D" },
  { value: "THREE_D", label: "3D" },
  { value: "IMAX", label: "IMAX" },
];

const translationOptions = [
  { value: "LongTieng", label: "Lồng Tiếng" },
  { value: "PhuDe", label: "Phụ Đề" },
];

const ageOptions = [
  { value: "P", label: "Phù hợp với mọi lứa tuổi" },
  { value: "C13", label: "Cấm dưới 13 tuổi" },
  { value: "C16", label: "Cấm dưới 16 tuổi" },
  { value: "C18", label: "Cấm dưới 18 tuổi" },
];

export default function MovieUpdatePage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params?.id as string;
  
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  
  // Form state
  const [movieTitle, setMovieTitle] = useState("");
  const [movieTitleUrl, setMovieTitleUrl] = useState("");
  const [moviePoster, setMoviePoster] = useState("");
  const [movieTrailer, setMovieTrailer] = useState("");
  const [duration, setDuration] = useState(0);
  const [releaseDate, setReleaseDate] = useState("");
  const [movieReview, setMovieReview] = useState("");
  const [country, setCountry] = useState("");
  const [movieProducer, setMovieProducer] = useState("");
  const [directors, setDirectors] = useState("");
  const [cast, setCast] = useState("");
  const [movieDescription, setMovieDescription] = useState("");
  const [status, setStatus] = useState("");
  const [graphicsType, setGraphicsType] = useState("");
  const [translationType, setTranslationType] = useState("");
  const [ageRestriction, setAgeRestriction] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<{ value: number; label: string }[]>([]);
  
  // Upload states
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [posterUploading, setPosterUploading] = useState(false);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [trailerPreview, setTrailerPreview] = useState<string | null>(null);
  const [trailerUploading, setTrailerUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch movie
        const movieResponse = await axios.get(`http://localhost:3000/movie/id/${movieId}`, {
          withCredentials: true,
        });
        const movieData = movieResponse.data;
        setMovie(movieData);
        
        // Set form values
        setMovieTitle(movieData.movie_title || "");
        setMovieTitleUrl(movieData.movie_title_url || "");
        setMoviePoster(movieData.movie_poster || "");
        setMovieTrailer(movieData.movie_trailer || "");
        
        // Set preview URLs for existing files
        if (movieData.movie_poster) {
          const posterUrl = movieData.movie_poster.startsWith('http') 
            ? movieData.movie_poster 
            : movieData.movie_poster.startsWith('/') 
              ? movieData.movie_poster 
              : `/${movieData.movie_poster}`;
          setPosterPreview(posterUrl);
        }
        if (movieData.movie_trailer) {
          const trailerUrl = movieData.movie_trailer.startsWith('http') 
            ? movieData.movie_trailer 
            : movieData.movie_trailer.startsWith('/') 
              ? movieData.movie_trailer 
              : `/${movieData.movie_trailer}`;
          setTrailerPreview(trailerUrl);
        }
        
        setDuration(movieData.duration || 0);
        setReleaseDate(movieData.release_date ? new Date(movieData.release_date).toISOString().split('T')[0] : "");
        setMovieReview(movieData.movie_review || "");
        setCountry(movieData.country || "");
        setMovieProducer(movieData.movie_producer || "");
        setDirectors(movieData.directors || "");
        setCast(movieData.cast || "");
        setMovieDescription(movieData.movie_description || "");
        setStatus(movieData.status || "");
        setGraphicsType(movieData.graphics_type || "");
        setTranslationType(movieData.translation_type || "");
        setAgeRestriction(movieData.age_restriction || "");
        
        // Set selected genres
        if (movieData.movieGenres) {
          const genreOptions = movieData.movieGenres.map((mg: MovieGenre) => ({
            value: mg.genre.id,
            label: mg.genre.name,
          }));
          setSelectedGenres(genreOptions);
        }
        
        // Fetch genres
        const genresResponse = await axios.get("http://localhost:3000/movie/genres/all", {
          withCredentials: true,
        });
        setGenres(genresResponse.data);
        
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu phim");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchData();
    }
  }, [movieId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      const updateData = {
        movie_title: movieTitle,
        movie_title_url: movieTitleUrl,
        movie_poster: moviePoster || undefined,
        movie_trailer: movieTrailer || undefined,
        duration: parseInt(String(duration)),
        release_date: releaseDate,
        movie_review: movieReview || undefined,
        country: country as any,
        movie_producer: movieProducer,
        directors: directors || undefined,
        cast: cast || undefined,
        movie_description: movieDescription || undefined,
        status: status as any,
        graphics_type: graphicsType as any,
        translation_type: translationType as any,
        age_restriction: ageRestriction as any,
        genreIds: selectedGenres.map(g => g.value),
      };
      
      await axios.put(`http://localhost:3000/movie/${movieId}`, updateData, {
        withCredentials: true,
      });
      
      alert("Cập nhật phim thành công!");
      router.push("/movie/list");
    } catch (err: any) {
      console.error("Error updating movie:", err);
      setError(err.response?.data?.message || "Không thể cập nhật phim");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa phim này?")) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:3000/movie/${movieId}`, {
        withCredentials: true,
      });
      alert("Xóa phim thành công!");
      router.push("/movie/list");
    } catch (err: any) {
      console.error("Error deleting movie:", err);
      setError(err.response?.data?.message || "Không thể xóa phim");
    }
  };

  // Handle poster file selection
  const handlePosterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh (jpg, png, etc.)');
        return;
      }
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  // Handle trailer file selection
  const handleTrailerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Vui lòng chọn file video (mp4, webm, etc.)');
        return;
      }
      setTrailerFile(file);
      setTrailerPreview(URL.createObjectURL(file));
    }
  };

  // Upload poster
  const handleUploadPoster = async () => {
    if (!posterFile) {
      alert('Vui lòng chọn file ảnh để upload');
      return;
    }

    try {
      setPosterUploading(true);
      const formData = new FormData();
      formData.append('file', posterFile);
      formData.append('type', 'poster');

      const response = await axios.post('/api/upload-movie-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const uploadedUrl = response.data.url;
        setMoviePoster(uploadedUrl);
        setPosterPreview(uploadedUrl);
        setPosterFile(null);
        alert('Upload poster thành công! URL đã được cập nhật.');
      }
    } catch (err: any) {
      console.error('Error uploading poster:', err);
      alert(err.response?.data?.error || 'Không thể upload poster. Vui lòng thử lại.');
    } finally {
      setPosterUploading(false);
    }
  };

  // Upload trailer
  const handleUploadTrailer = async () => {
    if (!trailerFile) {
      alert('Vui lòng chọn file video để upload');
      return;
    }

    try {
      setTrailerUploading(true);
      const formData = new FormData();
      formData.append('file', trailerFile);
      formData.append('type', 'trailer');

      const response = await axios.post('/api/upload-movie-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const uploadedUrl = response.data.url;
        setMovieTrailer(uploadedUrl);
        setTrailerPreview(uploadedUrl);
        setTrailerFile(null);
        alert('Upload trailer thành công! URL đã được cập nhật.');
      }
    } catch (err: any) {
      console.error('Error uploading trailer:', err);
      alert(err.response?.data?.error || 'Không thể upload trailer. Vui lòng thử lại.');
    } finally {
      setTrailerUploading(false);
    }
  };

  const genreOptions = genres.map(g => ({ value: g.id, label: g.name }));

  if (loading) {
    return (
      <div className="movie-update-layout">
        <AdminSidebar />
        <main className="movie-update-main">
          <div className="movie-update-container">
            <div style={{ padding: "20px", textAlign: "center" }}>Đang tải...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !movie) {
    return (
      <div className="movie-update-layout">
        <AdminSidebar />
        <main className="movie-update-main">
          <div className="movie-update-container">
            <div style={{ padding: "20px", textAlign: "center", color: "red" }}>{error}</div>
            <Link href="/movie/list" className="movie-update-btn back">&lt; Quay lại</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="movie-update-layout">
      <AdminSidebar />
      <main className="movie-update-main">
        <div className="movie-update-container">
          <div className="movie-update-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <Link href="/movie/list" className="breadcrumb-link">Danh sách phim</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Cập nhật phim</span>
          </div>
          <div className="movie-update-tabs">
            <button className={tab === 0 ? "movie-update-tab active" : "movie-update-tab"} onClick={() => setTab(0)}>
              Thông tin phim
            </button>
            <button className={tab === 1 ? "movie-update-tab active" : "movie-update-tab"} onClick={() => setTab(1)}>
              Đánh giá phim (0)
            </button>
          </div>
          {error && (
            <div style={{ padding: "10px", margin: "10px", background: "#ffebee", color: "#c62828", borderRadius: "4px" }}>
              {error}
            </div>
          )}
          {tab === 0 && (
            <>
              <div className="movie-update-action-bar">
                <Link href="/movie/list" className="movie-update-btn back">&lt; Quay lại</Link>
                <button className="movie-update-btn update" onClick={handleUpdate} disabled={saving}>
                  {saving ? "Đang lưu..." : "Cập nhật"}
                </button>
                <button className="movie-update-btn delete" onClick={handleDelete} disabled={saving}>
                  Xóa phim
                </button>
              </div>
              <form className="movie-update-form" onSubmit={handleUpdate}>
                <div className="movie-update-form-col">
                  <label className="movie-update-label required">Tên phim</label>
                  <input 
                    className="movie-update-input" 
                    value={movieTitle}
                    onChange={(e) => setMovieTitle(e.target.value)}
                    required
                  />
                  <label className="movie-update-label required">Tên phim (URL slug)</label>
                  <input 
                    className="movie-update-input" 
                    value={movieTitleUrl}
                    onChange={(e) => setMovieTitleUrl(e.target.value)}
                    required
                  />
                  <label className="movie-update-label">Poster phim</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
                    <input 
                      className="movie-update-input" 
                      value={moviePoster}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMoviePoster(value);
                        // Update preview if URL is provided
                        if (value && (value.startsWith('http') || value.startsWith('/'))) {
                          setPosterPreview(value);
                        } else if (!value) {
                          setPosterPreview(null);
                        }
                      }}
                      placeholder="URL hoặc upload file"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterFileChange}
                      style={{ display: "none" }}
                      id="poster-upload-input"
                    />
                    <label
                      htmlFor="poster-upload-input"
                      style={{
                        padding: "8px 16px",
                        background: "#1976d2",
                        color: "white",
                        borderRadius: "4px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontSize: "14px",
                      }}
                    >
                      Chọn ảnh
                    </label>
                    {posterFile && (
                      <button
                        type="button"
                        onClick={handleUploadPoster}
                        disabled={posterUploading}
                        style={{
                          padding: "8px 16px",
                          background: posterUploading ? "#ccc" : "#4caf50",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: posterUploading ? "not-allowed" : "pointer",
                          whiteSpace: "nowrap",
                          fontSize: "14px",
                        }}
                      >
                        {posterUploading ? "Đang upload..." : "Upload"}
                      </button>
                    )}
                  </div>
                  {posterPreview && (
                    <div style={{ marginTop: "8px", marginBottom: "16px" }}>
                      <img 
                        src={posterPreview} 
                        alt="Poster preview" 
                        style={{ 
                          maxWidth: "100%", 
                          maxHeight: "200px", 
                          borderRadius: "6px", 
                          border: "1px solid #eee",
                          objectFit: "cover",
                          display: "block"
                        }} 
                        onError={(e) => {
                          console.error('Error loading poster image');
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <label className="movie-update-label">Trailer</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
                    <input 
                      className="movie-update-input" 
                      value={movieTrailer}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMovieTrailer(value);
                        // Update preview if URL is provided
                        if (value && (value.startsWith('http') || value.startsWith('/'))) {
                          setTrailerPreview(value);
                        } else if (!value) {
                          setTrailerPreview(null);
                        }
                      }}
                      placeholder="URL hoặc upload file video"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleTrailerFileChange}
                      style={{ display: "none" }}
                      id="trailer-upload-input"
                    />
                    <label
                      htmlFor="trailer-upload-input"
                      style={{
                        padding: "8px 16px",
                        background: "#1976d2",
                        color: "white",
                        borderRadius: "4px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontSize: "14px",
                      }}
                    >
                      Chọn video
                    </label>
                    {trailerFile && (
                      <button
                        type="button"
                        onClick={handleUploadTrailer}
                        disabled={trailerUploading}
                        style={{
                          padding: "8px 16px",
                          background: trailerUploading ? "#ccc" : "#4caf50",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: trailerUploading ? "not-allowed" : "pointer",
                          whiteSpace: "nowrap",
                          fontSize: "14px",
                        }}
                      >
                        {trailerUploading ? "Đang upload..." : "Upload"}
                      </button>
                    )}
                  </div>
                  {trailerFile && (
                    <div style={{ marginTop: "8px", marginBottom: "8px", color: "#1976d2", fontSize: "14px" }}>
                      Video đã chọn: {trailerFile.name} ({(trailerFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                  {trailerPreview && (
                    <div style={{ marginTop: "8px", marginBottom: "16px" }}>
                      <video 
                        src={trailerPreview} 
                        controls 
                        style={{ 
                          maxWidth: "100%", 
                          maxHeight: "200px", 
                          borderRadius: "6px", 
                          border: "1px solid #eee",
                          display: "block"
                        }}
                        onError={(e) => {
                          console.error('Error loading trailer video');
                          (e.target as HTMLVideoElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <label className="movie-update-label">Mô tả</label>
                  <textarea 
                    className="movie-update-input" 
                    value={movieDescription}
                    onChange={(e) => setMovieDescription(e.target.value)}
                    rows={3}
                  />
                  <label className="movie-update-label">Đánh giá phim</label>
                  <textarea 
                    className="movie-update-input" 
                    value={movieReview}
                    onChange={(e) => setMovieReview(e.target.value)}
                    rows={3}
                  />
                  <label className="movie-update-label">Thể loại</label>
                  <Select
                    classNamePrefix="movie-update-select"
                    isMulti
                    value={selectedGenres}
                    onChange={(selected) => setSelectedGenres(selected as any)}
                    options={genreOptions}
                  />
                  <label className="movie-update-label">Đạo diễn</label>
                  <input 
                    className="movie-update-input" 
                    value={directors}
                    onChange={(e) => setDirectors(e.target.value)}
                  />
                  <label className="movie-update-label">Diễn viên</label>
                  <textarea 
                    className="movie-update-input" 
                    value={cast}
                    onChange={(e) => setCast(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="movie-update-form-col">
                  <label className="movie-update-label required">Hình thức chiếu</label>
                  <select 
                    className="movie-update-input"
                    value={graphicsType}
                    onChange={(e) => setGraphicsType(e.target.value)}
                    required
                  >
                    <option value="">Chọn hình thức chiếu</option>
                    {graphicsOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <label className="movie-update-label required">Hình thức dịch</label>
                  <select 
                    className="movie-update-input"
                    value={translationType}
                    onChange={(e) => setTranslationType(e.target.value)}
                    required
                  >
                    <option value="">Chọn hình thức dịch</option>
                    {translationOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <label className="movie-update-label required">Độ tuổi xem phim</label>
                  <select 
                    className="movie-update-input"
                    value={ageRestriction}
                    onChange={(e) => setAgeRestriction(e.target.value)}
                    required
                  >
                    <option value="">Chọn độ tuổi</option>
                    {ageOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <label className="movie-update-label required">Ngày phát hành</label>
                  <input 
                    className="movie-update-input" 
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    required
                  />
                  <label className="movie-update-label required">Thời lượng phim (phút)</label>
                  <input 
                    className="movie-update-input" 
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    required
                  />
                  <label className="movie-update-label required">Nhà sản xuất</label>
                  <input 
                    className="movie-update-input" 
                    value={movieProducer}
                    onChange={(e) => setMovieProducer(e.target.value)}
                    required
                  />
                  <label className="movie-update-label required">Trạng thái</label>
                  <select 
                    className="movie-update-input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="">Chọn trạng thái</option>
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <label className="movie-update-label required">Quốc gia</label>
                  <select 
                    className="movie-update-input"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  >
                    <option value="">Chọn quốc gia</option>
                    {countryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </form>
            </>
          )}
          {tab === 1 && (
            <div className="movie-update-review-tab">Chưa có đánh giá nào cho phim này.</div>
          )}
        </div>
      </main>
    </div>
  );
}
