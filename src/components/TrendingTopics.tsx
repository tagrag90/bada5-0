import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";
import { unstable_cache } from "next/cache";
import Link from "next/link";

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[a-zA-Z0-9가-힣_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            WHERE content ~ '#[a-zA-Z0-9가-힣_]+'
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;

    return result
      .filter((row) => row.hashtag && row.hashtag.startsWith('#') && row.hashtag.length > 1)
      .map((row) => ({
        hashtag: row.hashtag,
        count: Number(row.count),
      }));
  },
  ["trending_topics"],
  {
    revalidate: 5 * 60, // 5분마다 캐시 갱신
  },
);

interface TrendingTopicsProps {
  className?: string;
  showTitle?: boolean;
}

export default async function TrendingTopics({ className = "", showTitle = true }: TrendingTopicsProps) {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className={`space-y-5 rounded-2xl bg-card p-5 shadow-sm ${className}`}>
      {showTitle && (
        <div className="text-xl font-bold">요즘 이런게 유행이래요</div>
      )}
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
