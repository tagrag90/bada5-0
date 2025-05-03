"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema, updatePostSchema } from "@/lib/validation";
import { z } from "zod";
import { Attachment } from "./useMediaUpload";

const PostSchema = z.object({
  content: z.string().optional(),
  mediaIds: z.array(z.string()).default([]),
});

const UpdatePostSchema = z.object({
  id: z.string(),
  content: z.string().optional(),
  mediaIds: z.array(z.string()).default([]),
});

type LinkMetadata = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
};

type SubmitPostInput = {
  content: string;
  attachments?: Attachment[];
  embeddedLinks?: LinkMetadata[]; // 임베드된 링크 데이터
  postId?: string; // 수정 모드일 때 사용
};

export async function submitPost(input: SubmitPostInput) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  // 수정 모드인 경우
  if (input.postId) {
    return updatePost({
      id: input.postId,
      content: input.content,
      attachments: input.attachments || [],
      embeddedLinks: input.embeddedLinks || [],
    });
  }

  // 생성 모드
  // mediaIds 추출
  const mediaIds = (input.attachments || [])
    .map(att => att.mediaId)
    .filter(id => id !== undefined) as string[];

  // 임베드된 링크 정보가 있으면 컨텐츠에 메타 태그 추가
  let enrichedContent = input.content || "";
  
  // 임베드된 링크 메타데이터를 JSON으로 저장 (표시용으로만 사용, 실제 저장 X)
  const linkMetaJson = input.embeddedLinks && input.embeddedLinks.length > 0 
    ? JSON.stringify(input.embeddedLinks) 
    : "";

  const newPost = await prisma.post.create({
    data: {
      content: enrichedContent,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
      // 메타데이터를 별도 필드로 저장하지 않고, 필요한 경우 여기서 추가 필드를 정의할 수 있음
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}

type UpdatePostInput = {
  id: string;
  content: string;
  attachments: Attachment[];
  embeddedLinks?: LinkMetadata[]; // 임베드된 링크 데이터
};

export async function updatePost(input: UpdatePostInput) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { id, content, attachments, embeddedLinks } = input;

  // mediaIds 추출
  const mediaIds = attachments
    .map(att => att.mediaId)
    .filter(id => id !== undefined) as string[];

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
