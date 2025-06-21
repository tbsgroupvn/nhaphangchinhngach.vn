'use client';

import { useState } from 'react';

export default function ZaloChatBubble() {
  const [isHovered, setIsHovered] = useState(false);

  const handleZaloClick = () => {
    // Track click event for analytics
    // gtag('event', 'click', { event_category: 'Contact', event_label: 'Zalo Chat' });
    // fbq('track', 'Contact');
    
    // Open Zalo chat (replace with actual Zalo OA link)
    window.open('https://zalo.me/tbsgroup', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleZaloClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
        aria-label="Chat với TBS qua Zalo"
      >
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.36L2 22l5.64-1.05C9.96 21.64 11.46 22 13 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
              fill="currentColor"
            />
            <path
              d="M12 6c-3.31 0-6 2.69-6 6 0 1.11.3 2.16.84 3.06L6 18l2.94-.84C9.84 17.7 10.89 18 12 18c3.31 0 6-2.69 6-6s-2.69-6-6-6z"
              fill="white"
            />
          </svg>
          
          {/* Hidden text for screen readers */}
          <span className="sr-only">Chat Zalo</span>
        </div>
      </button>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg animate-fadeIn">
          💬 Chat với TBS qua Zalo
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Pulse animation */}
      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
    </div>
  );
} 