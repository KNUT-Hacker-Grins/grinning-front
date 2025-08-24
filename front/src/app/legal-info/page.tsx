"use client";

import { useState } from "react";
import Link from "next/link";

const LegalSection = ({ title, content, isOpen, onToggle }: {
  title: string;
  content: string[];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="flex justify-between items-center px-6 py-4 w-full text-left transition-colors hover:bg-gray-50"
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-4 duration-200 animate-in slide-in-from-top">
          <div className="space-y-3 text-gray-700">
            {content.map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function LegalInfo() {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(index)) {
      newOpenSections.delete(index);
    } else {
      newOpenSections.add(index);
    }
    setOpenSections(newOpenSections);
  };

  const legalSections = [
    {
      title: "제1조: 습득물의 조치",
      content: [
        "① 타인이 유실한 물건을 습득한 자는 이를 신속하게 유실자 또는 소유자, 그 밖에 물건회복의 청구권을 가진 자에게 반환하거나 경찰서(지구대·파출소 등 소속 경찰관서를 포함한다. 이하 같다) 또는 제주특별자치도의 자치경찰단 사무소(이하 \"자치경찰단\"이라 한다)에 제출하여야 한다. 다만, 법률에 따라 소유 또는 소지가 금지되거나 범행에 사용되었다고 인정되는 물건은 신속하게 경찰서 또는 자치경찰단에 제출하여야 한다.",
        "② 물건을 경찰서에 제출한 경우에는 경찰서장이, 자치경찰단에 제출한 경우에는 제주특별자치도지사가 물건을 반환받을 자에게 반환하여야 한다. 이 경우에 반환을 받을 자의 성명이나 주거를 알 수 없을 때에는 대통령령으로 정하는 바에 따라 공고하여야 한다."
      ]
    },
    {
      title: "제1조의2: 유실물 정보 통합관리 등 시책의 수립",
      content: [
        "국가는 유실물의 반환이 쉽게 이루어질 수 있도록 유실물 정보를 통합관리하는 등 관련 시책을 수립하여야 한다."
      ]
    },
    {
      title: "제2조: 보관방법",
      content: [
        "① 경찰서장 또는 자치경찰단을 설치한 제주특별자치도지사는 보관한 물건이 멸실되거나 훼손될 우려가 있을 때 또는 보관에 과다한 비용이나 불편이 수반될 때에는 대통령령으로 정하는 방법으로 이를 매각할 수 있다.",
        "② 매각에 드는 비용은 매각대금에서 충당한다.",
        "③ 매각 비용을 공제한 매각대금의 남은 금액은 습득물로 간주하여 보관한다."
      ]
    },
    {
      title: "제3조: 비용 부담",
      content: [
        "습득물의 보관비, 공고비(公告費), 그 밖에 필요한 비용은 물건을 반환받는 자나 물건의 소유권을 취득하여 이를 인도(引渡)받는 자가 부담하되, 「민법」 제321조부터 제328조까지의 규정을 적용한다."
      ]
    },
    {
      title: "제4조: 보상금",
      content: [
        "물건을 반환받는 자는 물건가액(物件價額)의 100분의 5 이상 100분의 20 이하의 범위에서 보상금(報償金)을 습득자에게 지급하여야 한다. 다만, 국가·지방자치단체와 그 밖에 대통령령으로 정하는 공공기관은 보상금을 청구할 수 없다."
      ]
    },
    {
      title: "제5조: 매각한 물건의 가액",
      content: [
        "제2조에 따라 매각한 물건의 가액은 매각대금을 그 물건의 가액으로 한다."
      ]
    },
    {
      title: "제6조: 비용 및 보상금의 청구기한",
      content: [
        "제3조의 비용과 제4조의 보상금은 물건을 반환한 후 1개월이 지나면 청구할 수 없다."
      ]
    },
    {
      title: "제7조: 습득자의 권리포기",
      content: [
        "습득자는 미리 신고하여 습득물에 관한 모든 권리를 포기하고 의무를 지지 아니할 수 있다."
      ]
    },
    {
      title: "제8조: 유실자의 권리 포기",
      content: [
        "① 물건을 반환받을 자는 그 권리를 포기하고 제3조의 비용과 제4조의 보상금 지급의 의무를 지지 아니할 수 있다.",
        "② 물건을 반환받을 각 권리자가 그 권리를 포기한 경우에는 습득자가 그 물건의 소유권을 취득한다. 다만, 습득자는 그 취득권을 포기하고 제1항의 예에 따를 수 있다.",
        "③ 법률에 따라 소유 또는 소지가 금지된 물건의 습득자는 소유권을 취득할 수 없다. 다만, 행정기관의 허가 또는 적법한 처분에 따라 그 소유 또는 소지가 예외적으로 허용되는 물건의 경우에는 그 습득자나 그 밖의 청구권자는 제14조에 따른 기간 내에 허가 또는 적법한 처분을 받아 소유하거나 소지할 수 있다."
      ]
    },
    {
      title: "제9조: 습득자의 권리 상실",
      content: [
        "습득물이나 그 밖에 이 법의 규정을 준용하는 물건을 횡령함으로써 처벌을 받은 자 및 습득일부터 7일 이내에 제1조제1항 또는 제11조제1항의 절차를 밟지 아니한 자는 제3조의 비용과 제4조의 보상금을 받을 권리 및 습득물의 소유권을 취득할 권리를 상실한다."
      ]
    },
    {
      title: "제10조: 선박, 차량, 건축물 등에서의 습득",
      content: [
        "① 관리자가 있는 선박, 차량, 건축물, 그 밖에 일반인의 통행을 금지한 구내에서 타인의 물건을 습득한 자는 그 물건을 관리자에게 인계하여야 한다.",
        "② 제1항의 경우에는 선박, 차량, 건축물 등의 점유자를 습득자로 한다. 자기가 관리하는 장소에서 타인의 물건을 습득한 경우에도 또한 같다.",
        "③ 이 조의 경우에 보상금은 제2항의 점유자와 실제로 물건을 습득한 자가 반씩 나누어야 한다.",
        "④ 「민법」 제253조에 따라 소유권을 취득하는 경우에는 제2항에 따른 습득자와 제1항에 따른 사실상의 습득자는 반씩 나누어 그 소유권을 취득한다. 이 경우 습득물은 제2항에 따른 습득자에게 인도한다."
      ]
    },
    {
      title: "제11조: 장물의 습득",
      content: [
        "① 범죄자가 놓고간 것으로 인정되는 물건을 습득한 자는 신속히 그 물건을 경찰서에 제출하여야 한다.",
        "② 제1항의 물건에 관하여는 법률에서 정하는 바에 따라 몰수할 것을 제외하고는 이 법 및 「민법」 제253조를 준용한다. 다만, 공소권이 소멸되는 날부터 6개월간 환부(還付)받는 자가 없을 때에만 습득자가 그 소유권을 취득한다.",
        "③ 범죄수사상 필요할 때에는 경찰서장은 공소권이 소멸되는 날까지 공고를 하지 아니할 수 있다.",
        "④ 경찰서장은 제1항에 따라 제출된 습득물이 장물(贓物)이 아니라고 판단되는 상당한 이유가 있고, 재산적 가치가 없거나 타인이 버린 것이 분명하다고 인정될 때에는 이를 습득자에게 반환할 수 있다."
      ]
    },
    {
      title: "제12조: 준유실물",
      content: [
        "착오로 점유한 물건, 타인이 놓고 간 물건이나 일실(逸失)한 가축에 관하여는 이 법 및 「민법」 제253조를 준용한다. 다만, 착오로 점유한 물건에 대하여는 제3조의 비용과 제4조의 보상금을 청구할 수 없다."
      ]
    },
    {
      title: "제13조: 매장물",
      content: [
        "① 매장물(埋藏物)에 관하여는 제10조를 제외하고는 이 법을 준용한다.",
        "② 매장물이 「민법」 제255조에서 정하는 물건인 경우 국가는 매장물을 발견한 자와 매장물이 발견된 토지의 소유자에게 통지하여 그 가액에 상당한 금액을 반으로 나누어 국고(國庫)에서 각자에게 지급하여야 한다. 다만, 매장물을 발견한 자와 매장물이 발견된 토지의 소유자가 같을 때에는 그 전액을 지급하여야 한다.",
        "③ 제2항의 금액에 불복하는 자는 그 통지를 받은 날부터 6개월 이내에 민사소송을 제기할 수 있다."
      ]
    },
    {
      title: "제14조: 수취하지 아니한 물건의 소유권 상실",
      content: [
        "이 법 및 「민법」 제253조, 제254조에 따라 물건의 소유권을 취득한 자가 그 취득한 날부터 3개월 이내에 물건을 경찰서 또는 자치경찰단으로부터 받아가지 아니할 때에는 그 소유권을 상실한다."
      ]
    },
    {
      title: "제15조: 수취인이 없는 물건의 귀속",
      content: [
        "이 법의 규정에 따라 경찰서 또는 자치경찰단이 보관한 물건으로서 교부받을 자가 없는 경우에는 그 소유권은 국고 또는 제주특별자치도의 금고에 귀속한다."
      ]
    },
    {
      title: "제16조: 인터넷을 통한 유실물 정보 제공",
      content: [
        "경찰청장은 경찰서장 및 자치경찰단장이 관리하고 있는 유실물에 관한 정보를 인터넷 홈페이지 등을 통하여 국민에게 제공하여야 한다."
      ]
    }
  ];

  return (
    <main className="flex justify-center min-h-screen bg-gray-50">
      <div className="relative mx-auto w-full max-w-md" style={{ maxWidth: "390px", minHeight: "100vh" }}>
        {/* 헤더 */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center px-6 py-4">
            <Link href="/" className="mr-4">
              <div className="flex justify-center items-center w-10 h-10 rounded-full transition-colors hover:bg-gray-100">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">관련 법률 정보</h1>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="pb-8">
          {/* 안내 메시지 */}
          <div className="px-6 py-6 bg-blue-50 border-b border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex justify-center items-center w-8 h-8 bg-blue-500 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-blue-900">유실물법령 안내</h3>
                <p className="text-sm text-blue-800">
                  유실물을 습득하거나 분실했을 때 알아야 할 법적 내용입니다.
                  각 항목을 클릭하여 자세한 내용을 확인하세요.
                </p>
              </div>
            </div>
          </div>

          {/* 법률 섹션들 */}
          <div className="bg-white">
            {legalSections.map((section, index) => (
              <LegalSection
                key={index}
                title={section.title}
                content={section.content}
                isOpen={openSections.has(index)}
                onToggle={() => toggleSection(index)}
              />
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}