'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterHeader from '@/components/RegisterHeader';
import PhotoUploadSection from '@/components/PhotoUploadSection';
import FormInputSection from '@/components/FormInputSection';
import FormSelectSection from '@/components/FormSelectSection';
import RegisterFooter from '@/components/RegisterFooter';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    reward: '',
    contact: '',
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageUrls: string[]) => {
    setUploadedImages(imageUrls);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 필수 입력 검증
      if (!form.title || !form.description || !form.location) {
        setError('제목, 설명, 분실 장소는 필수 입력 항목입니다.');
        return;
      }

      // 백엔드에 분실물 등록 요청
      const itemData = {
        title: form.title,
        description: form.description,
        lost_at: new Date().toISOString(), // 현재 시간으로 설정
        lost_location: form.location,
        category: form.category ? { name: form.category } : {},
        reward: form.reward ? parseInt(form.reward) : 0,
        image_urls: uploadedImages,
      };

      const response = await api.lostItems.create(itemData);
      
      if (response) {
        alert('분실물이 성공적으로 등록되었습니다!');
        router.push('/'); // 메인 페이지로 이동
      }
    } catch (error: any) {
      console.error('분실물 등록 실패:', error);
      
      if (error.message.includes('401')) {
        setError('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError('분실물 등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // 실제로는 역지오코딩 API를 사용해야 하지만, 
          // 여기서는 간단히 좌표를 텍스트로 표시
          const locationText = `위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`;
          setForm(prev => ({ ...prev, location: locationText }));
          
          console.log('현재 위치:', { latitude, longitude });
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          alert('위치 정보를 가져올 수 없습니다. 수동으로 입력해 주세요.');
        }
      );
    } else {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white">
        <RegisterHeader />
        
        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="p-4 space-y-6">
          <PhotoUploadSection onImageUpload={handleImageUpload} />
          
          <FormInputSection
            label="제목"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="분실물 제목을 입력하세요"
            required
          />
          
          <FormSelectSection
            label="카테고리"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={[
              { value: '', label: '카테고리 선택' },
              { value: '전자기기', label: '전자기기' },
              { value: '지갑/카드', label: '지갑/카드' },
              { value: '가방', label: '가방' },
              { value: '의류', label: '의류' },
              { value: '액세서리', label: '액세서리' },
              { value: '기타', label: '기타' },
            ]}
          />
          
          <FormInputSection
            label="상세 설명"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="분실물에 대한 자세한 설명을 입력하세요"
            multiline
            required
          />
          
          <div>
            <FormInputSection
              label="분실 장소"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="분실한 장소를 입력하세요"
              required
            />
            <button
              type="button"
              onClick={handleCurrentLocation}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              현재 위치 사용
            </button>
          </div>
          
          <FormInputSection
            label="현상금 (선택)"
            name="reward"
            value={form.reward}
            onChange={handleChange}
            placeholder="현상금을 입력하세요 (원)"
            type="number"
          />
          
          <FormInputSection
            label="연락처"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="연락 가능한 번호를 입력하세요"
          />
        </div>
        
        <RegisterFooter 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          disabled={!form.title || !form.description || !form.location}
        />
      </div>
    </div>
  );
}