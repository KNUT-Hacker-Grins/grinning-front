// 습득물 상태 타입 (새로운 명세서에 맞춤)
export type FoundItemStatus = 'available' | 'returned';

// 사용자 정보 타입
export interface FoundItemOwner {
  social_id?: string;
  email: string;
  name: string;
  profile_picture_url?: string; // Added profile_picture_url
}

// 습득물 기본 정보 타입  
export interface FoundItem {
  id: number;
  title: string;
  description: string;
  found_location: string;
  found_at: string; // Add this line
  latitude: number; // Corrected to non-nullable
  longitude: number; // Corrected to non-nullable
  image_urls: string[]; // 배열로 변경
  category: { category: string; label: string; confidence: string; }[];
  status: FoundItemStatus;
  created_at?: string; // 메인 페이지 표시용 추가
  owner: {
    nickname: string;
  };
}

// 습득물 상세 정보 타입 (상세 조회 시 사용)
export interface FoundItemDetail extends Omit<FoundItem, 'user' | 'created_at' | 'updated_at' | 'latitude' | 'longitude'> {
  user: FoundItemOwner;
  latitude: number; // Add latitude
  longitude: number; // Add longitude
}

// 습득물 생성 요청 타입
export interface CreateFoundItemRequest {
  title: string;
  description: string;
  found_date: string; // 새로운 명세서에 맞춤
  found_location: string;
  latitude: number | null; // Add latitude
  longitude: number | null; // Add longitude
  category: string;
  image_urls: string[]; // 배열로 변경
}

// 습득물 수정 요청 타입
export interface UpdateFoundItemRequest {
  title?: string;
  description?: string;
  category?: string;
  image_urls?: string[];
}

// 습득물 목록 조회 파라미터 타입
export interface FoundItemListParams {
  page?: number;
  limit?: number;
  category?: string;
  location?: string; // 새로운 명세서에 맞춤
  status?: string; // 상태 필터링 추가
}

// 습득물 목록 응답 타입
export interface FoundItemListResponse {
  status: 'success';
  code: 200;
  data: {
    items: FoundItem[];
    page: number;
    limit: number;
    total: number;
  };
  message: string;
}

// 습득물 상세 조회 응답 타입
export interface FoundItemDetailResponse {
  status: 'success';
  code: 200;
  data: FoundItemDetail;
  message: string;
}

// 습득물 생성/수정 응답 타입
export interface FoundItemCreateResponse {
  status: 'success';
  code: 201;
  data: FoundItem;
  message: string;
}

// 습득물 상태 변경 응답 타입
export interface FoundItemStatusResponse {
  status: 'success';
  code: 200;
  data: {
    id: number;
    status: FoundItemStatus;
  };
  message: string;
}

// 습득물 삭제 응답 타입
export interface FoundItemDeleteResponse {
  status: 'success';
  code: 200;
  message: string;
} 