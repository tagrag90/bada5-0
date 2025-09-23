"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, Users, MapPin, Calendar, Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// 목업 데이터
const mockEvents = [
  {
    id: 1,
    title: "콘텐츠 기획 회의",
    date: "2024-01-15",
    time: "14:00",
    duration: "2시간",
    attendees: ["김민지", "하니", "다니엘"],
    location: "온라인",
    type: "meeting",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "촬영 스케줄",
    date: "2024-01-18",
    time: "10:00",
    duration: "6시간",
    attendees: ["전체 멤버"],
    location: "스튜디오 A",
    type: "shoot",
    color: "bg-purple-500"
  },
  {
    id: 3,
    title: "음원 발매",
    date: "2024-01-25",
    time: "18:00",
    duration: "1일",
    attendees: ["전체 멤버"],
    location: "온라인",
    type: "release",
    color: "bg-green-500"
  },
  {
    id: 4,
    title: "라이브 방송",
    date: "2024-01-28",
    time: "20:00",
    duration: "1시간",
    attendees: ["김민지", "하니"],
    location: "사무실",
    type: "live",
    color: "bg-red-500"
  },
  {
    id: 5,
    title: "안무 연습",
    date: "2024-01-12",
    time: "15:00",
    duration: "3시간",
    attendees: ["전체 멤버"],
    location: "연습실 B",
    type: "practice",
    color: "bg-orange-500"
  },
  {
    id: 6,
    title: "포토슈팅",
    date: "2024-01-20",
    time: "09:00",
    duration: "5시간",
    attendees: ["전체 멤버"],
    location: "한강공원",
    type: "shoot",
    color: "bg-purple-500"
  },
  {
    id: 7,
    title: "팬사인회",
    date: "2024-01-30",
    time: "14:00",
    duration: "3시간",
    attendees: ["전체 멤버"],
    location: "롯데월드몰",
    type: "event",
    color: "bg-pink-500"
  },
  {
    id: 8,
    title: "녹음 세션",
    date: "2024-01-22",
    time: "11:00",
    duration: "4시간",
    attendees: ["다니엘", "해린"],
    location: "녹음실 C",
    type: "recording",
    color: "bg-indigo-500"
  },
  {
    id: 9,
    title: "인터뷰 촬영",
    date: "2024-01-16",
    time: "16:30",
    duration: "1시간 30분",
    attendees: ["김민지", "하니", "혜인"],
    location: "KBS 스튜디오",
    type: "interview",
    color: "bg-teal-500"
  },
  {
    id: 10,
    title: "의상 피팅",
    date: "2024-01-14",
    time: "13:00",
    duration: "2시간",
    attendees: ["전체 멤버"],
    location: "의상실",
    type: "fitting",
    color: "bg-yellow-500"
  },
  {
    id: 11,
    title: "메이크업 리허설",
    date: "2024-01-17",
    time: "10:30",
    duration: "2시간 30분",
    attendees: ["전체 멤버"],
    location: "메이크업실",
    type: "rehearsal",
    color: "bg-cyan-500"
  },
  {
    id: 12,
    title: "음악 방송 출연",
    date: "2024-01-26",
    time: "17:00",
    duration: "2시간",
    attendees: ["전체 멤버"],
    location: "MBC 드림센터",
    type: "broadcast",
    color: "bg-rose-500"
  },
  {
    id: 13,
    title: "팀 미팅",
    date: "2024-01-11",
    time: "19:00",
    duration: "1시간 30분",
    attendees: ["전체 멤버", "매니저"],
    location: "회의실",
    type: "meeting",
    color: "bg-blue-500"
  },
  {
    id: 14,
    title: "라디오 출연",
    date: "2024-01-23",
    time: "21:00",
    duration: "1시간",
    attendees: ["김민지", "다니엘"],
    location: "SBS 파워FM",
    type: "radio",
    color: "bg-violet-500"
  },
  {
    id: 15,
    title: "뮤직비디오 촬영",
    date: "2024-01-19",
    time: "08:00",
    duration: "10시간",
    attendees: ["전체 멤버"],
    location: "세트장",
    type: "shoot",
    color: "bg-purple-500"
  }
];

const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
const firstDayOfMonth = (year: number, month: number) => new Date(year, month - 1, 1).getDay();

