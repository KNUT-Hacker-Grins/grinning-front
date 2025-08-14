'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadNaverMapsScript } from '@/utils/loadNaverMapsScript';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface MapItem {
  id: number;
  title: string;
  image_url: string;
  latitude: number;
  longitude: number;
  item_type: 'lost' | 'found';
}

export default function ItemMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<naver.maps.Map | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await loadNaverMapsScript();

        if (!mapRef.current) {
          throw new Error("Map container not found.");
        }

        // Default center (Seoul)
        const defaultCenter = new naver.maps.LatLng(37.5665, 126.9780);

        mapInstance.current = new naver.maps.Map(mapRef.current!, {
          center: defaultCenter,
          zoom: 12,
          scaleControl: true,
          zoomControl: true,
          mapDataControl: true,
        });

        // Fetch items from backend
        const response = await api.map.getItems(); // Assuming api.map.getItems() exists
        if (response && Array.isArray(response)) {
          response.forEach((item: MapItem) => {
            const position = new naver.maps.LatLng(item.latitude, item.longitude);
            
            let markerIcon = '';
            if (item.item_type === 'lost') {
              markerIcon = '/lost_marker.png'; // Custom icon for lost items
            } else {
              markerIcon = '/found_marker.png'; // Custom icon for found items
            }

            const marker = new naver.maps.Marker({
              position: position,
              map: mapInstance.current,
              title: item.title,
              icon: {
                url: markerIcon,
                size: new naver.maps.Size(32, 32),
                scaledSize: new naver.maps.Size(32, 32),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(16, 32)
              }
            });

            // Add click listener to marker
            naver.maps.Event.addListener(marker, 'click', () => {
              if (item.item_type === 'lost') {
                router.push(`/lost-item/${item.id}`);
              } else {
                router.push(`/found-item/${item.id}`);
              }
            });
          });
        } else {
          setError("Failed to load map items.");
        }

      } catch (err: any) {
        console.error("Map initialization or item fetch error:", err);
        setError(err.message || "지도 또는 아이템 로딩 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeMap();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">지도 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 mx-4 w-full max-w-md bg-white rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 text-white rounded">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen" ref={mapRef} id="naver-map" style={{ maxWidth: '390px', margin: '0 auto' }}>
      {/* Map will be rendered here */}
    </div>
  );
}