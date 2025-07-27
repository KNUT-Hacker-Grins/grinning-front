import { useState, useEffect } from 'react';
import { api, tokenManager } from '@/lib/api';

interface User {
  id: number;
  email: string;
  name: string;
  nickname?: string;
  phone_number?: string;
  profile_image?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  // 로그인 상태 체크
  const checkAuth = async () => {
    const token = tokenManager.getAccessToken();
    
    if (!token) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
      return;
    }

    try {
      const response = await api.auth.getProfile();
      if (response.status === 'success') {
        setAuthState({
          user: response.data,
          isLoading: false,
          isAuthenticated: true
        });
      }
    } catch (error) {
      console.error('인증 체크 실패:', error);
      tokenManager.clearTokens();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
    }
  };

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      if (response.status === 'success') {
        tokenManager.setTokens(response.data.access, response.data.refresh);
        await checkAuth();
        return { success: true };
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      return { success: false, error: '로그인에 실패했습니다.' };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      tokenManager.clearTokens();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
    }
  };

  // 컴포넌트 마운트 시 인증 상태 체크
  useEffect(() => {
    checkAuth();
  }, []);

  return {
    ...authState,
    login,
    logout,
    checkAuth
  };
}; 