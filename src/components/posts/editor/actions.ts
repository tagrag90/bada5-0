"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema, updatePostSchema } from "@/lib/validation";
import { z } from "zod";

const PostSchema = z.object({
  content: z.string().optional(),
  mediaIds: z.array(z.string()).default([]),
});

const UpdatePostSchema = z.object({
  id: z.string(),
  content: z.string().optional(),
  mediaIds: z.array(z.string()).default([]),
});

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
  id?: string; // 수정 모드일 때 사용
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  // 수정 모드인 경우
  if (input.id) {
    return updatePost({
      id: input.id,
      content: input.content,
      mediaIds: input.mediaIds
    });
  }

  // 생성 모드
  const { content, mediaIds } = PostSchema.parse(input);

  const newPost = await prisma.post.create({
    data: {
      content: content || "",
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}

export async function updatePost(input: {
  id: string;
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { id, content, mediaIds } = UpdatePostSchema.parse(input);

  // 게시물 소유권 확인
  const post = await prisma.post.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!post) throw new Error("게시물을 찾을 수 없습니다.");
  if (post.userId !== user.id) throw new Error("권한이 없습니다.");

  // 기존 첨부파일 연결 해제
  await prisma.post.update({
    where: { id },
    data: {
      attachments: {
        set: [],
      },
    },
  });

  // 게시물 업데이트
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      content: content || "",
      attachments: {
        connect: mediaIds.map((mediaId) => ({ id: mediaId })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return updatedPost;
}
