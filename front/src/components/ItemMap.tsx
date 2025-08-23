'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadNaverMapsScript } from '@/utils/loadNaverMapsScript';
import { api } from '@/lib/api';
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
  const activeMarkerRef = useRef<naver.maps.Marker | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

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
          if (activeMarkerRef.current) {
            activeMarkerRef.current.setAnimation(null);
            activeMarkerRef.current = null;
          }
          setSelectedItem(null);
        });

        const response = await api.map.getItems();
        if (response && Array.isArray(response)) {
          response.forEach((item: MapItem) => {
            const position = new naver.maps.LatLng(item.latitude, item.longitude);
            
            const markerIconUrl = item.item_type === 'lost'
              ? '/분실물.png'
              : '/습득물.png';

            const marker = new naver.maps.Marker({
              position: position,
              map: mapInstance,
              title: item.title,
              icon: {
                url: markerIconUrl,
                size: new naver.maps.Size(24, 38),
                scaledSize: new naver.maps.Size(24, 38),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(12, 38)
              }
            });

            naver.maps.Event.addListener(marker, 'click', (e: { domEvent: MouseEvent }) => {
              e.domEvent.stopPropagation();

              if (activeMarkerRef.current && activeMarkerRef.current !== marker) {
                activeMarkerRef.current.setAnimation(null);
              }

              if (activeMarkerRef.current === marker) {
                marker.setAnimation(null);
                activeMarkerRef.current = null;
                setSelectedItem(null);
              } else {
                marker.setAnimation(naver.maps.Animation.BOUNCE);
                activeMarkerRef.current = marker;
                setSelectedItem(item);
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
    
    return () => {
      // Clean up markers and event listeners when component unmounts
      // This part is tricky as markers are not stored in state, but it's good practice
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="relative w-full h-full" ref={mapRef} id="naver-map" style={{ maxWidth: '390px', margin: '0 auto' }}>
      {isLoading && (
        <div className="flex absolute inset-0 z-10 justify-center items-center bg-gray-50 bg-opacity-75">
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-indigo-600 animate-spin"></div>
            <p className="text-gray-600">지도 데이터를 불러오는 중...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex absolute inset-0 z-10 justify-center items-center bg-red-100 bg-opacity-75">
          <div className="p-8 mx-4 w-full max-w-md text-center bg-white rounded-lg shadow-md">
            <p className="mb-4 text-red-600">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 text-white bg-blue-500 rounded">
              다시 시도
            </button>
          </div>
        </div>
      )}
      
      {selectedItem && (
        <MapItemPreview 
          item={selectedItem} 
          onClose={() => {
            if (activeMarkerRef.current) {
              activeMarkerRef.current.setAnimation(null);
              activeMarkerRef.current = null;
            }
            setSelectedItem(null);
          }} 
        />
      )}
    </div>
  );
}