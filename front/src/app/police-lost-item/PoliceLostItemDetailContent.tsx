'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import RegisterHeader from '@/components/RegisterHeader';

export default function PoliceLostItemDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract all PoliceLostItem fields from searchParams
  const atcId = searchParams.get('atcId');
  const lstSn = searchParams.get('lstSn');
  const lstPrdtNm = searchParams.get('lstPrdtNm');
  const lstYmd = searchParams.get('lstYmd');
  const lstPlace = searchParams.get('lstPlace');
  const lstFilePathImg = searchParams.get('lstFilePathImg');
  const prdtClNm = searchParams.get('prdtClNm');
  const clrNm = searchParams.get('clrNm');

  // Assumption: The URL for lost item details is similar to found items.
  const officialSiteUrl = atcId && lstSn
    ? `https://www.lost112.go.kr/lost/lostDetail.do?atcId=${atcId}&lstSn=${lstSn}`
    : null;

  return (
    <main className="flex justify-center min-h-screen bg-white">
      <div className="flex flex-col mx-auto w-full max-w-md" style={{ maxWidth: '390px' }}>
        <RegisterHeader title="경찰청 분실물 상세" />

        <div className="flex-1 p-4 space-y-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <h3 className="font-semibold text-blue-700 mb-2">안내 말씀</h3>
            <p className="text-sm text-gray-700">
              경찰청 분실물 정보는 직접 관리하지 않아 상세 정보가 제한적입니다.<br />
              정확한 정보 확인을 위해 공식 사이트를 이용해주세요.
            </p>
          </div>

          {atcId ? (
            <div className="space-y-4">
              <div className="w-full h-60 bg-gray-200 rounded-lg overflow-hidden">
                {lstFilePathImg ? (
                  <img src={lstFilePathImg} alt={lstPrdtNm || '분실물 이미지'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">이미지 없음</div>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900">{lstPrdtNm || '이름 없음'}</h2>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-600"><strong>분실 장소:</strong> {lstPlace || '정보 없음'}</p>
                <p className="text-sm text-gray-600"><strong>분실 일자:</strong> {lstYmd || '정보 없음'}</p>
                <p className="text-sm text-gray-600"><strong>물품 분류:</strong> {prdtClNm || '정보 없음'}</p>
                <p className="text-sm text-gray-600"><strong>색상:</strong> {clrNm || '정보 없음'}</p>
                <p className="text-sm text-gray-600"><strong>관리 ID:</strong> {atcId}</p>
                <p className="text-sm text-gray-600"><strong>분실 순번:</strong> {lstSn}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">분실물 정보를 불러올 수 없습니다.</div>
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
