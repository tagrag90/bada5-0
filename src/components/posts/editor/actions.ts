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
  mediaIds?: string[];
  embeddedLinks?: LinkMetadata[]; // 임베드된 링크 데이터
  postId?: string; // 수정 모드일 때 사용
};

export async function submitPost(input: SubmitPostInput) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  // 수정 모드인 경우
  if (input.postId) {
    try {
      const updatedPost = await prisma.post.update({
        where: {
          id: input.postId,
          userId: user.id, // 본인 게시물만 수정 가능하도록 조건 추가
        },
        data: {
          content: input.content || "",
          attachments: {
            // 현재 첨부된 mediaId 목록으로 관계를 재설정 (set)
            set: (input.mediaIds || []).map((id) => ({ id })),
          },
        },
        include: getPostDataInclude(user.id), // 업데이트된 포스트 데이터 반환
      });
      return updatedPost;
    } catch (error) {
      console.error("Error updating post in DB:", error);
      // 게시물이 없거나 권한이 없는 경우 Prisma에서 에러 발생 가능
      // 여기서는 일반적인 에러 메시지로 처리
      throw new Error("Failed to update post in database.");
    }
  }

  // 생성 모드
  // mediaIds 추출 로직 제거, input에서 직접 사용
  const mediaIds = input.mediaIds || [];

  // 임베드된 링크 정보가 있으면 컨텐츠에 메타 태그 추가
  let enrichedContent = input.content || "";
  
  // 임베드된 링크 메타데이터를 JSON으로 저장 (표시용으로만 사용, 실제 저장 X)
  const linkMetaJson = input.embeddedLinks && input.embeddedLinks.length > 0 
    ? JSON.stringify(input.embeddedLinks) 
    : "";

  // <<< mediaIds 로그 제거 >>>
  // console.log("Attempting to connect media IDs:", mediaIds);

  try {
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
    
    // 성공 로그 추가 (선택 사항)
    // console.log("Successfully created post:", newPost.id);

  return newPost;
  } catch (error) {
    console.error("Error creating post in DB:", error);
    // 여기서 에러를 다시 throw하거나, 특정 에러 객체를 반환하여
    // 프론트엔드의 mutation.onError에서 처리하도록 할 수 있습니다.
    // 일단은 에러를 throw하여 mutateAsync가 실패하도록 합니다.
    throw new Error("Failed to create post in database.");
  }
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
