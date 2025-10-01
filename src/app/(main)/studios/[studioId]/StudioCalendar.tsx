"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();
const firstDayOfMonth = (year: number, month: number) =>
  new Date(year, month - 1, 1).getDay();

export default function StudioCalendar({ studioId }: { studioId: string }) {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: events = [] } = useQuery({
    queryKey: ["studio-items", studioId, "calendar", year, month],
    queryFn: async () => {
      // 날짜가 있는 모든 아이템 가져오기 (NOTE든 EVENT든)
      const res = await fetch(
        `/api/studios/${studioId}/items?year=${year}&month=${month}&hasDate=true`
      );
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/studios/${studioId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          type: "EVENT",
          content: data.description || "",
        }),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["studio-items", studioId],
      });
      setIsAddEventOpen(false);
      setFormData({ title: "", date: "", time: "", location: "", description: "" });
    },
  });

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === "prev" ? -1 : 1));
      return newDate;
    });
  };

  const getDayEvents = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((event: any) => event.date.startsWith(dateStr));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold min-w-[120px] text-center">
            {year}년 {month}월
          </span>
          <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={() => setIsAddEventOpen(true)}>
          일정 추가
        </Button>
      </div>

      {/* 캘린더 */}
      <Card>
        <CardContent className="p-6">
          {/* 요일 */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => (
              <div
                key={day}
                className={`p-2 text-center text-sm font-medium ${
                  idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth(year, month) }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 p-1" />
            ))}

            {Array.from({ length: daysInMonth(year, month) }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getDayEvents(day);

              return (
                <div
                  key={day}
                  className="h-24 p-1 border rounded cursor-pointer hover:bg-muted"
                >
                  <div className="text-sm font-medium">{day}</div>
                  <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 2).map((event: any) => (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                          event.type === "EVENT" ? "bg-blue-500" : "bg-green-500"
                        }`}
                        title={`${event.type === "NOTE" ? "[메모] " : ""}${event.title}`}
                      >
                        {event.type === "NOTE" && "📝 "}
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 일정 추가 다이얼로그 */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 p-6">
          <DialogHeader>
            <DialogTitle>새 일정 추가</DialogTitle>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">날짜</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">시간</Label>
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
              <Label htmlFor="location">장소</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending ? "추가 중..." : "일정 추가"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddEventOpen(false)}
              >
                취소
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

