"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventListDemo from "./EventListDemo";

export default function TicketingDemoLayout() {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="w-full space-y-5">
      {/* 헤더 */}
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">티켓팅 시스템</h1>
          <p className="text-sm text-muted-foreground mt-1">
            팝업 스토어, 이벤트를 위한 간편한 티켓 발급 시스템 (데모)
          </p>
        </div>
        <div className="mt-4 flex gap-2 text-xs">
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
            베타 기능
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            결제 없이 무료 발급
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
            QR 코드 기반
          </span>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 bg-card">
          <TabsTrigger value="events">
            <span>이벤트 목록</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-5">
          <EventListDemo />
        </TabsContent>
      </Tabs>

      {/* 준비 중 안내 */}
      <div className="rounded-2xl bg-card p-6 shadow-sm text-center">
        <p className="text-muted-foreground">
          🚧 이벤트 생성, 내 티켓, 통계 기능은 백엔드 구축 후 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}


