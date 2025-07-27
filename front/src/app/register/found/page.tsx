'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CreateFoundItemRequest } from '@/types/foundItems';
import RegisterHeader from '@/components/RegisterHeader';
import PhotoUploadSection from '@/components/PhotoUploadSection';
import FormInputSection from '@/components/FormInputSection';
import FormSelectSection from '@/components/FormSelectSection';
import RegisterFooter from '@/components/RegisterFooter';

export default function FoundItemRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    found_location: '',
    found_date: '',
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // PhotoUploadSection에서 업로드된 이미지 URL들을 받는 함수
  const handleImageUpload = (imageUrls: string[]) => {
    setUploadedImages(imageUrls);
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

      setIsLoading(true);

      // API 요청 데이터 구성
      const requestData: CreateFoundItemRequest = {
        title: form.title.trim(),
        description: form.description.trim(),
        found_date: form.found_date, // 새로운 명세서에 맞춤
        found_location: form.found_location.trim(),
        image_urls: uploadedImages, // 배열로 변경
        category: form.category,
      };

      const response = await api.foundItems.create(requestData);

      if (response.status === 'success') {
        alert('습득물이 성공적으로 신고되었습니다!');
        router.push('/mypage'); // 마이페이지로 이동
      }
    } catch (error) {
      console.error('습득물 신고 실패:', error);
      alert('습득물 신고에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 실제로는 좌표를 주소로 변환하는 로직이 필요함
          // 여기서는 간단히 좌표만 표시
          const { latitude, longitude } = position.coords;
          setForm(prev => ({ 
            ...prev, 
            found_location: `위도: ${latitude.toFixed(6)}, 경도: ${longitude.toFixed(6)}` 
          }));
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          alert('위치 정보를 가져올 수 없습니다. 직접 입력해주세요.');
        }
      );
    } else {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
    }
  };

  return (
    <div className="flex flex-col mx-auto w-full max-w-sm min-h-screen bg-white">
      <RegisterHeader title="습득물 신고" />

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
          helperText="AI 카테고리 추천받기"
        />

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

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>습득물 신고 안내</strong><br/>
            주인을 찾아주시는 따뜻한 마음에 감사합니다. 등록된 습득물은 분실물을 찾는 분들이 확인할 수 있습니다.
          </p>
        </div>

      </main>

      <RegisterFooter 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        buttonText="습득물 신고하기"
      />
    </div>
  );
} 