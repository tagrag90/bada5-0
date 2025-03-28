"use client";

import { useSession, useOptionalUser } from "@/app/(main)/SessionProvider";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import CommentMoreButton from "./CommentMoreButton";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const user = useOptionalUser();
  const isLoggedIn = !!user;

  return (
    <div className="group/comment ml-5 mr-5 flex items-start gap-3 pt-3">
      <UserAvatar avatarUrl={comment.user.avatarUrl} size={24} />
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{comment.user.username}</span>
          <span className="text-sm text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div className="mb-3 whitespace-pre-line break-words text-sm">
          {comment.content}
        </div>
      </div>
      {isLoggedIn && comment.user.id === user?.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
