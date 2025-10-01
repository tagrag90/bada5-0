"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const sampleEvents = [
  {
    id: 1,
    title: "2024 K-POP 팝업 스토어",
    description: "최신 K-POP 굿즈와 포토존을 만나보세요! 한정판 앨범과 포토카드 증정 이벤트도 진행됩니다.",
    location: "서울 강남구 신사동 가로수길",
    startDate: "2024-10-15",
    endDate: "2024-10-25",
    imageUrl: "/banner.png",
    totalTickets: 500,
    remainingTickets: 247,
    ticketTypes: ["일반 입장", "VIP 조기입장"],
  },
  {
    id: 2,
    title: "인디 아티스트 전시회",
    description: "신진 아티스트들의 작품을 한자리에서 감상할 수 있는 특별 전시회입니다.",
    location: "서울 종로구 인사동 갤러리",
    startDate: "2024-11-01",
    endDate: "2024-11-15",
    imageUrl: "/banner.png",
    totalTickets: 300,
    remainingTickets: 189,
    ticketTypes: ["일반 입장", "도슨트 투어"],
  },
  {
    id: 3,
    title: "크리에이터 밋업 & 네트워킹",
    description: "다양한 분야의 크리에이터들과 교류하고 협업 기회를 찾아보세요.",
    location: "서울 마포구 홍대 카페거리",
    startDate: "2024-10-20",
    endDate: "2024-10-20",
    imageUrl: "/banner.png",
    totalTickets: 100,
    remainingTickets: 23,
    ticketTypes: ["일반 참가", "스피커 참가"],
  },
];

export default function EventListDemo() {
  return (
    <div className="space-y-4">
      {/* 안내 메시지 */}
      <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 아래는 샘플 이벤트입니다. 실제 데이터는 백엔드 연결 후 표시됩니다.
        </p>
      </div>

      {/* 이벤트 카드 리스트 */}
      {sampleEvents.map((event) => (
        <div
          key={event.id}
          className="rounded-2xl bg-card shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* 이벤트 이미지 */}
          <div className="relative aspect-[21/9] w-full bg-muted">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
            {/* 잔여 티켓 배지 */}
            <div className="absolute top-3 right-3">
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.remainingTickets < 50
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {event.remainingTickets}석 남음
              </div>
            </div>
          </div>

          {/* 이벤트 정보 */}
          <div className="p-5 space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            </div>

            {/* 상세 정보 */}
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground">
                <span className="font-medium">기간:</span> {event.startDate} ~ {event.endDate}
              </div>
              <div className="text-muted-foreground">
                <span className="font-medium">장소:</span> {event.location}
              </div>
              <div className="text-muted-foreground">
                <span className="font-medium">신청 현황:</span> 총 {event.totalTickets}석 중 {event.totalTickets - event.remainingTickets}명 신청
              </div>
            </div>

            {/* 티켓 타입 */}
            <div className="flex flex-wrap gap-2">
              {event.ticketTypes.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-muted rounded-full text-xs"
                >
                  {type}
                </span>
              ))}
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" size="sm">
                티켓 신청하기
              </Button>
              <Button variant="outline" size="sm">
                상세 보기
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* 더보기 버튼 */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" size="lg">
          더 많은 이벤트 보기
        </Button>
      </div>
    </div>
  );
}

