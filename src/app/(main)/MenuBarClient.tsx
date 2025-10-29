"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bookmark, Compass, Home, SquarePlus, PenLine, Search } from "lucide-react";
import NotificationsButton from "./NotificationsButton";
import PostEditorModal from "@/components/posts/editor/PostEditorModal";
import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import studioIcon from "@/assets/studio.png";
import UserButton from "@/components/UserButton";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import homeIcon from "@/assets/feed.png";
import writeIcon from "@/assets/write.png";
import MessagesButton from "./MessagesButton";

interface MenuBarClientProps {
  className?: string;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
}

export function MenuBarClient({
  className,
  unreadNotificationsCount,
  unreadMessagesCount,
}: MenuBarClientProps) {
  const { user } = useSession();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const lastClickTimeRef = useRef(0);

  const handleHomeClick = (e: React.MouseEvent) => {
    const isHomePage = pathname === '/';
    
    if (isHomePage) {
      // 홈 페이지에서 홈 버튼 클릭 시 - 1회 클릭으로 새로고침
      e.preventDefault();
      
      // 새로고침 시작 이벤트 발생
      window.dispatchEvent(new CustomEvent('homeRefreshStart'));
      
      // 피드 새로고침
      queryClient.invalidateQueries({
        queryKey: ["post-feed"],
      });
      
      // 스크롤을 맨 위로
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // 새로고침 완료 이벤트는 약간 지연 후 발생
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('homeRefreshEnd'));
      }, 2000);
    }
  };

  return (
    <>
      <div className={className}>
        {/* 1. 홈 */}
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3"
          title="Home"
          asChild
        >
          <Link href="/" onClick={handleHomeClick}>
            <Image src={homeIcon} alt="Home" width={24} height={24} />
          </Link>
        </Button>

        {/* 2. 검색 */}
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3"
          title="Search"
          asChild
        >
          <Link href="/search">
            <Search className="h-6 w-6" />
          </Link>
        </Button>

        {/* 3. 글 작성 */}
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3"
          title="Write"
          onClick={() => setIsEditorOpen(true)}
        >
          <Image src={writeIcon} alt="Write" width={24} height={24} />
          {/* <PenLine className="w-7 h-7" /> */}
        </Button>

        {/* 4. 노티피케이션 */}
        <NotificationsButton
          initialState={{ unreadCount: unreadNotificationsCount }}
        />
        {/* <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} /> */}


        {/* 6. 유저 */}
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3"
          title="Profile"
          asChild
        >
          <Link href={`/users/${user?.username}`}>
            <UserAvatar
              avatarUrl={user?.avatarUrl}
              userId={user?.id}
              size={24}
              className="border-2 border-stone-700 items-center justify-center"
            />
          </Link>
        </Button>

        {/* <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
        </Link>
      </Button> */}
        {/* <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Explore"
        asChild
      >
        <Link href="/explore">
          <Compass />
        </Link>
      </Button> */}

        {/* <Button
          variant="ghost"
          className="flex items-center justify-start gap-3"
          title="Studio"
          asChild
        >
          <Link href="/explore">
            <Image src={studioIcon} alt="Studio" width={29} height={29} />
          </Link>
        </Button> */}
      </div>

      <PostEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />

    </>
  );
}
