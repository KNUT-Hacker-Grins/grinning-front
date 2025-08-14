// 분실물 상태 타입
export type LostItemStatus = 'searching' | 'found' | 'cancelled';

// 분실물 기본 정보 타입
export interface LostItem {
  id: number; // Integer ID (백엔드 요구사항에 맞춤)
  title: string;
  description: string;
  lost_at: string; // ISO 8601 형식
      lost_location: string;
  latitude: number; // Add latitude
  longitude: number; // Add longitude
  image_urls: string[];
  category: string;
  reward: number;
  status: LostItemStatus;
  user_name: string;
  created_at: string;
  updated_at: string;
}

// 분실물 생성 요청 타입
export interface CreateLostItemRequest {
  title: string;
  description: string;
  lost_at: string; // ISO 8601 형식
  lost_location: string;
  latitude: number | null; // Add latitude
  longitude: number | null; // Add longitude
  image_urls: string[];
  category: { name: string }; // 백엔드 요구사항에 맞춰 객체 형태로 변경
  reward?: number; // 선택적 현상금
}

// 분실물 수정 요청 타입
export interface UpdateLostItemRequest {
  title?: string;
  description?: string;
  lost_at?: string;
  lost_location?: string;
  image_urls?: string[];
  category?: string;
  reward?: number;
}

// 내 분실물 목록 조회 파라미터 타입
export interface MyLostItemsParams {
  page?: number;
  limit?: number;
  status?: LostItemStatus;
}

// 분실물 생성 응답 타입
export interface LostItemCreateResponse {
  status: 'success';
  code: 201;
  data: {
    id: number;
    title: string;
    status: LostItemStatus;
  };
  message: string;
  timestamp: string;
}

// 내 분실물 목록 응답 타입
export interface MyLostItemsResponse {
  status: 'success';
  code: 200;
  data: {
    items: LostItem[];
    page: number;
    limit: number;
    total: number;
  };
  message: string;
  timestamp: string;
}

// 분실물 상세 조회 응답 타입
export interface LostItemDetailResponse {
  status: 'success';
  code: 200;
  data: LostItem;
  message: string;
  timestamp: string;
}

// 분실물 수정 응답 타입
export interface LostItemUpdateResponse {
  status: 'success';
  code: 200;
  data: {
    id: number;
    title: string;
  };
  message: string;
  timestamp: string;
}

// 분실물 삭제 응답 타입
export interface LostItemDeleteResponse {
  status: 'success';
  code: 200;
  message: string;
  timestamp: string;
}

// 분실물 상태 변경 응답 타입
export interface LostItemStatusResponse {
  status: 'success';
  code: 200;
  data: {
    id: number;
    status: LostItemStatus;
  };
  message: string;
  timestamp: string;
} 