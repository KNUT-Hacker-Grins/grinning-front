'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';

interface PhotoUploadSectionProps {
  onImageUpload?: (imageUrls: string[]) => void;
}

export default function PhotoUploadSection({ onImageUpload }: PhotoUploadSectionProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (uploadedImages.length >= 3) {
      alert('최대 3장까지만 업로드할 수 있습니다.');
      return;
    }

    try {
      setIsUploading(true);
      
      // 백엔드에 이미지 업로드
      const response = await api.upload.image(file);
      
      if (response && response.url) {
        const newImages = [...uploadedImages, response.url];
        setUploadedImages(newImages);
        
        // 부모 컴포넌트에 업로드된 이미지 URL 전달
        if (onImageUpload) {
          onImageUpload(newImages);
        }
      } else {
        alert('이미지 업로드에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('이미지 업로드 실패:', error);
      
      if (error.message?.includes('401')) {
        alert('로그인이 필요합니다.');
      } else {
        alert('이미지 업로드 중 오류가 발생했습니다.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }

      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      handleFileUpload(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    
    if (onImageUpload) {
      onImageUpload(newImages);
    }
  };

  return (
    <section>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        분실물 사진 {uploadedImages.length > 0 && `(${uploadedImages.length}/3)`}
      </label>
      
      {/* 업로드된 이미지 미리보기 */}
      {uploadedImages.length > 0 && (
        <div className="flex gap-2 mb-3">
          {uploadedImages.map((imageUrl, index) => (
            <div key={index} className="relative w-20 h-20">
              <img
                src={imageUrl}
                alt={`업로드된 이미지 ${index + 1}`}
                className="w-full h-full object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 업로드 버튼들 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCameraClick}
          disabled={isUploading || uploadedImages.length >= 3}
          className={`w-20 h-20 border border-gray-300 rounded flex flex-col items-center justify-center text-sm ${
            isUploading || uploadedImages.length >= 3
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>촬영</span>
        </button>
        
        <button
          type="button"
          onClick={handleGalleryClick}
          disabled={isUploading || uploadedImages.length >= 3}
          className={`w-20 h-20 border border-gray-300 rounded flex flex-col items-center justify-center text-sm ${
            isUploading || uploadedImages.length >= 3
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>갤러리</span>
        </button>
        
        {isUploading && (
          <div className="w-20 h-20 border border-gray-300 rounded flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-400 mt-1">
        최대 3장까지 업로드 가능합니다 (각 파일 최대 5MB)
      </p>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </section>
  );
}
