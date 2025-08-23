'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers: number[] = [];
  const pageRange = 5; // Number of page buttons to display

  let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  let endPage = Math.min(totalPages, startPage + pageRange - 1);

  // Adjust startPage if endPage hits totalPages but range is not full
  if (endPage - startPage + 1 < pageRange) {
    startPage = Math.max(1, endPage - pageRange + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-1 mt-4">
      {/* Go to first page */}
      <button
        onClick={() => handlePageClick(1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
      >
        &lt;&lt;
      </button>

      {/* Go to previous page */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
      >
        &lt;
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {page}
        </button>
      ))}

      {/* Go to next page */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
      >
        &gt;
      </button>

      {/* Go to last page */}
      <button
        onClick={() => handlePageClick(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
      >
        &gt;&gt;
      </button>
    </div>
  );
}
