// API 클라이언트 설정
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
  // 인증 관련
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiRequest('/api/auth/login/password', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    
    register: (userData: { 
      email: string; 
      password: string; 
      name: string; 
      phone_number?: string 
    }) =>
      apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),

    logout: () =>
      apiRequest('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh: tokenManager.getRefreshToken() })
      }),

    getProfile: () => apiRequest('/api/users/me'),
  },

  // 분실물 관련
  lostItems: {
    create: (itemData: {
      title: string;
      description: string;
      lost_at: string;
      lost_location: string;
      category: any;
      reward?: number;
      image_urls?: string[];
    }) =>
      apiRequest('/api/lost-items/create', {  // URL 변경
        method: 'POST',
        body: JSON.stringify(itemData)
      }),

    getAll: () => apiRequest('/api/lost-items/'),  // 전체 목록 조회 (인증 불필요)
    
    getMy: () => apiRequest('/api/lost-items/my'),
    
    getById: (id: number) => apiRequest(`/api/lost-items/${id}`),
    
    update: (id: number, itemData: any) =>
      apiRequest(`/api/lost-items/${id}/edit`, {
        method: 'PUT',
        body: JSON.stringify(itemData)
      }),

    updateStatus: (id: number, status: 'searching' | 'found' | 'cancelled') =>
      apiRequest(`/api/lost-items/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),

    delete: (id: number) =>
      apiRequest(`/api/lost-items/${id}/delete`, {
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

  // 습득물 관련
  foundItems: {
    create: (itemData: {
      title: string;
      description: string;
      found_at: string;
      found_location: string;
      category: any;
      image_urls?: string[];
    }) =>
      apiRequest('/api/found-items/', {
        method: 'POST',
        body: JSON.stringify(itemData)
      }),

    getAll: () => apiRequest('/api/found-items/list'),
    
    getById: (id: number) => apiRequest(`/api/found-items/${id}`),
    
    update: (id: number, itemData: any) =>
      apiRequest(`/api/found-items/${id}/edit`, {
        method: 'PUT',
        body: JSON.stringify(itemData)
      }),

    updateStatus: (id: number, status: 'available' | 'returned' | 'cancelled') =>
      apiRequest(`/api/found-items/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),

    delete: (id: number) =>
      apiRequest(`/api/found-items/${id}/delete`, {
        method: 'DELETE'
      }),
  },

  // 사용자 데이터 조회 (마이페이지용)
  user: {
    // 내가 등록한 분실물 목록
    getMyLostItems: (params?: { page?: number; limit?: number; status?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.status) searchParams.append('status', params.status);
      
      const queryString = searchParams.toString();
      return apiRequest(`/api/lost-items/my${queryString ? `?${queryString}` : ''}`);
    },



    // 안읽은 메시지 수
    getUnreadCount: () => apiRequest('/api/chat/unread-count/'),
  }
}; 