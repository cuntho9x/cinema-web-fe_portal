// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

axios.defaults.withCredentials = true; // Cho phép gửi cookie

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Lấy thông tin user ban đầu
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3000/auth/me');
        setUser(res.data);
      } catch (err) {
        setUser(null);
        router.push('/login'); // Chuyển hướng nếu không đăng nhập
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Đăng nhập
  const login = async (email: string, password: string) => {
    try {
      await axios.post('http://localhost:3000/auth/login', { email, password });
      await refresh(); // Gọi lại /me để cập nhật user
      router.push('/'); // Hoặc về /admin nếu muốn
    } catch (err) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }
  };

  // FE logout
const logout = async () => {
  try {
    await axios.post('http://localhost:3000/auth/logout', null, {
      withCredentials: true, // QUAN TRỌNG để gửi cookie đi
    });
    setUser(null);           // Xoá user khỏi context/state
    router.push('/login');   // Chuyển về trang login
  } catch (err) {
    console.error('Logout failed', err);
  }
};

  

  // Làm mới user từ /auth/me
  const refresh = async () => {
    try {
      const res = await axios.get('http://localhost:3000/auth/me');
      setUser(res.data);
    } catch (err) {
      setUser(null);
      router.push('/login');
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    refresh,
    isAuthenticated: !!user,
  };
};
