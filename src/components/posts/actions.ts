"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
// import { getPostDataInclude } from "@/lib/types"; // 배포 serialize 문제로 제거

export async function deletePost(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!post) throw new Error("Post not found");

  if (post.userId !== user.id) throw new Error("Unauthorized");

  await prisma.post.delete({
    where: { id },
  });

  // 간단한 결과 반환
  return { id, deleted: true };
}
