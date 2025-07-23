import Image from 'next/image';

export default function MySettingBackground() {
  return (
    <div className="w-full h-[167px] bg-gray-200">
      <Image src="/setting-header.svg" alt="프로필 헤더" width={390} height={167} />
    </div>
  );
}
