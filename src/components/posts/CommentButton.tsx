import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

interface CommentButtonProps {
  commentCount: number;
  postId: string;
  variant?: "default" | "overlay";
}

export default function CommentButton({
  commentCount,
  postId,
  variant = "default"
}: CommentButtonProps) {
  const isOverlay = variant === "overlay";

  return (
    <Link
      href={`/posts/${postId}`}
      className={cn(
        "flex items-center gap-2 rounded-[10px] px-4 py-2",
        isOverlay ? "bg-black/10 hover:bg-black/30 backdrop-blur-sm text-white" : ""
      )}
    >
      <MessageCircle
        strokeWidth={1.5}
        className={cn(
          "size-5",
          isOverlay ? "text-white" : "text-black"
        )}
      />
      {!isOverlay && (
      <span
        className={cn(
          "text-sm font-normal tabular-nums",
          isOverlay ? "text-white" : "text-black"
        )}
      >
        {commentCount}
      </span>
      )}
    </Link>
  );
} 