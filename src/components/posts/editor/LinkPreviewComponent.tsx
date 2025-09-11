"use client";

import { XIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface LinkPreviewProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  onRemove?: () => void;
}

const LinkPreviewComponent: React.FC<LinkPreviewProps> = ({
  url,
  title,
  description,
  image,
  onRemove,
}) => {
  // URL에서 도메인 추출
  const domain = React.useMemo(() => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return url;
    }
  }, [url]);

  return (
    <div className="border border-black rounded-2xl overflow-hidden my-2 relative">
      {/* 닫기 버튼 */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-1 rounded-full z-10"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      )}

      <div className="flex flex-col md:flex-row">
        {/* 이미지 섹션 */}
        {image && (
          <div className="md:w-1/3 h-32 md:h-auto relative bg-gray-100">
            <div className="w-full h-full relative">
              <Image
                src={image}
                alt={title || "링크 미리보기"}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* 텍스트 콘텐츠 */}
        <div className={`p-4 ${image ? "md:w-2/3" : "w-full"}`}>
          <div className="text-sm text-gray-500 mb-1">{domain}</div>
          <h3 className="font-bold text-lg mb-1 line-clamp-2">
            {title || url}
          </h3>
          {description && (
            <p className="text-gray-700 text-sm line-clamp-2">{description}</p>
          )}
          <div className="text-primary text-sm mt-2">더보기 →</div>
        </div>
      </div>
    </div>
  );
};

export default LinkPreviewComponent; 