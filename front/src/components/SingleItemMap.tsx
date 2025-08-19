'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadNaverMapsScript } from '@/utils/loadNaverMapsScript';

interface SingleItemMapProps {
  latitude: number;
  longitude: number;
  title: string;
  height?: string; // Optional height for the map container
}

export default function SingleItemMap({
  latitude,
  longitude,
  title,
  height = '300px',
}: SingleItemMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        setIsLoading(true);
        setError(null);
        await loadNaverMapsScript();

        const mapOptions = {
          center: new naver.maps.LatLng(latitude, longitude),
          zoom: 16,
          scaleControl: true,
          zoomControl: true,
          mapDataControl: true,
        };

        const map = new naver.maps.Map(mapRef.current, mapOptions);

        new naver.maps.Marker({
          position: new naver.maps.LatLng(latitude, longitude),
          map: map,
          title: title,
        });

        setIsLoading(false);
      } catch (err: any) {
        console.error("Map initialization error:", err);
        setError(err.message || "지도를 불러오는데 실패했습니다.");
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [latitude, longitude, title]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: height, position: 'relative' }}
      className="rounded-lg overflow-hidden"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">지도 로딩 중...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-75 z-10">
          <p className="text-red-600 text-center p-4 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
