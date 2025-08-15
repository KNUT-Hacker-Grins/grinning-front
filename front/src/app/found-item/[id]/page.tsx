'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FoundItemDetailResponse, FoundItemDetail } from '@/types/foundItems';
import MainHeader from '@/components/MainHeader';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'next/navigation'; // Import useParams

export default function FoundItemDetailPage() {
  const { id } = useParams(); // Get the dynamic 'id' from the URL
  const [foundItem, setFoundItem] = useState<FoundItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (typeof id !== 'string') {
      setError('Invalid Item ID.');
      setIsLoading(false);
      return;
    }

    const fetchFoundItem = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const itemId = parseInt(id, 10);
        if (isNaN(itemId)) {
          setError('Invalid Item ID.');
          setIsLoading(false);
          return;
        }

        const response = await api.foundItems.getById(itemId);
        if (response.status === 'success') {
          setFoundItem(response.data);
        } else {
          setError(response.message || 'Failed to load found item details.');
        }
      } catch (err) {
        console.error('Failed to fetch found item details:', err);
        setError('Failed to load found item details. Please check server connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoundItem();
  }, [id]); // Re-fetch when id changes

  if (isLoading) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="flex justify-center items-center mx-auto w-full max-w-md" style={{ maxWidth: '390px' }}>
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-indigo-600 animate-spin"></div>
            <p className="text-gray-600">Loading found item details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="flex justify-center items-center mx-auto w-full max-w-md" style={{ maxWidth: '390px' }}>
          <div className="text-center">
            <p className="mb-4 text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!foundItem) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="flex justify-center items-center mx-auto w-full max-w-md" style={{ maxWidth: '390px' }}>
          <div className="text-center">
            <p className="mb-4 text-gray-600">Found item not found.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full mx-auto bg-white min-h-screen" style={{ maxWidth: '390px' }}>
      <MainHeader isAuthenticated={isAuthenticated} authLoading={authLoading} />
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">{foundItem.title}</h1>
        <p className="text-gray-700 mb-2">{foundItem.description}</p>
        <p className="text-gray-600 text-sm mb-2">Found at: {foundItem.found_location}</p>
        {foundItem.image_urls && foundItem.image_urls.length > 0 && (
          <div className="mb-4">
            <img src={foundItem.image_urls[0]} alt={foundItem.title} className="w-full h-auto rounded-lg" />
          </div>
        )}
        <p className="text-gray-600 text-sm">Category: {foundItem.category[0]?.label || 'N/A'}</p>
        <p className="text-gray-600 text-sm">Status: {foundItem.status}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
}