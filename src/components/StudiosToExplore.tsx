import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

export default async function StudiosToExplore() {
  const { user } = await validateRequest();

  if (!user) return null;

  // 최근 생성된 공개 스튜디오 (모든 스튜디오 포함)
  const studios = await prisma.studio.findMany({
    where: {
      isPublic: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      avatarUrl: true,
      subscribersCount: true,
      type: true,
      _count: {
        select: {
          members: true,
          events: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  if (studios.length === 0) return null;

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">새로 생긴 스튜디오</div>
      {studios.map((studio) => (
        <div key={studio.id} className="flex items-center justify-between gap-3">
          <Link
            href={`/studios/${studio.id}`}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden relative flex-shrink-0">
              <Image
                src={studio.avatarUrl || "/logo-bada.png"}
                alt={studio.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {studio.name}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground text-sm">
                구독자 {formatNumber(studio.subscribersCount)}
              </p>
            </div>
          </Link>
          <Link href={`/studios/${studio.id}`}>
            <Button variant="outline" size="sm">
              보기
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}

