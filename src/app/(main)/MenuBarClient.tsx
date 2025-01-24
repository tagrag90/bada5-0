"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bookmark, Compass, Home, SquarePlus } from "lucide-react";
import NotificationsButton from "./NotificationsButton";
import PostEditorModal from "@/components/posts/editor/PostEditorModal";
import { useState } from "react";

interface MenuBarClientProps {
  className?: string;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
}

export function MenuBarClient({ 
  className,
  unreadNotificationsCount,
  unreadMessagesCount
}: MenuBarClientProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      {/* <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} /> */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Explore"
        asChild
      >
        <Link href="/explore">
          <Compass />
        </Link>
      </Button>
      {/* Write button */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Write"
        onClick={() => setIsEditorOpen(true)}
      >
        <SquarePlus />
      </Button>
      <PostEditorModal 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
      />
    </div>
  );
}