export default function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // 2024년 1월로 초기화
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const today = "2024-01-15"; // 데모용 오늘 날짜 설정

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDayEvents = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockEvents.filter(event => event.date === dateStr);
  };

  const getEventTypeLabel = (type: string) => {
    const types = {
      meeting: "회의",
      shoot: "촬영",
      release: "발매",
      live: "라이브",
      practice: "연습",
      event: "이벤트",
      recording: "녹음",
      interview: "인터뷰",
      fitting: "피팅",
      rehearsal: "리허설",
      broadcast: "방송",
      radio: "라디오"
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-6">
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">팀 캘린더</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[120px] text-center">
              {year}년 {month}월
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>일정 추가</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white p-6">
            <DialogHeader className="pb-4">
              <DialogTitle>새 일정 추가</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-2 bg-white px-1">
              <div className="grid gap-2">
                <Label htmlFor="title">제목</Label>
                <Input id="title" placeholder="일정 제목을 입력하세요" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">날짜</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">시간</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">장소</Label>
                <Input id="location" placeholder="장소를 입력하세요" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">설명</Label>
                <Textarea id="description" placeholder="일정에 대한 설명을 입력하세요" />
              </div>
              <div className="pt-4">
                <Button onClick={() => setIsAddEventOpen(false)} className="w-full">
                  일정 추가
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 캘린더 그리드 */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                  <div
                    key={day}
                    className={`p-2 text-center text-sm font-medium ${
                      index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* 캘린더 날짜 */}
              <div className="grid grid-cols-7 gap-1">
                {/* 빈 셀 (이전 달) */}
                {Array.from({ length: firstDayOfMonth(year, month) }).map((_, index) => (
                  <div key={`empty-${index}`} className="h-24 p-1"></div>
                ))}

                {/* 현재 달의 날짜들 */}
                {Array.from({ length: daysInMonth(year, month) }).map((_, index) => {
                  const day = index + 1;
                  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const dayEvents = getDayEvents(day);
                  const isToday = dateStr === today;
                  const isSelected = dateStr === selectedDate;

                  return (
                    <div
                      key={day}
                      className={`h-24 p-1 border rounded cursor-pointer hover:bg-gray-50 ${
                        isToday ? 'bg-blue-50 border-blue-300' : ''
                      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                        {day}
                      </div>
                      <div className="space-y-1 mt-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity ${event.color}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2}개 더
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 - 오늘의 일정 & 다가오는 일정 */}
        <div className="space-y-6">
          {/* 오늘의 일정 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">오늘의 일정</CardTitle>
            </CardHeader>
            <CardContent>
              {mockEvents.filter(event => event.date === today).length > 0 ? (
                <div className="space-y-3">
                  {mockEvents.filter(event => event.date === today).map((event) => (
                    <div 
                      key={event.id} 
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant="secondary">
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>{event.time} ({event.duration})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-3 w-3" />
                          <span>{Array.isArray(event.attendees) ? event.attendees.join(', ') : event.attendees}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">오늘 예정된 일정이 없습니다</p>
              )}
            </CardContent>
          </Card>

          {/* 다가오는 일정 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">다가오는 일정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockEvents.filter(event => event.date > today).slice(0, 3).map((event) => (
                  <div 
                    key={event.id} 
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getEventTypeLabel(event.type)}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div>{event.date} {event.time}</div>
                      <div>{event.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 일정 상세보기 다이얼로그 */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white p-6">
          {selectedEvent && (
            <>
              <DialogHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded ${selectedEvent.color}`}></div>
                    <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 bg-white px-1">
                {/* 일정 타입 */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-sm">
                    {getEventTypeLabel(selectedEvent.type)}
                  </Badge>
                </div>

                {/* 일정 정보 */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">날짜 및 시간</p>
                      <p className="text-gray-600">{selectedEvent.date} {selectedEvent.time}</p>
                      <p className="text-sm text-gray-500">소요 시간: {selectedEvent.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">장소</p>
                      <p className="text-gray-600">{selectedEvent.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">참석자</p>
                      <p className="text-gray-600">
                        {Array.isArray(selectedEvent.attendees) 
                          ? selectedEvent.attendees.join(', ') 
                          : selectedEvent.attendees}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                    닫기
                  </Button>
                  <Button>
                    수정하기
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
