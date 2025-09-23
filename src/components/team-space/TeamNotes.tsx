"use client";

import { useState } from "react";
import { Plus, Search, Pin, Trash2, Edit3, Filter, Calendar, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 목업 데이터
const mockNotes = [
  {
    id: 1,
    title: "콘텐츠 아이디어 브레인스토밍",
    content: "1. 일상 브이로그 시리즈\n2. 팬과의 Q&A 세션\n3. 커버 댄스 챌린지\n4. 메이킹 필름 공개",
    author: "김민지",
    createdAt: "2024-01-10T10:30:00",
    updatedAt: "2024-01-12T15:20:00",
    isPinned: true,
    tags: ["아이디어", "콘텐츠"],
    category: "planning",
    color: "bg-yellow-100 border-yellow-300"
  },
  {
    id: 2,
    title: "촬영 준비 체크리스트",
    content: "✅ 의상 준비\n✅ 메이크업 아티스트 섭외\n⏳ 촬영 장비 점검\n⏳ 로케이션 섭외\n❌ 촬영 허가 신청",
    author: "하니",
    createdAt: "2024-01-08T14:15:00",
    updatedAt: "2024-01-13T09:45:00",
    isPinned: false,
    tags: ["촬영", "체크리스트"],
    category: "production",
    color: "bg-blue-100 border-blue-300"
  },
  {
    id: 3,
    title: "팬미팅 기획안",
    content: "• 일시: 2024년 3월 15일 오후 7시\n• 장소: 올림픽공원 체조경기장\n• 프로그램: 토크, 게임, 공연\n• 예상 관객: 3,000명",
    author: "다니엘",
    createdAt: "2024-01-05T16:20:00",
    updatedAt: "2024-01-11T11:30:00",
    isPinned: true,
    tags: ["팬미팅", "이벤트"],
    category: "event",
    color: "bg-purple-100 border-purple-300"
  },
  {
    id: 4,
    title: "월간 목표 정리",
    content: "1월 목표:\n- 신곡 녹음 완료\n- 뮤직비디오 촬영\n- 예능 프로그램 3회 출연\n- SNS 팔로워 10만명 달성",
    author: "혜린",
    createdAt: "2024-01-01T09:00:00",
    updatedAt: "2024-01-14T18:15:00",
    isPinned: false,
    tags: ["목표", "월간계획"],
    category: "planning",
    color: "bg-green-100 border-green-300"
  },
  {
    id: 5,
    title: "협업 아티스트 후보",
    content: "피처링 후보:\n1. IU - 발라드 곡\n2. (여자)아이들 - 댄스 곡\n3. 르세라핌 - 퍼포먼스 곡\n\n컨택 예정일: 1월 20일",
    author: "김민지",
    createdAt: "2024-01-07T13:45:00",
    updatedAt: "2024-01-07T13:45:00",
    isPinned: false,
    tags: ["협업", "음악"],
    category: "music",
    color: "bg-pink-100 border-pink-300"
  }
];

const categories = {
  all: "전체",
  planning: "기획",
  production: "제작",
  event: "이벤트",
  music: "음악"
};

export default function TeamNotes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<typeof mockNotes[0] | null>(null);

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const regularNotes = filteredNotes.filter(note => !note.isPinned);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "오늘";
    if (diffDays === 2) return "어제";
    if (diffDays <= 7) return `${diffDays - 1}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">팀 메모</h2>
        <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>메모 추가</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white p-6">
            <DialogHeader className="pb-4">
              <DialogTitle>새 메모 작성</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-2 bg-white px-1">
              <div className="grid gap-2">
                <Label htmlFor="note-title">제목</Label>
                <Input id="note-title" placeholder="메모 제목을 입력하세요" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note-content">내용</Label>
                <Textarea 
                  id="note-content" 
                  placeholder="메모 내용을 입력하세요" 
                  className="min-h-[200px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note-tags">태그</Label>
                <Input 
                  id="note-tags" 
                  placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 아이디어, 중요)" 
                />
              </div>
              <div className="flex justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddNoteOpen(false)} className="flex-1">
                  취소
                </Button>
                <Button onClick={() => setIsAddNoteOpen(false)} className="flex-1">
                  메모 저장
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="메모 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>{categories[selectedCategory as keyof typeof categories]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.entries(categories).map(([key, label]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setSelectedCategory(key)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">그리드 보기</TabsTrigger>
          <TabsTrigger value="list">목록 보기</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          {/* 고정된 메모 */}
          {pinnedNotes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Pin className="h-4 w-4" />
                <span>고정된 메모</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map((note) => (
                  <Card 
                    key={note.id} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${note.color}`}
                    onClick={() => setSelectedNote(note)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-2">{note.title}</CardTitle>
                        <Pin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-line">
                        {note.content}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Hash className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{note.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(note.updatedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 일반 메모 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">모든 메모</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regularNotes.map((note) => (
                <Card 
                  key={note.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${note.color}`}
                  onClick={() => setSelectedNote(note)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base line-clamp-2">{note.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-line">
                      {note.content}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Hash className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{note.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(note.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {[...pinnedNotes, ...regularNotes].map((note) => (
            <Card 
              key={note.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedNote(note)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      {note.isPinned && <Pin className="h-4 w-4 text-gray-500" />}
                      <h3 className="font-medium">{note.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {note.content}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{note.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(note.updatedAt)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* 메모 상세보기 다이얼로그 */}
      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className="sm:max-w-[600px] bg-white p-6">
          {selectedNote && (
            <>
              <DialogHeader className="bg-white pb-4">
                <div className="flex items-start justify-between">
                  <DialogTitle className="flex items-center space-x-2">
                    {selectedNote.isPinned && <Pin className="h-4 w-4" />}
                    <span>{selectedNote.title}</span>
                  </DialogTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-6 bg-white px-1">
                <div className="text-sm text-gray-600 whitespace-pre-line">
                  {selectedNote.content}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedNote.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <Hash className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>작성자: {selectedNote.author}</span>
                  </div>
                  <div className="text-right">
                    <div>작성: {formatDate(selectedNote.createdAt)}</div>
                    <div>수정: {formatDate(selectedNote.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
