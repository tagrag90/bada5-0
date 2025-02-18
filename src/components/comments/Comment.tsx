import { useSession } from "@/app/(main)/SessionProvider";
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
  const { user } = useSession();

  return (
    <div className="flex items-start gap-3 pt-3">
      <UserAvatar avatarUrl={comment.user.avatarUrl} size={24} />
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm">{comment.user.username}</span>
          <span className="text-sm text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div className="whitespace-pre-line break-words text-sm mb-3">{comment.content}</div>
      </div>
      {comment.user.id === user.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
