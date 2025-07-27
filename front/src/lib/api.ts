// API 클라이언트 설정
import {
  FoundItemStatus,
  CreateFoundItemRequest,
  UpdateFoundItemRequest,
  FoundItemListParams,
  FoundItemListResponse,
  FoundItemDetailResponse,
  FoundItemCreateResponse,
  FoundItemStatusResponse,
  FoundItemDeleteResponse
} from '@/types/foundItems';

import {
  LostItemStatus,
  CreateLostItemRequest,
  UpdateLostItemRequest,
  MyLostItemsParams,
  LostItemCreateResponse,
  MyLostItemsResponse,
  LostItemDetailResponse,
  LostItemUpdateResponse,
  LostItemDeleteResponse,
  LostItemStatusResponse
} from '@/types/lostItems';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// JWT 토큰 관리
export const tokenManager = {
  getAccessToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  // 디버깅용 함수
  debugTokens: () => {
    console.log('=== 토큰 상태 ===');
    console.log('Access Token:', localStorage.getItem('access_token'));
    console.log('Refresh Token:', localStorage.getItem('refresh_token'));
    console.log('=================');
  }
};

// API 요청 함수
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = tokenManager.getAccessToken();

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    let response = await fetch(url, config);

    // 토큰 만료 시 자동 갱신
    if (response.status === 401 && accessToken) {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/token/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken })
        });

        if (refreshResponse.ok) {
          const { access } = await refreshResponse.json();
          tokenManager.setTokens(access, refreshToken);
          
          // 원래 요청 재시도
          config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${access}`
          };
          response = await fetch(url, config);
        } else {
          tokenManager.clearTokens();
          window.location.href = '/login';
          return;
        }
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    
    // 네트워크 연결 오류인지 확인
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
    }
    
    throw error;
  }
};

// API 함수들
export const api = {
  // 인증 관련 (소셜 로그인만)
  auth: {
    // 소셜 로그인
    socialLogin: (provider: 'kakao' | 'google', code: string) =>
      apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ provider, code })
      }),

    logout: () =>
      apiRequest('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh: tokenManager.getRefreshToken() })
      }),

    getProfile: () => apiRequest('/api/users/me'),

    updateProfile: (userData: { 
      name?: string; 
      phone_number?: string;
      password?: string;
    }) =>
      apiRequest('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify(userData)
      }),

    deleteAccount: () =>
      apiRequest('/api/users/me', {
        method: 'DELETE'
      }),
  },

  // 분실물 관련 (TypeScript 타입 적용)
  lostItems: {
    // 분실물 신고
    create: (itemData: CreateLostItemRequest): Promise<LostItemCreateResponse> =>
      apiRequest('/api/lost-items', {  // URL 수정: /create 제거
        method: 'POST',
        body: JSON.stringify(itemData)
      }),

    // 전체 분실물 목록 조회 (메인 페이지용)
    getAll: (params?: { page?: number; limit?: number; status?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.status) searchParams.append('status', params.status);
      
      const queryString = searchParams.toString();
      return apiRequest(`/api/lost-items${queryString ? `?${queryString}` : ''}`);
    },

    // 내 분실물 목록 (페이징, 상태 필터링 지원)
    getMy: (params?: MyLostItemsParams): Promise<MyLostItemsResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.status) searchParams.append('status', params.status);
      
      const queryString = searchParams.toString();
      return apiRequest(`/api/lost-items/my${queryString ? `?${queryString}` : ''}`);
    },
    
    // 분실물 상세 조회
    getById: (id: string): Promise<LostItemDetailResponse> => 
      apiRequest(`/api/lost-items/${id}`),
    
    // 분실물 정보 수정
    update: (id: string, itemData: UpdateLostItemRequest): Promise<LostItemUpdateResponse> =>
      apiRequest(`/api/lost-items/${id}`, {  // URL 수정: /edit 제거
        method: 'PUT',
        body: JSON.stringify(itemData)
      }),

    // 분실물 상태 변경 (searching → found/cancelled)
    updateStatus: (id: string, status: LostItemStatus): Promise<LostItemStatusResponse> =>
      apiRequest(`/api/lost-items/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),

    // 분실물 삭제
    delete: (id: string): Promise<LostItemDeleteResponse> =>
      apiRequest(`/api/lost-items/${id}`, {  // URL 수정: /delete 제거
        method: 'DELETE'
      }),
  },

  // 채팅 관련
  chat: {
    startChat: (postId: number, postType: 'found' | 'lost') =>
      apiRequest('/api/chat/start', {
        method: 'POST',
        body: JSON.stringify({
          post_id: postId,
          post_type: postType
        })
      }),

    getMessages: (roomId: number, page?: number) => {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      
      return apiRequest(`/api/chat/${roomId}/list${params.toString() ? `?${params.toString()}` : ''}`);
    },

    sendMessage: (roomId: number, content: string, messageType: string = 'text') =>
      apiRequest(`/api/chat/${roomId}/message`, {
        method: 'POST',
        body: JSON.stringify({
          content,
          message_type: messageType
        })
      }),

    // 읽음 처리
    markAsRead: (roomId: number) =>
      apiRequest(`/api/chat/mark-as-read/${roomId}/`, {
        method: 'POST'
      }),

    // 안읽은 메시지 수
    getUnreadCount: () => apiRequest('/api/chat/unread-count/'),
  },

  // 파일 업로드
  upload: {
    image: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      return fetch(`${API_BASE_URL}/api/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenManager.getAccessToken()}`
        },
        body: formData
      }).then(res => res.json());
    }
  },

  // 이미지 분류 (AI 카테고리 추천)
  classify: {
    image: (imageUrl: string) =>
      apiRequest('/api/classify', {
        method: 'POST',
        body: JSON.stringify({ image_url: imageUrl })
      })
  },

  // 습득물 관련 (새로운 API 명세서에 맞춤)
  foundItems: {
    // 습득물 등록 (새로운 명세서에 맞춤)
    create: (itemData: CreateFoundItemRequest): Promise<FoundItemCreateResponse> =>
      apiRequest('/api/found-items', {  // URL 수정: 마지막 슬래시 제거
        method: 'POST',
        body: JSON.stringify(itemData)
      }),

    // 습득물 목록 조회 (페이징, 필터링 지원)
    getAll: (params?: FoundItemListParams): Promise<FoundItemListResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.category) searchParams.append('category', params.category);
      if (params?.location) searchParams.append('location', params.location); // 파라미터명 수정
      
      const queryString = searchParams.toString();
      return apiRequest(`/api/found-items${queryString ? `?${queryString}` : ''}`);  // URL 수정: /list 제거
    },
    
    // 습득물 상세 조회
    getById: (id: number): Promise<FoundItemDetailResponse> => 
      apiRequest(`/api/found-items/${id}`),
    
    // 습득물 정보 수정 (새로운 명세서에 맞춤)
    update: (id: number, itemData: UpdateFoundItemRequest): Promise<FoundItemCreateResponse> =>
      apiRequest(`/api/found-items/${id}`, {  // URL 수정: /edit 제거
        method: 'PUT',
        body: JSON.stringify(itemData)
      }),

    // 습득물 상태 변경 (available → returned)
    updateStatus: (id: number, status: FoundItemStatus): Promise<FoundItemStatusResponse> =>
      apiRequest(`/api/found-items/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),

    // 습득물 삭제 (새로운 명세서에 맞춤)
    delete: (id: number): Promise<FoundItemDeleteResponse> =>
      apiRequest(`/api/found-items/${id}`, {  // URL 수정: /delete 제거
        method: 'DELETE'
      }),
  },

  // 사용자 데이터 조회 (마이페이지용)
  user: {
    // 안읽은 메시지 수
    getUnreadCount: () => apiRequest('/api/chat/unread-count/'),
  }
}; 