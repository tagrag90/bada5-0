"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Sparkles, X, Minimize2, Maximize2, RotateCcw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAIActionExecutor } from "./AIActionExecutor";

interface AIPromptSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIPromptSidebar({ isOpen, onClose }: AIPromptSidebarProps) {
  const [prompt, setPrompt] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // 처리 중 상태 추가
  const [isComposing, setIsComposing] = useState(false); // 한글 입력 중 상태 추가
  const lastSubmitTime = useRef(0); // 마지막 전송 시간 추적
  
  type Message = {
    id: number;
    type: "assistant" | "user";
    content: string;
    timestamp: Date;
    actions?: any[];
  };
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "assistant" as const,
      content: "안녕하세요! 😊 Bada AI Assistant입니다.\n\n🤖 **현재 상태**: OpenAI API 할당량 문제로 로컬 명령어 파싱 모드로 작동중입니다.\n\n✨ **사용 가능한 기능:**\n📝 게시물 작성 - \"오늘 날씨 좋다고 써줘\"\n🔍 검색 및 탐색 - \"K-pop 검색해줘\"\n🔥 트렌딩 조회 - \"트렌딩 보여줘\"\n👥 팔로우 관리 - \"ss45 팔로우해줘\"\n\n모든 기능이 정상 작동합니다! 무엇을 도와드릴까요?",
      timestamp: new Date(),
      actions: []
    }
  ]);

  // AI 액션 실행기
  const { executeAction } = useAIActionExecutor((result) => {
    const resultMessage = {
      id: Date.now(),
      type: "assistant" as const,
      content: result.message || (result.success ? "작업이 완료되었습니다!" : "작업 중 오류가 발생했습니다."),
      timestamp: new Date(),
      actions: []
    };
    setMessages(prev => [...prev, resultMessage]);
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const now = Date.now();
    
    // 중복 전송 방지: 1초 이내 중복 전송 차단
    if (now - lastSubmitTime.current < 1000) {
      console.log('Duplicate submission blocked');
      return;
    }
    
    // 이미 처리 중이거나 빈 입력이면 무시
    if (isProcessing || !prompt.trim()) return;

    const currentPrompt = prompt.trim();
    console.log('Processing prompt:', currentPrompt); // 디버깅용
    
    // 마지막 전송 시간 업데이트
    lastSubmitTime.current = now;
    
    // 처리 중 상태로 설정하고 입력창 비우기
    setIsProcessing(true);
    setPrompt("");

    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now(),
      type: "user" as const,
      content: currentPrompt,
      timestamp: new Date(),
      actions: []
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // AI 액션 파싱 및 실행
      const aiResponse = await processAIPrompt(currentPrompt);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: "assistant" as const,
        content: aiResponse.content,
        timestamp: new Date(),
        actions: aiResponse.actions || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "assistant" as const,
        content: "죄송합니다. 응답 처리 중 오류가 발생했습니다.",
        timestamp: new Date(),
        actions: []
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      // 처리 완료 상태로 복원
      setIsProcessing(false);
    }
  }, [prompt, isProcessing]);

  const processAIPrompt = async (prompt: string) => {
    try {
      // OpenAI API 호출
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.response;

      // AI 응답 처리
      if (aiResponse.type === 'action') {
        return {
          content: aiResponse.message,
          actions: [{
            type: aiResponse.action,
            data: aiResponse.data
          }]
        };
      } else {
        return {
          content: aiResponse.message,
          actions: []
        };
      }

    } catch (error) {
      console.error('AI API Error:', error);
      
      // 간단한 명령어 파싱 폴백 (OpenAI 없이도 기본 기능 제공)
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('게시물 작성') || lowerPrompt.includes('포스트 작성')) {
        const content = prompt.replace(/게시물 작성해줘|포스트 작성해줘|게시물 써줘/gi, '').trim();
        if (content) {
          return {
            content: `"${content}" 내용으로 게시물을 작성하시겠습니까?\n\n(현재 AI 서비스 연결에 문제가 있어 기본 명령어 파싱을 사용중입니다)`,
            actions: [{
              type: 'CREATE_POST',
              data: { content }
            }]
          };
        }
      }
      
      if (lowerPrompt.includes('검색해줘') || lowerPrompt.includes('찾아줘')) {
        const searchTerm = prompt.replace(/검색해줘|찾아줘/gi, '').trim();
        if (searchTerm) {
          return {
            content: `"${searchTerm}"를 검색하시겠습니까?\n\n(현재 AI 서비스 연결에 문제가 있어 기본 명령어 파싱을 사용중입니다)`,
            actions: [{
              type: 'SEARCH',
              data: { query: searchTerm }
            }]
          };
        }
      }
      
      // 기본 오류 응답
      return {
        content: `AI 서비스 연결에 문제가 발생했습니다.

**환경변수 확인이 필요합니다:**
1. .env.local 파일에 OPENAI_API_KEY 추가
2. 개발 서버 재시작 (npm run dev)

**현재 사용 가능한 명령어:**
📝 "게시물 작성해줘 [내용]"
🔍 "[키워드] 검색해줘"
🔥 "트렌딩 보여줘"

에러: ${error instanceof Error ? error.message : 'Unknown error'}`,
        actions: []
      };
    }
  };

  const handleActionClick = async (action: any) => {
    try {
      if (action.type === 'CREATE_POST') {
        await executeAction.createPost(action.data.content);
      } else if (action.type === 'SEARCH') {
        await executeAction.searchUsers(action.data.query);
      } else if (action.type === 'FOLLOW') {
        await executeAction.followUser(action.data.userId);
      } else if (action.type === 'GET_TRENDING') {
        await executeAction.getTrending();
      } else if (action.type === 'GO_TO_PROFILE') {
        await executeAction.goToProfile();
      } else if (action.type === 'GO_TO_HOME') {
        await executeAction.goToHome();
      } else if (action.type === 'LIKE_POST') {
        await executeAction.likePost();
      } else if (action.type === 'BOOKMARK_POST') {
        await executeAction.bookmarkPost();
      } else if (action.type === 'VIEW_NOTIFICATIONS') {
        await executeAction.viewNotifications();
      }
    } catch (error) {
      console.error('Action execution error:', error);
      const errorMessage = {
        id: Date.now(),
        type: "assistant" as const,
        content: "작업 실행 중 오류가 발생했습니다. 다시 시도해주세요.",
        timestamp: new Date(),
        actions: []
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: "assistant" as const,
      content: "채팅이 초기화되었습니다. 새로운 대화를 시작해보세요!",
      timestamp: new Date(),
      actions: []
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed right-4 top-4 bottom-4 bg-white border border-border rounded-3xl z-50 flex flex-col transition-all duration-300 ease-in-out shadow-2xl",
      isMinimized ? "w-12" : "w-96"
    )}>
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-white rounded-t-3xl">
        {!isMinimized && (
          <>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-sm">AI Assistant</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={clearChat}
                title="채팅 초기화"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(true)}
                title="최소화"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
                title="닫기"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
        
        {isMinimized && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mx-auto"
            onClick={() => setIsMinimized(false)}
            title="확장"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 group",
                  message.type === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.type === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[280px] rounded-lg px-3 py-2 text-sm relative",
                  message.type === "user" 
                    ? "bg-primary text-primary-foreground ml-8" 
                    : "bg-muted"
                )}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {/* AI 액션 버튼들 */}
                  {message.type === "assistant" && (message as any).actions?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {(message as any).actions.map((action: any, index: number) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => handleActionClick(action)}
                        >
                          {action.type === 'CREATE_POST' && '✍️ 게시물 작성하기'}
                          {action.type === 'SEARCH' && '🔍 검색하기'}
                          {action.type === 'FOLLOW' && '👥 팔로우하기'}
                          {action.type === 'GET_TRENDING' && '🔥 트렌딩 보기'}
                          {action.type === 'GO_TO_PROFILE' && '👤 프로필로 이동'}
                          {action.type === 'GO_TO_HOME' && '🏠 홈으로 이동'}
                          {action.type === 'LIKE_POST' && '❤️ 좋아요 누르기'}
                          {action.type === 'BOOKMARK_POST' && '🔖 북마크 저장'}
                          {action.type === 'VIEW_NOTIFICATIONS' && '🔔 알림 확인'}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      title="복사"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>

                {message.type === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">You</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 입력 영역 */}
          <div className="border-t border-border p-4 bg-white rounded-b-3xl">
            {/* 빠른 프롬프트 - 입력 박스 위로 이동 */}
            <div className="mb-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">빠른 질문:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: "홈으로 가자", display: "🏠 홈" },
                  { text: "알림 보여줘", display: "🔔 알림" },
                  { text: "좋아요 눌러줘", display: "❤️ 좋아요" },
                  { text: "북마크 해줘", display: "🔖 북마크" }
                ].map((quickPrompt) => (
                  <Button
                    key={quickPrompt.text}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setPrompt(quickPrompt.text)}
                  >
                    {quickPrompt.display}
                  </Button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="AI에게 질문하거나 도움을 요청하세요..."
                  className="min-h-[80px] pr-12 resize-none border-black focus:border-black"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !isProcessing && !isComposing) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubmit(e);
                    }
                  }}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 bottom-2 h-8 w-8"
                  disabled={!prompt.trim() || isProcessing}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {isProcessing && (
                <div className="flex items-center justify-center text-xs">
                  <span className="text-blue-500 font-medium">처리 중...</span>
                </div>
              )}
            </form>

            {/* AI 모델 표시 버튼 - 좌측 정렬 */}
            <div className="flex items-center justify-start mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md border border-border/50"
                disabled
              >
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  GPT-3.5-turbo
                </span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
