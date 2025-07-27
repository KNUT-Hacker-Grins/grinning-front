// front/src/components/MapModal.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadNaverMapsScript } from '@/utils/loadNaverMapsScript';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: string, lat: number, lng: number) => void;
}

export default function MapModal({ isOpen, onClose, onSelectAddress }: MapModalProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<naver.maps.Map | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('위치 정보를 불러오는 중...');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await loadNaverMapsScript();

        if (!mapRef.current) {
          throw new Error("Map container not found.");
        }

        // 지도 이동 시 주소 업데이트 함수
        const updateAddress = (map: naver.maps.Map) => {
          const center = map.getCenter();
          setCurrentCoords({ lat: center.lat(), lng: center.lng() }); // y, x 대신 lat(), lng() 사용
          naver.maps.Service.reverseGeocode({
            coords: center,
            orders: ['roadaddr', 'addr'],
          }, (status, response) => {
            if (status === naver.maps.Service.Status.OK && response.v2.address) {
              const address = response.v2.address;
              setCurrentAddress(address.roadAddress || address.jibunAddress || '주소를 찾을 수 없습니다.');
            } else {
              setCurrentAddress('주소를 찾을 수 없습니다.');
            }
          });
        };

        // Geolocation API를 사용하여 현재 위치 가져오기
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const initialCoords = new naver.maps.LatLng(latitude, longitude);

            mapInstance.current = new naver.maps.Map(mapRef.current!, {
              center: initialCoords,
              zoom: 16,
              scaleControl: true,
              zoomControl: true,
              mapDataControl: true,
            });

            naver.maps.Event.addListener(mapInstance.current, 'idle', () => {
              updateAddress(mapInstance.current!);
            });
            setIsLoading(false);
          },
          (err) => {
            console.error("Geolocation error:", err);
            setError("현재 위치를 가져올 수 없습니다. 위치 권한을 허용해주세요.");
            setIsLoading(false);
            // 기본 위치로 지도 초기화 (예: 서울 시청)
            mapInstance.current = new naver.maps.Map(mapRef.current!, {
              center: new naver.maps.LatLng(37.5665, 126.9780),
              zoom: 12,
              scaleControl: true,
              zoomControl: true,
              mapDataControl: true,
            });
            naver.maps.Event.addListener(mapInstance.current, 'idle', () => {
                updateAddress(mapInstance.current!);
              });
          }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );

      } catch (err: any) {
        console.error("Map initialization error:", err);
        setError(err.message || "지도 초기화 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    };

    if (isOpen) {
      initializeMap();
    }
  }, [isOpen]);

  const handleSelectLocation = () => {
    if (currentCoords && currentAddress) {
      onSelectAddress(currentAddress, currentCoords.lat, currentCoords.lng);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-4 w-11/12 max-w-md h-3/4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">현재 위치 설정</h2>
        <div ref={mapRef} id="naver-map" className="flex-grow rounded-md relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <p className="text-gray-700">지도 로딩 중...</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-75 z-10">
              <p className="text-red-700 text-center p-4">{error}</p>
            </div>
          )}
          {/* 핀 이모지 */} 
          {!isLoading && !error && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-4xl z-20 pointer-events-none">
              📍
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg font-medium text-gray-800">{currentAddress}</p>
        </div>
        <button
          onClick={handleSelectLocation}
          className="mt-4 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          disabled={isLoading || !!error || !currentCoords}
        >
          이 위치로 주소 등록
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
