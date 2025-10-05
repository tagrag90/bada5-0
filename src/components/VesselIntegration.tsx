"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Loader2, PenLine } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface VesselIntegrationProps {
  variant?: "card" | "button";
  redirectPath?: string;
  className?: string;
}

/**
 * Vessel 통합 컴포넌트
 * SSO 토큰을 발급받아 Vessel로 리다이렉트
 */
export default function VesselIntegration({ 
  variant = "card",
  redirectPath = "/editor",
  className = ""
}: VesselIntegrationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleVesselRedirect = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/sso/vessel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ redirectPath }),
      });

      if (!response.ok) {
        throw new Error('SSO 토큰 발급 실패');
      }

      const data = await response.json();

      if (data.success && data.ssoUrl) {
        // 새 탭에서 Vessel로 이동
        window.open(data.ssoUrl, '_blank', 'noopener,noreferrer');
        
        toast({
          title: "Vessel로 이동합니다",
          description: "새 탭에서 자동으로 로그인됩니다.",
        });
      } else {
        throw new Error('잘못된 응답');
      }
    } catch (error) {
      console.error('Vessel SSO error:', error);
      
      toast({
        title: "오류 발생",
        description: "Vessel 연결에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "button") {
    return (
      <Button
        onClick={handleVesselRedirect}
        disabled={isLoading}
        variant="outline"
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            연결 중...
          </>
        ) : (
          <>
            <PenLine className="mr-2 h-4 w-4" />
            Vessel에서 블로그 작성
            <ExternalLink className="ml-2 h-3 w-3" />
          </>
        )}
      </Button>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5" />
          더 긴 글은 Vessel에서
        </CardTitle>
        <CardDescription>
          Medium 스타일의 블로그 플랫폼에서 깊이있는 콘텐츠를 작성하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 리치 에디터로 전문적인 글 작성</li>
            <li>• SEO 최적화된 블로그</li>
            <li>• Divetobada 계정으로 자동 로그인</li>
          </ul>
          
          <Button
            onClick={handleVesselRedirect}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                연결 중...
              </>
            ) : (
              <>
                <PenLine className="mr-2 h-4 w-4" />
                Vessel 시작하기
                <ExternalLink className="ml-2 h-3 w-3" />
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            외부 서비스로 이동합니다
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

