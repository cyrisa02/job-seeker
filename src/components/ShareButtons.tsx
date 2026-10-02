// src/components/ShareButtons.tsx

"use client";

import Link from "next/link";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
      <span className="text-sm font-medium text-gray-600 self-center">Partager :</span>
      
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
      >
        Twitter
      </a>
      
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-sm font-medium transition-colors"
      >
        LinkedIn
      </a>
      
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
      >
        Facebook
      </a>
    </div>
  );
}