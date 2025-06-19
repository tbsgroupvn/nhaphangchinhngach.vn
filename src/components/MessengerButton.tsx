'use client'

export default function MessengerButton() {
  return (
    <a
      href="https://www.facebook.com/messages/t/964583050381612"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 transform"
      aria-label="Nhắn tin Facebook"
      title="Nhắn tin Facebook Messenger"
    >
      <svg 
        className="w-7 h-7 group-hover:scale-110 transition-transform" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.732 8.1l3.13 3.259L19.825 8.1l-6.632 6.863z"/>
      </svg>
    </a>
  )
} 