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
  }
}; 