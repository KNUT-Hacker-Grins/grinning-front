'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, tokenManager } from '@/lib/api';

export default function LoginCallbackPage() {
  console.log('LoginCallbackPage: Component rendering started.'); // 1. 컴포넌트 렌더링 시작
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('로그인 처리 중...');

  useEffect(() => {
    console.log('LoginCallbackPage: useEffect entered.'); // 2. useEffect 훅 진입
    const handleCallback = async () => {
      try {
        // URL에서 직접 쿼리 파라미터 파싱
        const urlParams = new URLSearchParams(window.location.search);
        const access = urlParams.get('access');
        const refresh = urlParams.get('refresh');
        
        console.log('URL Params - access:', access, 'type:', typeof access); // 3. URL 파라미터 값 및 타입
        console.log('URL Params - refresh:', refresh, 'type:', typeof refresh); // 3. URL 파라미터 값 및 타입

        if (access && refresh) {
          console.log('URL 토큰 처리: tokenManager.setTokens 호출 직전'); // 4. tokenManager.setTokens 호출 직전 (URL 토큰)
          tokenManager.setTokens(String(access), String(refresh));
          
          setStatus('success');
          setMessage('로그인 성공! 홈페이지로 이동합니다...');
          
          // 홈페이지로 리다이렉트
          router.push('/');
          return;
        }

        // URL에서 인증 코드와 상태 확인 (기존 로직)
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        console.log('URL Params - code:', code, 'type:', typeof code); // 3. URL 파라미터 값 및 타입
        console.log('URL Params - state:', state, 'type:', typeof state); // 3. URL 파라미터 값 및 타입
        console.log('URL Params - error:', error, 'type:', typeof error); // 3. URL 파라미터 값 및 타입

        if (error) {
          throw new Error(`OAuth 인증 실패: ${error}`);
        }

        if (!code) {
          throw new Error('인증 코드가 없습니다.');
        }

        // state에서 provider 정보 추출 (kakao 또는 google)
        const provider = state; // 'kakao' 또는 'google'로 가정
        if (!provider || !['kakao', 'google'].includes(provider)) {
          throw new Error('올바르지 않은 OAuth 제공자입니다.');
        }

        setMessage(`${provider === 'kakao' ? '카카오' : '구글'} 로그인 처리 중...`);

        console.log('API 호출: api.auth.socialLogin 호출 직전'); // 5. api.auth.socialLogin 호출 직전
        // 백엔드로 인증 코드 전송
        const response = await api.auth.socialLogin(provider, code);
        console.log('API 호출: api.auth.socialLogin 응답 수신:', response); // 6. api.auth.socialLogin 응답 수신 직후

        if (response.status === 'success') {
          // 토큰 저장
          const { access_token, refresh_token } = response.data;

          console.log('API 응답 토큰 - access_token:', access_token, 'type:', typeof access_token); // 7. API 응답 토큰 값 및 타입
          console.log('API 응답 토큰 - refresh_token:', refresh_token, 'type:', typeof refresh_token); // 7. API 응답 토큰 값 및 타입

          if (typeof access_token === 'string' && typeof refresh_token === 'string') {
            console.log('API 응답 토큰 처리: tokenManager.setTokens 호출 직전'); // 8. tokenManager.setTokens 호출 직전 (API 응답 토큰)
            tokenManager.setTokens(String(access_token), String(refresh_token));
            
            setStatus('success');
            setMessage('로그인 성공! 홈페이지로 이동합니다...');
            
            // 홈페이지로 리다이렉트
            router.push('/');
          } else {
            console.error('API 응답에서 유효하지 않은 토큰 타입:', response.data);
            throw new Error('로그인 토큰이 유효하지 않습니다.');
          }
        } else {
          throw new Error('로그인 처리 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('OAuth 콜백 처리 실패 (catch 블록 진입):', error); // 9. 오류 발생 시 catch 블록 진입
        setStatus('error');
        setMessage(
          error instanceof Error 
            ? error.message 
            : '로그인 중 오류가 발생했습니다.'
        );
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="p-8 mx-4 w-full max-w-md text-center bg-white rounded-lg shadow-md">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="mb-4 w-12 h-12 rounded-full border-b-2 border-indigo-600 animate-spin"></div>
            <p className="text-gray-700">{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-12 h-12 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium text-green-700">{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-4 w-12 h-12 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="mb-2 font-medium text-red-700">로그인 실패</p>
            <p className="text-sm text-gray-600">{message}</p>
            <p className="mt-2 text-xs text-gray-500">잠시 후 로그인 페이지로 이동합니다...</p>
          </div>
        )}
      </div>
    </div>
  );
} 