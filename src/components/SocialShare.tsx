'use client'

interface SocialShareProps {
  title?: string;
}

export default function SocialShare({ title = 'Cơ hội nghề nghiệp tại TBS GROUP - Môi trường NICE & PRO' }: SocialShareProps) {
  const handleShare = (platform: string) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(title);
    
    let shareLink = '';
    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'zalo':
        shareLink = `https://zalo.me/share?url=${url}&text=${text}`;
        break;
      case 'copy':
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(shareUrl);
          alert('Đã sao chép link!');
        }
        return;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        onClick={() => handleShare('facebook')}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <span>👍</span>
        <span>Thích & Chia sẻ</span>
      </button>
      
      <button
        onClick={() => handleShare('zalo')}
        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        <span>💬</span>
        <span>Chia sẻ Zalo</span>
      </button>
      
      <button
        onClick={() => handleShare('copy')}
        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <span>🔗</span>
        <span>Sao chép link</span>
      </button>
    </div>
  );
} 