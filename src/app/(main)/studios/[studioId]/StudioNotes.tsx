"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function StudioNotes({ studioId }: { studioId: string }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    date: "",
    time: "",
    location: "",
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["studio-items", studioId, "notes"],
    queryFn: async () => {
      // 모든 아이템 가져오기 (타입 구분 없이)
      const res = await fetch(`/api/studios/${studioId}/items`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const tags = data.tags
        ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
      
      const res = await fetch(`/api/studios/${studioId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          type: "NOTE",
          tags,
          ...(data.date && { date: data.date }),
          ...(data.time && { time: data.time }),
          ...(data.location && { location: data.location }),
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create note");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-items", studioId] });
      setIsAddNoteOpen(false);
      setFormData({ title: "", content: "", tags: "", date: "", time: "", location: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(`/api/studios/${studioId}/items/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-items", studioId] });
    },
  });

  const filteredNotes = notes.filter((note: any) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="메모 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsAddNoteOpen(true)}>
          메모 추가
        </Button>
      </div>

      {/* 메모 그리드 */}
      <div>
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note: any) => (
              <Card 
                key={note.id} 
                className="bg-yellow-50 border-yellow-200 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedNote(note)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{note.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {note.type === "NOTE" ? "메모" : "일정"}
                        </Badge>
                        {note.date && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(note.date).toLocaleDateString("ko-KR")}
                            {note.time && ` ${note.time}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(note.id);
                      }}
                      className="text-red-500"
                    >
                      삭제
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 line-clamp-4 whitespace-pre-line">
                    {note.content}
                  </p>
                  {note.location && (
                    <p className="text-xs text-muted-foreground mt-2">
                      📍 {note.location}
                    </p>
                  )}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {note.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    {note.author.displayName}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">메모가 없습니다</p>
          </Card>
        )}
      </div>

      {/* 메모 추가 다이얼로그 */}
      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle>새 메모 작성</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="min-h-[200px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="예: 아이디어, 중요"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">날짜 (선택)</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">시간 (선택)</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">장소 (선택)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="예: 회의실 A"
              />
            </div>
            {createMutation.error && (
              <p className="text-sm text-red-500">
                {(createMutation.error as Error).message}
              </p>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending ? "저장 중..." : "메모 저장"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddNoteOpen(false)}
              >
                취소
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 메모 상세보기 다이얼로그 */}
      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 p-6 rounded-2xl">
          {selectedNote && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedNote.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {selectedNote.type === "NOTE" ? "메모" : "일정"}
                  </Badge>
                  {selectedNote.date && (
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedNote.date).toLocaleDateString("ko-KR")}
                      {selectedNote.time && ` ${selectedNote.time}`}
                    </span>
                  )}
                </div>

                <p className="text-sm whitespace-pre-line">
                  {selectedNote.content}
                </p>

                {selectedNote.location && (
                  <p className="text-sm text-muted-foreground">
                    📍 {selectedNote.location}
                  </p>
                )}

                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedNote.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t text-sm text-muted-foreground">
                  작성자: {selectedNote.author.displayName}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedNote(null)}
                  >
                    닫기
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => {
                      deleteMutation.mutate(selectedNote.id);
                      setSelectedNote(null);
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

