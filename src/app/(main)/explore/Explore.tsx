"use client";

import { Beaker, CreditCard, Palette, User } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import Image from "next/image";
import Link from "next/link";
import LatestYoutubeVideo from "@/components/LatestYoutubeVideo";
import YoutubeStats from "@/components/YoutubeStats";

const services = [
  {
    name: "Vessel",
    description: "Vessel",
    url: "https://www.vessel.today/",
  },
];

export default function Explore() {
  const channelId = "UC9uSl4n2Zmz__HciYpWyASw";

  return (
    <div className="-mx-2 overflow-hidden rounded-2xl bg-card shadow-sm sm:mx-0">
      <div className="relative aspect-[32/9] w-full">
        <Image
          src="/banner.png"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src="/logo-bada.png"
              alt="Bada Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-black">
            여러분이 만나보실 수 있는
            <br />
            Divetobada만의 다양한 서비스!
          </h3>
          <p className="mt-1 text-base text-gray-500">
            대중문화예술을 한 손에 쥐어보세요
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <ServiceCard
              key={service.name}
              name={service.name}
              description={service.description}
              url={service.url}
            />
          ))}
        </div>
        {/* 실험실 섹션 */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center gap-2 mb-4">
            <Beaker className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-black">실험실</h3>
            <span className="text-sm text-gray-500">베타 기능들을 미리 체험해보세요</span>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-3">
            <Link 
              href="/membership/payment/artist_jun"
              className="group p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">멤버십 결제</p>
                  <p className="text-xs text-gray-500">결제 시스템 데모</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/creator/dashboard/membership"
              className="group p-4 border rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Palette className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">크리에이터 대시보드</p>
                  <p className="text-xs text-gray-500">창작자 관리 도구</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/user/subscriptions"
              className="group p-4 border rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">내 구독 관리</p>
                  <p className="text-xs text-gray-500">구독 현황 확인</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <LatestYoutubeVideo channelId={channelId} />
        <YoutubeStats channelId={channelId} />
      </div>
    </div>
  );
}
