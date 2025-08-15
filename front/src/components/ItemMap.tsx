'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadNaverMapsScript } from '@/utils/loadNaverMapsScript';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import MapItemPreview from './MapItemPreview';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    let activeMarker: naver.maps.Marker | null = null;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await loadNaverMapsScript();

        if (!mapRef.current) {
          throw new Error("Map container not found.");
        }

        const defaultCenter = new naver.maps.LatLng(37.5665, 126.9780);
        const mapInstance = new naver.maps.Map(mapRef.current!, {
          center: defaultCenter,
          zoom: 12,
          scaleControl: true,
          zoomControl: true,
          mapDataControl: true,
        });

        naver.maps.Event.addListener(mapInstance, 'click', () => {
          setSelectedItem(null);
          if (activeMarker) {
            activeMarker.setAnimation(null);
            activeMarker = null;
          }
        });

        const response = await api.map.getItems();
        if (response && Array.isArray(response)) {
          response.forEach((item: MapItem) => {
            const position = new naver.maps.LatLng(item.latitude, item.longitude);
            
            const markerIconUrl = item.item_type === 'lost' 
              ? "https://navermaps.github.io/maps.js.ncp/docs/img/example/pin_spot.png" // Orange-like
              : "https://navermaps.github.io/maps.js.ncp/docs/img/example/pin_default.png"; // Blue

            const marker = new naver.maps.Marker({
              position: position,
              map: mapInstance,
              title: item.title,
              icon: {
                url: markerIconUrl,
                size: new naver.maps.Size(24, 32),
                scaledSize: new naver.maps.Size(24, 32),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(12, 32)
              }
            });

            naver.maps.Event.addListener(marker, 'click', (e: { domEvent: MouseEvent }) => {
              e.domEvent.stopPropagation();

              if (activeMarker) {
                activeMarker.setAnimation(null);
              }
              
              if (activeMarker !== marker) {
                marker.setAnimation(naver.maps.Animation.BOUNCE);
                activeMarker = marker;
                setSelectedItem(item);
              } else {
                activeMarker = null;
                setSelectedItem(null);
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

  return (
    <div className="w-full h-screen relative" ref={mapRef} id="naver-map" style={{ maxWidth: '390px', margin: '0 auto' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">지도 데이터를 불러오는 중...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-75 z-10">
          <div className="text-center p-8 mx-4 w-full max-w-md bg-white rounded-lg shadow-md">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 text-white rounded">
              다시 시도
            </button>
          </div>
        </div>
      )}
      
      {selectedItem && (
        <MapItemPreview 
          item={selectedItem} 
          onClose={() => {
            setSelectedItem(null);
            if (activeMarker) {
              activeMarker.setAnimation(null);
              activeMarker = null;
            }
          }} 
        />
      )}
    </div>
  );
}