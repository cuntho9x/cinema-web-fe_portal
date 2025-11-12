"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "@/styles/components/movieCreate.scss";
import Link from "next/link";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Genre {
  id: number;
  name: string;
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

export default function MovieCreatePage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    const fetchGenres = async () => {
      try {
        const response = await axios.get("http://localhost:3000/movie/genres/all", {
          withCredentials: true,
        });
        setGenres(response.data);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchGenres();
  }, []);

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

  // Handle create movie
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!movieTitle || !movieTitleUrl || !duration || !releaseDate || !country || !movieProducer || !status || !graphicsType || !translationType || !ageRestriction) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const createData = {
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
      
      await axios.post('http://localhost:3000/movie', createData, {
        withCredentials: true,
      });
      
      alert("Tạo phim thành công!");
      router.push("/movie/list");
    } catch (err: any) {
      console.error("Error creating movie:", err);
      setError(err.response?.data?.message || "Không thể tạo phim");
      alert(err.response?.data?.message || "Không thể tạo phim");
    } finally {
      setSaving(false);
    }
  };

  const genreOptions = genres.map(g => ({ value: g.id, label: g.name }));

  return (
    <div className="movie-create-layout">
      <AdminSidebar />
      <main className="movie-create-main">
        <div className="movie-create-container">
          <div className="movie-create-breadcrumb">
            <FontAwesomeIcon icon={faHome} className="breadcrumb-icon" />
            <span className="breadcrumb-link">Dashboard</span>
            <span className="breadcrumb-sep">/</span>
            <Link href="/movie/list" className="breadcrumb-link">Danh sách phim</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Tạo phim</span>
          </div>
          {error && (
            <div className="movie-create-error">
              {error}
            </div>
          )}
          <div className="movie-create-action-bar">
            <Link href="/movie/list" className="movie-create-btn back">&lt; Quay lại</Link>
            <button className="movie-create-btn create" onClick={handleCreate} disabled={saving}>
              {saving ? "Đang tạo..." : "+ Tạo phim"}
            </button>
          </div>
          <form className="movie-create-form" onSubmit={handleCreate}>
            <div className="movie-create-form-col">
              <label className="movie-create-label required">Tên phim</label>
              <input 
                className="movie-create-input" 
                placeholder="Nhập tên phim"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                required
              />
              <label className="movie-create-label required">Tên phim (URL slug)</label>
              <input 
                className="movie-create-input" 
                placeholder="Nhập URL slug (ví dụ: ten-phim)"
                value={movieTitleUrl}
                onChange={(e) => setMovieTitleUrl(e.target.value)}
                required
              />
              <label className="movie-create-label">Poster phim</label>
              <div className="movie-create-upload-section">
                <input 
                  className="movie-create-input" 
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
                  className="movie-create-upload-btn"
                >
                  Chọn ảnh
                </label>
                {posterFile && (
                  <button
                    type="button"
                    onClick={handleUploadPoster}
                    disabled={posterUploading}
                    className="movie-create-upload-submit"
                  >
                    {posterUploading ? "Đang upload..." : "Upload"}
                  </button>
                )}
              </div>
              {posterPreview && (
                <div className="movie-create-preview">
                  <img 
                    src={posterPreview} 
                    alt="Poster preview" 
                    onError={(e) => {
                      console.error('Error loading poster image');
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <label className="movie-create-label">Trailer</label>
              <div className="movie-create-upload-section">
                <input 
                  className="movie-create-input" 
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
                  className="movie-create-upload-btn"
                >
                  Chọn video
                </label>
                {trailerFile && (
                  <button
                    type="button"
                    onClick={handleUploadTrailer}
                    disabled={trailerUploading}
                    className="movie-create-upload-submit"
                  >
                    {trailerUploading ? "Đang upload..." : "Upload"}
                  </button>
                )}
              </div>
              {trailerFile && (
                <div style={{ marginTop: "8px", marginBottom: "8px", color: "#667eea", fontSize: "14px", fontWeight: "500" }}>
                  Video đã chọn: {trailerFile.name} ({(trailerFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              {trailerPreview && (
                <div className="movie-create-preview">
                  <video 
                    src={trailerPreview} 
                    controls 
                    onError={(e) => {
                      console.error('Error loading trailer video');
                      (e.target as HTMLVideoElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <label className="movie-create-label">Mô tả</label>
              <textarea 
                className="movie-create-input" 
                placeholder="Nhập mô tả"
                value={movieDescription}
                onChange={(e) => setMovieDescription(e.target.value)}
                rows={3}
              />
              <label className="movie-create-label">Đánh giá phim</label>
              <textarea 
                className="movie-create-input" 
                placeholder="Nhập đánh giá"
                value={movieReview}
                onChange={(e) => setMovieReview(e.target.value)}
                rows={3}
              />
              <label className="movie-create-label">Thể loại</label>
              <Select
                classNamePrefix="movie-create-select"
                isMulti
                value={selectedGenres}
                onChange={(selected) => setSelectedGenres(selected as any)}
                options={genreOptions}
                placeholder="Chọn thể loại"
              />
              <label className="movie-create-label">Đạo diễn</label>
              <input 
                className="movie-create-input" 
                placeholder="Nhập tên đạo diễn"
                value={directors}
                onChange={(e) => setDirectors(e.target.value)}
              />
              <label className="movie-create-label">Diễn viên</label>
              <textarea 
                className="movie-create-input" 
                placeholder="Nhập tên diễn viên"
                value={cast}
                onChange={(e) => setCast(e.target.value)}
                rows={2}
              />
            </div>
            <div className="movie-create-form-col">
              <label className="movie-create-label required">Hình thức chiếu</label>
              <select 
                className="movie-create-input"
                value={graphicsType}
                onChange={(e) => setGraphicsType(e.target.value)}
                required
              >
                <option value="">Chọn hình thức chiếu</option>
                {graphicsOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <label className="movie-create-label required">Hình thức dịch</label>
              <select 
                className="movie-create-input"
                value={translationType}
                onChange={(e) => setTranslationType(e.target.value)}
                required
              >
                <option value="">Chọn hình thức dịch</option>
                {translationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <label className="movie-create-label required">Độ tuổi xem phim</label>
              <select 
                className="movie-create-input"
                value={ageRestriction}
                onChange={(e) => setAgeRestriction(e.target.value)}
                required
              >
                <option value="">Chọn độ tuổi</option>
                {ageOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <label className="movie-create-label required">Ngày phát hành</label>
              <input 
                className="movie-create-input" 
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                required
              />
              <label className="movie-create-label required">Thời lượng phim (phút)</label>
              <input 
                className="movie-create-input" 
                type="number"
                placeholder="Nhập thời lượng (phút)"
                value={duration || ''}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                required
              />
              <label className="movie-create-label required">Nhà sản xuất</label>
              <input 
                className="movie-create-input" 
                placeholder="Nhập tên nhà sản xuất"
                value={movieProducer}
                onChange={(e) => setMovieProducer(e.target.value)}
                required
              />
              <label className="movie-create-label required">Trạng thái</label>
              <select 
                className="movie-create-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Chọn trạng thái</option>
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <label className="movie-create-label required">Quốc gia</label>
              <select 
                className="movie-create-input"
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
        </div>
      </main>
    </div>
  );
}
