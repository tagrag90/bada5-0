"use client";
"use client";


import { Zap } from "lucide-react";
import ServiceCard from "./ServiceCard";
import Image from "next/image";

const services = [
  {
    name: "Divetobada",
    description: "문화예술을 사랑하는 당신을 위한 소셜 미디어",
    url: "https://www.divetobada.com"
  },
  {
    name: "Vessel",
    description: "내가 좋아하는 것으로만 아카이빙 블로그",
    url: "https://www.vessel.today"
  },
  {
    name: "Onbuniz",
    description: "Jeanzforfree - 응원하는 팬들 모두 모여라👋",
    url: "#"
  },
  {
    name: "매거진 [굄성]",
    description: "문화예술을 즐겁고, 더 다양한 이야기들이 있어요!",
    url: "https://profuse-soil-41e.notion.site/GUEMSoNG-Digital-Magazine-1788bfe8131a80ecb20ed23cd21f2fdf?pvs=4"
  },
  {
    name: "Playlist_bada",
    description: "Bada가 추천하는 무지 일상속의 음악 심상",
    url: "#"
  }
];

export default function Explore() {
  return (
    <div className="space-y-6 rounded-2xl bg-card p-6 shadow-sm -mx-2 sm:mx-0">
      <div className="flex items-center gap-3 pl-2">
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
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
          여러분이 만나보실 수 있는<br />
          Divetobada만의 다양한 서비스!
        </h3>
        <p className="text-base text-gray-500 mt-1">
          대중문화예술을 한 손에 쥐어보세요
        </p>
      </div>
      
      <div className="grid gap-4 mt-6 sm:grid-cols-2">
        {services.map((service) => (
          <ServiceCard 
            key={service.name}
            name={service.name} 
            description={service.description}
            url={service.url}
          />
        ))}
      </div>
    </div>
  );
}
