import { useState, useEffect } from 'react';
import { api, tokenManager } from '@/lib/api';

export interface User { // Added export
  id: number;
  email: string;
  name: string;
  nickname?: string;
  phone_number?: string;
  profile_picture_url?: string; // Changed from profile_image to profile_picture_url
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
      // 자동 로그인 시도
      const autoLoginEmail = process.env.NEXT_PUBLIC_AUTO_LOGIN_EMAIL;
      const autoLoginPassword = process.env.NEXT_PUBLIC_AUTO_LOGIN_PASSWORD;

      if (autoLoginEmail && autoLoginPassword) {
        try {
          const response = await api.auth.loginPassword(autoLoginEmail, autoLoginPassword);
          if (response.status === 'success') {
            tokenManager.setTokens(response.data.access_token, response.data.refresh_token);
            setAuthState({
              user: response.data.user,
              isLoading: false,
              isAuthenticated: true
            });
            return;
          } else {
            console.error('자동 로그인 실패:', response.message);
          }
        } catch (error) {
          console.error('자동 로그인 중 오류 발생:', error);
        }
      }

      // 자동 로그인 실패 또는 설정되지 않은 경우
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
        // response.data의 구조와 타입을 확인하는 로깅 추가
        console.log('getProfile 응답 데이터:', response.data);

        // user 객체의 필수 필드 타입 검사 (예시)
        if (response.data && typeof response.data.id === 'number' && typeof response.data.email === 'string') {
          setAuthState({
            user: response.data,
            isLoading: false,
            isAuthenticated: true
          });
        } else {
          console.error('getProfile 응답 데이터가 유효하지 않습니다:', response.data);
          tokenManager.clearTokens();
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false
          });
        }
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

  // 소셜 로그인은 콜백 페이지에서 처리됨

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

  // 프로필 업데이트
  const updateProfile = async (userData: { name?: string; phone_number?: string; password?: string }) => {
    try {
      const response = await api.auth.updateProfile(userData);
      if (response.status === 'success') {
        await checkAuth(); // 프로필 정보 새로고침
        return { success: true };
      }
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      return { success: false, error: '프로필 업데이트에 실패했습니다.' };
    }
  };

  return {
    ...authState,
    logout,
    checkAuth,
    updateProfile
  };
}; 