"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export async function submitComment({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content: contentValidated } = createCommentSchema.parse({ content });

  // 게시물 정보 조회 (알림 발송용)
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { userId: true },
  });

  if (!post) throw new Error("Post not found");

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: contentValidated,
        postId: postId,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(post.userId !== user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.userId,
              postId: postId,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ]);

  // 푸시 알림 발송 (자신의 게시물이 아닐 때만)
  if (post.userId !== user.id) {
    try {
      console.log('Sending comment push notification:', {
        postUserId: post.userId,
        currentUserId: user.id,
        displayName: user.displayName,
        postId: postId,
        commentId: newComment.id
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/push/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Dive to Bada',
          body: `${user.displayName}님이 회원님의 게시물에 댓글을 남겼습니다`,
          userIds: [post.userId],
          data: {
            type: 'comment',
            postId: postId,
            commentId: newComment.id,
            issuerId: user.id
          }
        }),
      });

      const result = await response.json();
      console.log('Push notification response:', result);
    } catch (error) {
      console.error('Failed to send push notification for comment:', error);
      // 푸시 알림 실패해도 댓글 기능은 정상 작동
    }
  }

  return newComment;
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
