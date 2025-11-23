// 서버 컴포넌트 - 초기 데이터 페칭
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataSelect, PostsPage } from "@/lib/types";
import ForYouFeedClient from "./ForYouFeedClient";

export default async function ForYouFeedServer() {
  const { user } = await validateRequest();
  const isLoggedIn = !!user;

  // 초기 데이터를 서버에서 페칭
  let initialData: PostsPage | null = null;
  
  if (isLoggedIn) {
    try {
      const posts = await prisma.post.findMany({
        select: getPostDataSelect(user.id),
        orderBy: { createdAt: "desc" },
        take: 11, // 10개 + 1개 (nextCursor 확인용)
      });

      const nextCursor = posts.length > 10 ? posts[10].id : null;
      initialData = {
        posts: posts.slice(0, 10),
        nextCursor,
      };
    } catch (error) {
      // 에러 발생 시 초기 데이터 없이 클라이언트에서 페칭
      initialData = null;
    }
  }

  return <ForYouFeedClient initialData={initialData} />;
}

