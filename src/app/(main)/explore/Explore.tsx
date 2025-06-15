"use client";

import { Zap } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import Image from "next/image";
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
        <LatestYoutubeVideo channelId={channelId} />
        <YoutubeStats channelId={channelId} />
      </div>
    </div>
  );
}
