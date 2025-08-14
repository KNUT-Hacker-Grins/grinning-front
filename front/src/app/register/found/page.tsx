'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { CreateFoundItemRequest } from '@/types/foundItems';
import RegisterHeader from '@/components/RegisterHeader';
import PhotoUploadSection from '@/components/PhotoUploadSection';
import FormInputSection from '@/components/FormInputSection';
import FormSelectSection from '@/components/FormSelectSection';
import RegisterFooter from '@/components/RegisterFooter';
import MapModal from '@/components/MapModal';
import MainHeader from '@/components/MainHeader';
import { useAuth } from '@/hooks/useAuth';


// AI 카테고리 추천 결과 타입
interface CategoryRecommendation {
  category: string;
  label: string;
  confidence: string;
}

export default function FoundItemRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    found_location: '',
    found_date: '',
    latitude: null as number | null, // Add latitude
    longitude: null as number | null, // Add longitude
  });

  const { user, isAuthenticated, isLoading: authLoading, logout, updateProfile } = useAuth();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // AI 카테고리 추천 관련 상태
  const [isClassifying, setIsClassifying] = useState(false);
  const [recommendations, setRecommendations] = useState<CategoryRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // PhotoUploadSection에서 업로드된 이미지 URL들을 받는 함수
  const handleImageUpload = (imageUrls: string[]) => {
    setUploadedImages(imageUrls);
  };

  // AI 카테고리 추천 함수
  const handleCategoryRecommendation = async () => {
    if (uploadedImages.length === 0) {
      alert('이미지를 먼저 업로드해주세요.');
      return;
    }

    try {
      setIsClassifying(true);
      setRecommendations([]);
      setShowRecommendations(false);
      
      // 첫 번째 이미지를 사용하여 분류
      const response = await api.classify.image(uploadedImages[0]);
      
      if (response.status === 'success' && response.data && Array.isArray(response.data)) {
        // confidence 높은 순서대로 정렬하고 상위 2개만 가져오기
        const sortedRecommendations = response.data
          .sort((a: CategoryRecommendation, b: CategoryRecommendation) => 
            parseFloat(b.confidence) - parseFloat(a.confidence)
          )
          .slice(0, 2);
        
        if (sortedRecommendations.length > 0) {
          setRecommendations(sortedRecommendations);
          setShowRecommendations(true);
        } else {
          alert('AI 카테고리 추천 결과가 없습니다. 다른 이미지를 시도해보세요.');
        }
      } else {
        console.error('AI 분류 응답 형식 오류:', response);
        alert('AI 카테고리 추천 응답 형식에 문제가 있습니다.');
      }
    } catch (error) {
      console.error('AI 카테고리 추천 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      
      // 네트워크 오류 체크
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
        alert('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else if (errorMessage.includes('404')) {
        alert('AI 분류 서비스를 찾을 수 없습니다. 관리자에게 문의해주세요.');
      } else if (errorMessage.includes('500')) {
        alert('서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        alert(`AI 카테고리 추천에 실패했습니다: ${errorMessage}`);
      }
    } finally {
      setIsClassifying(false);
    }
  };

  // 추천된 카테고리 선택
  const handleSelectRecommendation = (category: string) => {
    setForm(prev => ({ ...prev, category }));
    setShowRecommendations(false);
  };

  // 습득물 등록 처리
  const handleSubmit = async () => {
    try {
      // 필수 필드 검증
      if (!form.title.trim()) {
        alert('습득물 이름을 입력해주세요.');
        return;
      }
      if (!form.category) {
        alert('카테고리를 선택해주세요.');
        return;
      }
      if (!form.description.trim()) {
        alert('상세 설명을 입력해주세요.');
        return;
      }
      if (!form.found_location.trim()) {
        alert('습득 위치를 입력해주세요.');
        return;
      }
      if (!form.found_date) {
        alert('습득 시간을 입력해주세요.');
        return;
      }
      if (uploadedImages.length === 0) {
        alert('이미지를 업로드해주세요.');
        return;
      }
      setIsLoading(true);

      // API 요청 데이터 구성
      const requestData: CreateFoundItemRequest = {
        title: form.title.trim(),
        description: form.description.trim(),
        found_date: new Date(form.found_date).toISOString(), // ISO 형식으로 변환
                found_location: form.found_location.trim(),
        latitude: form.latitude, // Include latitude
        longitude: form.longitude, // Include longitude
        image_urls: uploadedImages,
        category: form.category,
      };

      console.log('습득물 신고 API 요청 데이터:', requestData);
      console.log('현재 토큰:', localStorage.getItem('access_token'));

      const response = await api.foundItems.create(requestData);

      if (response.status === 'success') {
        alert('습득물이 성공적으로 신고되었습니다!');
        router.push('/mypage');
      } else {
        console.error('습득물 신고 응답 오류:', response);
        alert('습득물 신고에 실패했습니다. 서버 응답을 확인해주세요.');
      }
    } catch (error) {
      console.error('습득물 신고 실패:', error);
      console.error('에러 상세:', {
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : null
      });
      
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
        alert('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else if (errorMessage.includes('401')) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
        router.push('/login');
      } else if (errorMessage.includes('400')) {
        alert('입력한 정보에 문제가 있습니다. 다시 확인해주세요.');
      } else if (errorMessage.includes('500')) {
        alert('서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        alert(`습득물 신고에 실패했습니다: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const handleCurrentLocation = () => {
    setIsMapModalOpen(true);
  };

  const handleSelectAddress = (address: string, lat: number, lng: number) => {
    setForm((prev) => ({ ...prev, found_location: address, latitude: lat, longitude: lng }));
    console.log(`선택된 주소: ${address}, 위도: ${lat}, 경도: ${lng}`);
  };

  return (
    <div className="flex flex-col mx-auto w-full max-w-sm min-h-screen bg-white">
      <MainHeader isAuthenticated={isAuthenticated} authLoading={authLoading} />

      <main className="flex-grow px-4 py-6 space-y-6">
        <PhotoUploadSection
          onImageUpload={handleImageUpload}
        />

        <FormInputSection
          label="습득물 이름"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="습득물 이름을 입력하세요"
        />

        <FormSelectSection
          label="카테고리"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={[
            { value: '', label: '카테고리를 선택하세요' },
            { value: '전자기기', label: '전자기기' },
            { value: '지갑', label: '지갑' },
            { value: '의류', label: '의류' },
            { value: '기타', label: '기타' },
          ]}
          helperText={isClassifying ? "AI가 분석 중..." : "AI 카테고리 추천받기"}
          onHelperClick={handleCategoryRecommendation}
        />

        {/* AI 카테고리 추천 결과 */}
        {showRecommendations && recommendations.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center mb-3">
              <span className="text-sm font-medium text-gray-700">🤖 AI 추천 카테고리</span>
            </div>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectRecommendation(rec.category)}
                  className="p-3 w-full text-left bg-white rounded-lg border border-gray-200 transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">{rec.category}</span>
                      <span className="ml-2 text-sm text-gray-500">({rec.label})</span>
                    </div>
                    <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
                      {rec.confidence}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowRecommendations(false)}
              className="mt-3 text-xs text-gray-500 hover:text-gray-700"
            >
              닫기
            </button>
          </div>
        )}


        <FormInputSection
          label="상세 설명"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="습득물의 특징이나 상세 정보를 입력하세요"
          type="textarea"
          rows={4}
        />

        {/* 습득 시간 입력 */}
        <FormInputSection
          label="습득 시간"
          name="found_date"
          value={form.found_date}
          onChange={handleChange}
          type="datetime-local"
          placeholder="습득 시간을 선택하세요"
        />

        <FormInputSection
          label="습득 위치"
          name="found_location"
          value={form.found_location}
          onChange={handleChange}
          placeholder="습득 위치를 입력하세요"
          buttonText="현재 위치로 설정"
          onButtonClick={handleCurrentLocation}
        />

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>습득물 신고 안내</strong><br/>
            주인을 찾아주시는 따뜻한 마음에 감사합니다. 등록된 습득물은 분실물을 찾는 분들이 확인할 수 있습니다.
          </p>
        </div>

      </main>

      <RegisterFooter 
        onSubmit={handleSubmit}
        isLoading={isLoading} 
        disabled={!form.title.trim() || !form.category || !form.description.trim() || !form.found_location.trim() || !form.found_date}
        buttonText="습득물 신고하기"
      />

      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectAddress={handleSelectAddress}
      />
    </div>
  );
} 