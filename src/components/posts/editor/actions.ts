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
  title?: string;
  content: string;
  mediaIds: string[];
  id?: string;
  studioId?: string;
}) {
  console.log("🔍 배포 디버깅 - Server Action submitPost 호출됨");
  console.log("📦 배포 디버깅 - 입력값:", JSON.stringify(input, null, 2));

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  // 수정 모드인 경우
  if (input.id) {
    return updatePost({
      id: input.id,
      title: input.title,
      content: input.content,
      mediaIds: input.mediaIds
    });
  }

  // 생성 모드
  const { content, mediaIds } = PostSchema.parse(input);

  // 링크 미리보기 기능 제거로 인한 간단 처리
  const finalContent = content || "";

  const newPost = await prisma.post.create({
    data: {
      title: input.title || null,
      content: finalContent,
      userId: user.id,
      ...(input.studioId && { studioId: input.studioId }),
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      userId: true,
      studioId: true,
    },
  });

  // 간단한 객체로 반환하여 serialize 문제 해결
  return {
    id: newPost.id,
    title: newPost.title,
    content: newPost.content,
    createdAt: newPost.createdAt,
    userId: newPost.userId,
    studioId: newPost.studioId,
  };
}

export async function updatePost(input: {
  id: string;
  title?: string;
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

  // 링크 미리보기 기능 제거로 인한 간단 처리
  const finalContent = content || "";

  // 게시물 업데이트
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      title: input.title || null,
      content: finalContent,
      attachments: {
        connect: mediaIds.map((mediaId) => ({ id: mediaId })),
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      userId: true,
      studioId: true,
    },
  });

  // 간단한 객체로 반환하여 serialize 문제 해결
  return {
    id: updatedPost.id,
    title: updatedPost.title,
    content: updatedPost.content,
    createdAt: updatedPost.createdAt,
    userId: updatedPost.userId,
    studioId: updatedPost.studioId,
  };
}
