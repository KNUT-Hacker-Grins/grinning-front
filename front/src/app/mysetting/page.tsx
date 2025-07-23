'use client';

import { useState } from 'react';
import MySettingHeader from '@/components/MySettingHeader';
import MySettingBackground from '@/components/MySettingBackground';
import FormInputSection from '@/components/FormInputSection'; // 재사용
import MySettingWithdrawalButton from '@/components/MySettingWithdrawalButton';

export default function MySettingPage() {
  const [form, setForm] = useState({
    name: '김민수',
    email: 'minsu.kim@example.com',
    phone: '010-1234-5678',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: 저장 처리 로직
    console.log('저장:', form);
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white min-h-screen border-x border-gray-100 relative">
      <MySettingHeader onSave={handleSave} />
      <MySettingBackground />

      <div className="p-6 space-y-6">
        <FormInputSection
          label="이름"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-base text-gray-700"
        />

        <FormInputSection
          label="이메일"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="example@email.com"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-base text-gray-700"
        />

        <FormInputSection
          label="전화번호"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-base text-gray-700"
        />

        <FormInputSection
          label="비밀번호"
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="새 비밀번호 입력"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-base text-gray-700"
        />

        <FormInputSection
          label="비밀번호 확인"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          type="password"
          placeholder="비밀번호 재입력"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-base text-gray-700"
        />

        <MySettingWithdrawalButton />
      </div>
    </div>
  );
}