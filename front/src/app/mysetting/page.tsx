'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import MySettingHeader from '@/components/MySettingHeader';
import MySettingBackground from '@/components/MySettingBackground';
import FormInputSection from '@/components/FormInputSection'; // 재사용


export default function MySettingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
  });

  // 사용자 정보 로드
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 비밀번호 변경 시 확인
      if (form.password && form.password !== form.confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.');
        setIsLoading(false);
        return;
      }

      // 프로필 수정 API 호출
      const updateData: any = {
        name: form.name,
        phone_number: form.phone_number,
      };

      // 비밀번호가 입력된 경우에만 추가
      if (form.password) {
        updateData.password = form.password;
      }

      const result = await updateProfile(updateData);
      
      if (result.success) {
        setSuccess('프로필이 성공적으로 수정되었습니다.');
        // 비밀번호 필드 초기화
        setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        setError(result.error || '프로필 수정에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('프로필 수정 실패:', error);
      setError(error.message || '프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    const confirmed = confirm(
      '정말로 계정을 삭제하시겠습니까?\n' +
      '이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.'
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);
      await api.auth.deleteAccount();
      alert('계정이 성공적으로 삭제되었습니다.');
      await logout();
      router.push('/');
    } catch (error: any) {
      console.error('계정 삭제 실패:', error);
      alert(error.message || '계정 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 상태
  if (authLoading || isLoading) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white min-h-screen border-x border-gray-100 relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!isAuthenticated || !user) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white min-h-screen border-x border-gray-100 relative flex items-center justify-center">
        <p className="text-gray-600">로그인이 필요합니다...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white min-h-screen border-x border-gray-100 relative">
      <MySettingHeader onSave={handleSave} />
      <MySettingBackground />

      <div className="p-6 space-y-6">
        {/* 에러/성공 메시지 */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

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
          disabled
        />

        <FormInputSection
          label="전화번호"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-base text-gray-700"
        />

        <FormInputSection
          label="새 비밀번호"
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="변경할 비밀번호 입력 (선택사항)"
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

        {/* 회원 탈퇴 버튼 */}
        <div className="pt-4">
          <button
            onClick={handleWithdrawal}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? '처리 중...' : '회원 탈퇴'}
          </button>
        </div>
      </div>
    </div>
  );
}