"use client";

import { Zap } from "lucide-react";
import ServiceCard from "./ServiceCard";

const services = [
  {
    icon: "/logo-bada.png",
    name: "Bada",
    description: "문화예술을 사랑하는 당신을 위한 소셜 미디어",
    url: "https://www.divetobada.com"
  },
  {
    icon: "/logo_vessel.png",
    name: "Vessel",
    description: "내가 좋아하는 것으로만 아카이빙 블로그",
    url: "https://www.vessel.today"
  },
  {
    icon: "/newjeanslogo.jpg",
    name: "Onbuniz",
    description: "Jeanzforfree - 응원하는 팬들 모두 모여라👋",
    // url: "/"
  }
];

export default function Explore() {
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 pl-2">
        <Zap className="fill-black" />
        <div className="text-xl font-bold">탐험</div>
      </div>
      <div className="text-lg text-black font-semibold">
        Team_bada에서 만든 서비스들을 탐험해보세요!
      </div>
      <div className="text-base text-gray-400 font-light">
        Let's Find all services and products that Team_bada made!
      </div>
      <div className="text-base text-gray-400">
        {services.map((service) => (
          <ServiceCard 
            key={service.name}
            icon={service.icon}
            name={service.name} 
            description={service.description}
            url={service.url || '#'} // url이 없는 경우 기본값 설정
          />
        ))}
      </div>
    </div>
  );
}
