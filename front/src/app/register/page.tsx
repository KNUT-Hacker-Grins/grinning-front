'use client';

import { useState } from 'react';
import RegisterHeader from '@/components/RegisterHeader';
import PhotoUploadSection from '@/components/PhotoUploadSection';
import FormInputSection from '@/components/FormInputSection';
import FormSelectSection from '@/components/FormSelectSection';
import RegisterFooter from '@/components/RegisterFooter';

export default function RegisterPage() {
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    reward: '',
    contact: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // TODO: 등록 로직
    console.log('등록된 정보:', form);
  };

  const handleCurrentLocation = () => {
    // TODO: 현재 위치 설정 로직
    console.log('현재 위치 설정');
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white min-h-screen flex flex-col">
      <RegisterHeader title="분실물 등록" />

      <main className="flex-grow px-4 py-6 space-y-6">
        <PhotoUploadSection />

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
          helperText="AI 카테고리 추천받기"
        />

        <FormInputSection
          label="상세 설명"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="분실물의 특징이나 상세 정보를 입력하세요"
          type="textarea"
          rows={4}
        />

        <FormInputSection
          label="분실 위치"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="분실 위치를 입력하세요"
          buttonText="현재 위치로 설정"
          onButtonClick={handleCurrentLocation}
        />

        <FormInputSection
          label="보상금 (선택사항)"
          name="reward"
          value={form.reward}
          onChange={handleChange}
          type="number"
          placeholder="0"
          helperText="보상금을 설정하면 더 많은 사람들이 찾아드립니다."
        />

        <FormInputSection
          label="연락처"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="연락 가능한 전화번호를 입력하세요"
        />
      </main>

      <RegisterFooter onSubmit={handleSubmit} />
    </div>
  );
}