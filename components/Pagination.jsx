"use client"
import { useThemeContext } from '@/context/ThemeContext'
import React from 'react'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductContext } from '@/context/ProductContext';

const Pagination = () => {
  const { isDark } = useThemeContext();
  const { totalNumberOfPages, currentPage, setCurrentPage } = useProductContext()

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalNumberOfPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (totalNumberOfPages <= 1) return null;

  return (
    <div className={`mt-8 mb-6 px-4 py-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'} rounded-lg`}>
      <div className="flex items-center justify-center gap-2 flex-wrap max-w-4xl mx-auto">

        {/* Prev */}
        <button
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className={`cursor-pointer flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base shadow-lg
            ${currentPage <= 1
              ? isDark
                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              : isDark
                ? "bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900"
                : "bg-white text-gray-800 hover:bg-gray-50 active:bg-gray-100"
            }`}
        >
          <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 sm:gap-2">
          {Array.from({ length: totalNumberOfPages }).map((_, i) => {
            const pageNumber = i + 1;
            const isCurrentPage = currentPage === pageNumber;

            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-lg cursor-pointer
                  ${isCurrentPage
                    ? isDark
                      ? "bg-teal-600 text-white scale-105"
                      : "bg-blue-600 text-white scale-105"
                    : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                  }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={currentPage >= totalNumberOfPages}
          className={`cursor-pointer flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base shadow-lg
            ${currentPage >= totalNumberOfPages
              ? isDark
                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              : isDark
                ? "bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900"
                : "bg-white text-gray-800 hover:bg-gray-50 active:bg-gray-100"
            }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={18} className="sm:w-5 sm:h-5" />
        </button>

      </div>
    </div>
  )
}

export default Pagination