"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AIPromptSidebar from "./AIPromptSidebar";

export default function AIToggleButton() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAIToggle = () => {
    if (isMobile) {
      // 모바일에서는 토스트 알림만 표시
      toast({
        variant: "destructive",
        title: "모바일에서 사용 불가",
        description: "AI Assistant는 웹(데스크톱)에서만 사용할 수 있습니다.",
      });
      return;
    }
    
    // 데스크톱에서는 정상 작동
    setIsAIOpen(!isAIOpen);
  };

  return (
    <>
      {/* AI 토글 버튼 - MenuBar 스타일 */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="AI Assistant"
        onClick={handleAIToggle}
      >
        <Sparkles className="h-6 w-6" />
      </Button>

      {/* AI 프롬프트 사이드바 - 데스크톱에서만 렌더링 */}
      {!isMobile && (
        <AIPromptSidebar 
          isOpen={isAIOpen} 
          onClose={() => setIsAIOpen(false)} 
        />
      )}
    </>
  );
}
