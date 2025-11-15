"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Calendar, Share2, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/layout/SidebarContext";

export default function NodeExamplesPage() {
  const { setSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('docs');
    
    return () => {
      setSidebar('none');
    };
  }, [setSidebar]);

  // 노드 예제 데이터
  const exampleNodes = [
    {
      id: "planning-example",
      type: "PLANNING",
      label: "기획 노드",
      emoji: "🎯",
      content: "이것은 기획 노드의 예제입니다. 보라색 테두리로 강조 표시됩니다.",
      borderColor: "#9333ea",
      features: [
        "보라색 테두리로 강조 표시",
        "이모지 추가 가능",
        "다른 노드와 연결 가능",
      ],
    },
    {
      id: "note-example",
      type: "NOTE",
      label: "메모 노드",
      emoji: "📝",
      content: "이것은 메모 노드의 예제입니다. 리치 텍스트 에디터를 지원하며 HTML 콘텐츠를 렌더링할 수 있습니다.",
      borderColor: "#000",
      features: [
        "리치 텍스트 에디터 지원",
        "HTML 콘텐츠 렌더링",
        "무제한 텍스트 입력",
      ],
    },
    {
      id: "schedule-example",
      type: "SCHEDULE",
      label: "캘린더 노드",
      emoji: "📅",
      content: "시작일: 2025-01-15\n종료일: 2025-01-22\n이벤트 타입: 일정",
      borderColor: "#000",
      features: [
        "시작일/종료일 설정",
        "이벤트 타입 표시",
        "캘린더 뷰와 연동",
      ],
    },
    {
      id: "resource-example",
      type: "RESOURCE",
      label: "드라이브 노드",
      emoji: "📁",
      content: "예제 파일 1.pdf\n예제 파일 2.docx\n예제 파일 3.xlsx",
      borderColor: "#000",
      features: [
        "다중 파일 업로드",
        "파일 목록 표시",
        "파일 다운로드 기능",
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/docs-old">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">뒤로 가기</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">노드 예제</h1>
          <p className="text-muted-foreground mt-2">
            워크스페이스에서 사용할 수 있는 다양한 노드 타입의 실제 예제를 확인하세요.
          </p>
        </div>
      </div>

      {/* 노드 예제 그리드 */}
      <div className="grid md:grid-cols-2 gap-8">
        {exampleNodes.map((node) => (
          <div key={node.id} className="bg-card border border-border rounded-lg p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">{node.label}</h3>
              <code className="text-xs bg-accent px-2 py-1 rounded">{node.type}</code>
            </div>
            
            {/* 노드 프리뷰 */}
            <div className="relative mb-4" style={{ minHeight: "200px" }}>
              <div 
                className="bg-white rounded-lg p-4 relative"
                style={{ 
                  border: `2px solid ${node.borderColor}`,
                  borderRadius: "8px",
                  minHeight: "150px",
                }}
              >
                {/* 연결점 시뮬레이션 */}
                <div 
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-white"
                  style={{ borderColor: node.borderColor }}
                />
                <div 
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-white"
                  style={{ borderColor: node.borderColor }}
                />
                
                {/* 노드 내용 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-base">{node.emoji}</span>
                    <div className="font-semibold text-sm text-black break-words flex-1">
                      {node.label}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 whitespace-pre-line break-words">
                    {node.content}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold text-sm mb-2">특징</h4>
              <ul className="space-y-1">
                {node.features.map((feature, index) => (
                  <li key={index} className="text-xs text-muted-foreground">
                    • {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* 추가 정보 */}
      <div className="mt-8 bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">노드 사용법</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">노드 추가</h4>
            <p className="text-sm text-muted-foreground">
              워크스페이스 화면에서 좌측 사이드바의 노드 추가 버튼을 클릭하여 원하는 타입의 노드를 추가할 수 있습니다.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">노드 편집</h4>
            <p className="text-sm text-muted-foreground">
              노드에 마우스를 올리면 편집 버튼이 나타납니다. 클릭하여 노드의 제목과 내용을 수정할 수 있습니다.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">노드 연결</h4>
            <p className="text-sm text-muted-foreground">
              노드의 우측 연결점에서 드래그하여 다른 노드의 좌측 연결점에 드롭하면 두 노드를 연결할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

