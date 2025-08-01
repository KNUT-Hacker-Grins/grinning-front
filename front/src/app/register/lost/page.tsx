'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CreateLostItemRequest } from '@/types/lostItems';
import { useAuth } from '@/hooks/useAuth';
import RegisterHeader from '@/components/RegisterHeader';
import PhotoUploadSection from '@/components/PhotoUploadSection';
import FormInputSection from '@/components/FormInputSection';
import FormSelectSection from '@/components/FormSelectSection';
import RegisterFooter from '@/components/RegisterFooter';
import MapModal from '@/components/MapModal';
import Link from 'next/link';

export default function LostItemRegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    lost_location: '',
    lost_at: '',
    reward: '',
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // 인증 상태 확인
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      alert('로그인이 필요합니다.');
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // PhotoUploadSection에서 업로드된 이미지 URL들을 받는 함수
  const handleImageUpload = (imageUrls: string[]) => {
    setUploadedImages(imageUrls);
  };

  // 분실물 등록 처리
  const handleSubmit = async () => {
    try {
      // 필수 필드 검증
      if (!form.title.trim()) {
        alert('분실물 이름을 입력해주세요.');
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
      if (!form.lost_location.trim()) {
        alert('분실 위치를 입력해주세요.');
        return;
      }
      if (!form.lost_at) {
        alert('분실 시간을 입력해주세요.');
        return;
      }

      setIsLoading(true);

      // API 요청 데이터 구성
      const requestData: CreateLostItemRequest = {
        title: form.title.trim(),
        description: form.description.trim(),
        lost_at: new Date(form.lost_at).toISOString(),
        lost_location: form.lost_location.trim(),
        image_urls: uploadedImages,
        category: { name: form.category }, // 객체 형태로 변경
        reward: form.reward ? parseInt(form.reward) : 0,
      };

      console.log('API 요청 데이터:', requestData);
      console.log('현재 토큰:', localStorage.getItem('access_token'));
      
      const response = await api.lostItems.create(requestData);

      if (response.status === 'success') {
        alert('분실물이 성공적으로 신고되었습니다!');
        router.push('/mypage'); // 마이페이지로 이동
      }
    } catch (error) {
      console.error('분실물 신고 실패:', error);
      console.error('에러 상세:', {
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : null
      });
      alert('분실물 신고에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    setIsMapModalOpen(true);
  };

  const handleSelectAddress = (address: string, lat: number, lng: number) => {
    setForm((prev) => ({ ...prev, lost_location: address }));
    console.log(`선택된 주소: ${address}, 위도: ${lat}, 경도: ${lng}`);
  };

  return (
    <div className="flex flex-col mx-auto w-full max-w-sm min-h-screen bg-white">
      <RegisterHeader title="분실물 신고" />

      <main className="flex-grow px-4 py-6 space-y-6">
        <PhotoUploadSection
          onImageUpload={handleImageUpload}
        />

        <FormInputSection
          label="분실물 이름"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="분실물 이름을 입력하세요"
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
        />
        <button
          type="button"
          onClick={() => {
            if (uploadedImages.length === 0) {
              alert('이미지를 먼저 업로드해주세요.');
              return;
            }
            window.location.href = '/airesult';
          }}
          className="text-xs text-blue-500 mt-1 hover:text-blue-700 hover:underline cursor-pointer"
        >
          AI 카테고리 추천받기
        </button>

        <FormInputSection
          label="상세 설명"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="분실물의 특징이나 상세 정보를 입력하세요"
          type="textarea"
          rows={4}
        />

        {/* 분실 시간 입력 */}
        <FormInputSection
          label="분실 시간"
          name="lost_at"
          value={form.lost_at}
          onChange={handleChange}
          type="datetime-local"
          placeholder="분실 시간을 선택하세요"
        />

        <FormInputSection
          label="분실 위치"
          name="lost_location"
          value={form.lost_location}
          onChange={handleChange}
          placeholder="분실 위치를 입력하세요"
          buttonText="현재 위치로 설정"
          onButtonClick={handleCurrentLocation}
        />

        <FormInputSection
          label="현상금 (선택사항)"
          name="reward"
          value={form.reward}
          onChange={handleChange}
          type="number"
          placeholder="0"
          helperText="현상금을 설정하면 더 많은 사람들이 찾아드립니다."
        />

      </main>

      <RegisterFooter 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        disabled={!form.title.trim() || !form.category || !form.description.trim() || !form.lost_location.trim() || !form.lost_at}
        buttonText="분실물 신고하기"
      />

      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectAddress={handleSelectAddress}
      />
    </div>
  );
} 