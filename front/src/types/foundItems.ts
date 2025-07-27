// 습득물 상태 타입
export type FoundItemStatus = 'available' | 'returned' | 'archived';

// 사용자 정보 타입
export interface FoundItemOwner {
  social_id?: string;
  email: string;
  name: string;
}

// 습득물 기본 정보 타입
export interface FoundItem {
  id: number;
  title: string;
  description: string;
  found_at: string;
  found_location: string;
  image_url: string;
  category: any; // JSONField - 백엔드에서 YOLO AI 분류 결과
  status: FoundItemStatus;
  created_at: string;
  updated_at: string;
  user?: number; // 등록한 사용자 ID
}

// 습득물 상세 정보 타입 (상세 조회 시 사용)
export interface FoundItemDetail extends Omit<FoundItem, 'user' | 'created_at' | 'updated_at'> {
  user: FoundItemOwner;
}

// 습득물 생성 요청 타입
export interface CreateFoundItemRequest {
  title: string;
  description: string;
  found_at: string; // ISO 8601 형식 날짜 문자열
  found_location: string;
  category?: any; // 선택적 - 백엔드에서 AI로 자동 분류
  image_url?: string;
}

// 습득물 수정 요청 타입
export interface UpdateFoundItemRequest {
  title?: string;
  description?: string;
  found_at?: string;
  found_location?: string;
  category?: any;
  image_url?: string;
}

// 습득물 목록 조회 파라미터 타입
export interface FoundItemListParams {
  page?: number;
  limit?: number;
  category?: string;
  found_location?: string;
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