"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function RefreshIndicator() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const handleRefreshStart = () => {
      setIsRefreshing(true);
      setIsVisible(true);
      setShowComplete(false);
    };

    const handleRefreshEnd = () => {
      setIsRefreshing(false);
      setShowComplete(true);
      // 완료 메시지를 충분히 보여준 후 숨기기
      setTimeout(() => {
        setIsVisible(false);
        setShowComplete(false);
      }, 3500);
    };

    window.addEventListener('homeRefreshStart', handleRefreshStart);
    window.addEventListener('homeRefreshEnd', handleRefreshEnd);

    return () => {
      window.removeEventListener('homeRefreshStart', handleRefreshStart);
      window.removeEventListener('homeRefreshEnd', handleRefreshEnd);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none refresh-indicator-container"
    >
      <div 
        className={`
          bg-white border border-gray-200 rounded-b-2xl px-6 py-4 shadow-xl
          transition-all duration-300 ease-out
        `}
        style={{
          animation: isRefreshing || showComplete 
            ? 'slideDown 0.4s ease-out forwards' 
            : 'slideUp 0.5s ease-out forwards'
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <RefreshCw 
              className={`h-5 w-5 text-blue-600 transition-transform duration-200 ${
                isRefreshing ? 'animate-spin' : 'animate-none'
              }`}
              style={{
                animation: isRefreshing ? 'spin 1.5s linear infinite' : 'none'
              }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {isRefreshing ? '새로고침 중...' : '최신 피드 상태입니다 🎉'}
          </span>
        </div>
      </div>
    </div>
  );
}
