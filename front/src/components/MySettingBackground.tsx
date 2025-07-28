'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

export default function MySettingBackground() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // string or null 기본 값 null 
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Input Dom 요소 조작을 위한 Ref

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // input 파일 요소를 가르킴, 파일이 있으면 첫 번째 파일을 가져온다
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="w-full h-[167px] bg-gray-200 relative cursor-pointer"
      onClick={handleClick}
    >
      <Image
        src={imagePreview || '/setting-header.svg'}
        alt="프로필 헤더"
        layout="fill"
        objectFit="cover"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
