import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn, getCompressedImageUrl } from "@/lib/utils";

interface MediaCarouselProps {
  media: { id: string; url: string; type: "IMAGE" | "VIDEO" }[];
  initialIndex?: number;
  onClose: () => void;
}

export function MediaCarousel({
  media,
  initialIndex = 0,
  onClose,
}: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showOriginal, setShowOriginal] = useState(false);

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const showPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  // Safari에서 border-radius가 제대로 적용되도록 명시적인 스타일 정의
  const roundedStyle = {
    borderRadius: '8px',
    WebkitBorderRadius: '8px',
    overflow: 'hidden'
  };



  const renderMedia = (item: (typeof media)[0]) => {
    if (item.type === "VIDEO") {
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <video
            src={item.url}
            controls
            className="max-h-[80vh] max-w-full"
            playsInline
            controlsList="nodownload"
            muted // 모바일에서 자동 재생 방지 test
            style={roundedStyle}
          >
            <source src={item.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // 이미지의 경우 원본/압축본 선택
    const displayUrl = showOriginal ? item.url : getCompressedImageUrl(item.url, 85, 1200);

    return (
      <div className="relative h-full w-full" style={roundedStyle}>
        <Image
          src={displayUrl}
          alt="Carousel media"
          fill
          className="object-contain"
          sizes="80vw"
          priority
          style={roundedStyle}
        />
        
        {/* 원본 보기 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOriginal(!showOriginal);
          }}
          className="absolute top-4 right-12 flex items-center gap-2 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/80 transition-colors"
        >
          <Eye className="h-4 w-4" />
          {showOriginal ? "압축본" : "원본 보기"}
        </button>
      </div>
    );
  };

  return (
    <Dialog.Root open={true} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute right-8 top-8 text-white hover:opacity-70"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={showPrevious}
            className="absolute left-4 text-white hover:opacity-70"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="relative flex h-[80vh] w-[80vw] items-center justify-center">
            {renderMedia(media[currentIndex])}
          </div>

          <button
            onClick={showNext}
            className="absolute right-4 text-white hover:opacity-70"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="absolute bottom-4 flex gap-2">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-2 w-2 rounded-full",
                  index === currentIndex ? "bg-white" : "bg-white/50",
                )}
              />
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
