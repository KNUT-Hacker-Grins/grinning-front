'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MainHeader from '@/components/MainHeader';
import { useAuth } from '@/hooks/useAuth';
import BottomNav from '@/components/BottomNav';
import RegisterHeader from '@/components/RegisterHeader'; // Reusing header

export default function PoliceItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [atcId, setAtcId] = useState<string | null>(null);
  const [fdSn, setFdSn] = useState<string | null>(null);

  useEffect(() => {
    if (params.slug && Array.isArray(params.slug)) {
      setAtcId(params.slug[0]);
      setFdSn(params.slug[1]);
    }
  }, [params.slug]);

  const officialSiteUrl = atcId && fdSn
    ? `https://www.lost112.go.kr/lost/lostDetail.do?atcId=${atcId}&fdSn=${fdSn}`
    : null;

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  return (
    <main className="flex justify-center min-h-screen bg-white">
      <div className="flex flex-col mx-auto w-full max-w-md" style={{ maxWidth: '390px' }}>
        <RegisterHeader title="경찰청 유실물 상세" />

        <div className="flex-1 p-4 space-y-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <h3 className="font-semibold text-blue-700 mb-2">안내 말씀</h3>
            <p className="text-sm text-gray-700">
              경찰청 유실물 정보는 직접 관리하지 않아 상세 정보가 제한적입니다.<br />
              정확한 정보 확인을 위해 공식 사이트를 이용해주세요.
            </p>
          </div>

          {atcId && fdSn ? (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-medium text-gray-900">유실물 관리 번호</h3>
              <p className="text-sm text-gray-600"><strong>관리 ID:</strong> {atcId}</p>
              <p className="text-sm text-gray-600"><strong>습득 순번:</strong> {fdSn}</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">유실물 정보를 불러올 수 없습니다.</div>
          )}

          <div className="bg-yellow-50 text-sm text-gray-800 border-l-4 border-yellow-400 p-3 rounded-md">
            <p className="font-semibold mb-1">문의 안내</p>
            <p>
              분실물 번호를 확인 후 유실물운영유지보수 02-3150-3578번으로 문의주시면 안내해드리겠습니다.
            </p>
          </div>

          {officialSiteUrl && (
            <a
              href={officialSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              공식 사이트에서 상세 정보 확인
            </a>
          )}
        </div>
        <BottomNav />
      </div>
    </main>
  );
}
