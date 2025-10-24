"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";

// 익명 사용자 ID 생성
function getAnonymousId(): string {
  let id = localStorage.getItem('anonymous-feedback-id');
  if (!id) {
    const count = parseInt(localStorage.getItem('anonymous-count') || '0') + 1;
    id = `익명의 빌려온 고양이 ${count}`;
    localStorage.setItem('anonymous-feedback-id', id);
    localStorage.setItem('anonymous-count', count.toString());
  }
  return id;
}

export default function FeedbackPage() {
  const [anonymousId, setAnonymousId] = useState('');
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    setAnonymousId(getAnonymousId());
    
    // LocalStorage에서 피드백 로드
    const saved = localStorage.getItem('docs-feedbacks');
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load feedbacks');
      }
    }
  }, []);

  const handleSubmit = (content: string) => {
    const newFeedback = {
      id: Date.now().toString(),
      content,
      author: anonymousId,
      createdAt: new Date().toISOString(),
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem('docs-feedbacks', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">피드백 보내기</h1>
        </div>
        <p className="text-muted-foreground">
          개선 아이디어, 버그 제보, 질문 등 자유롭게 남겨주세요. 로그인 없이도 작성 가능합니다.
        </p>
      </div>

      {/* 익명 사용자 정보 */}
      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
        <div className="w-10 h-10 rounded-full bg-gray-400 flex-shrink-0" />
        <div>
          <p className="font-semibold">{anonymousId}</p>
          <p className="text-xs text-muted-foreground">익명으로 작성됩니다</p>
        </div>
      </div>

      {/* 간소화된 에디터 */}
      <div className="bg-card p-6 rounded-xl shadow-sm border">
        <h2 className="font-semibold mb-4">새 피드백 작성</h2>
        <div className="space-y-4">
          <textarea
            placeholder="피드백을 입력하세요..."
            className="w-full min-h-[120px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            id="feedback-textarea"
          />
          <button
            onClick={() => {
              const textarea = document.getElementById('feedback-textarea') as HTMLTextAreaElement;
              if (textarea.value.trim()) {
                handleSubmit(textarea.value);
                textarea.value = '';
              }
            }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            제출하기
          </button>
        </div>
      </div>

      {/* 피드백 목록 */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">최근 피드백</h2>
        {feedbacks.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            아직 피드백이 없습니다. 첫 번째 피드백을 남겨주세요!
          </p>
        ) : (
          feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-card p-4 rounded-lg shadow-sm border">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{feedback.author}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(feedback.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{feedback.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

