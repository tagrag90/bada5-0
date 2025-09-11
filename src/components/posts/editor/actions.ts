"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema, updatePostSchema } from "@/lib/validation";
import { z } from "zod";

const PostSchema = z.object({
  content: z.string().optional(),
  mediaIds: z.array(z.string()).default([]),
  linkPreviews: z.array(z.any()).optional(),
});

const UpdatePostSchema = z.object({
  id: z.string(),
  content: z.string().optional(),
  mediaIds: z.array(z.string()).default([]),
  linkPreviews: z.array(z.any()).optional(),
});

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
  linkPreviews?: any[]; // 링크 미리보기 데이터
  id?: string; // 수정 모드일 때 사용
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  // 수정 모드인 경우
  if (input.id) {
    return updatePost({
      id: input.id,
      content: input.content,
      mediaIds: input.mediaIds,
      linkPreviews: input.linkPreviews
    });
  }

  // 생성 모드
  const { content, mediaIds, linkPreviews } = PostSchema.parse(input);

  // linkPreviews가 있으면 content에서 해당 URL 하이퍼링크 주석처리 + 메타데이터 포함
  let finalContent = content || "";
  
  if (linkPreviews && linkPreviews.length > 0) {
    // 각 링크 미리보기에 대해 해당 URL의 하이퍼링크를 주석처리
    for (const preview of linkPreviews) {
      const urlToHide = preview.url;
      
      // <a> 태그로 된 하이퍼링크를 주석으로 변환
      const linkRegex = new RegExp(
        `<a[^>]*href=["']${urlToHide.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>.*?</a>`,
        'gi'
      );
      
      finalContent = finalContent.replace(linkRegex, `<!-- HIDDEN_LINK: ${urlToHide} -->`);
      
      // 일반 텍스트 URL도 주석처리
      const textUrlRegex = new RegExp(
        urlToHide.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'gi'
      );
      
      finalContent = finalContent.replace(textUrlRegex, `<!-- HIDDEN_URL: ${urlToHide} -->`);
    }
    
    // 링크 미리보기 메타데이터 추가
    finalContent += `<!-- LINK_PREVIEWS: ${JSON.stringify(linkPreviews)} -->`;
  }

  const newPost = await prisma.post.create({
    data: {
      content: finalContent,
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
  linkPreviews?: any[]; // 링크 미리보기 데이터
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { id, content, mediaIds, linkPreviews } = UpdatePostSchema.parse(input);

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

  // linkPreviews가 있으면 content에서 해당 URL 하이퍼링크 주석처리 + 메타데이터 포함
  let finalContent = content || "";
  
  if (linkPreviews && linkPreviews.length > 0) {
    // 각 링크 미리보기에 대해 해당 URL의 하이퍼링크를 주석처리
    for (const preview of linkPreviews) {
      const urlToHide = preview.url;
      
      // <a> 태그로 된 하이퍼링크를 주석으로 변환
      const linkRegex = new RegExp(
        `<a[^>]*href=["']${urlToHide.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>.*?</a>`,
        'gi'
      );
      
      finalContent = finalContent.replace(linkRegex, `<!-- HIDDEN_LINK: ${urlToHide} -->`);
      
      // 일반 텍스트 URL도 주석처리
      const textUrlRegex = new RegExp(
        urlToHide.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'gi'
      );
      
      finalContent = finalContent.replace(textUrlRegex, `<!-- HIDDEN_URL: ${urlToHide} -->`);
    }
    
    // 링크 미리보기 메타데이터 추가
    finalContent += `<!-- LINK_PREVIEWS: ${JSON.stringify(linkPreviews)} -->`;
  }

  // 게시물 업데이트
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      content: finalContent,
      attachments: {
        connect: mediaIds.map((mediaId) => ({ id: mediaId })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return updatedPost;
}
