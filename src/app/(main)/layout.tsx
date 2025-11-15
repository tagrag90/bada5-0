import { validateRequest } from "@/auth";
import SessionProvider from "./SessionProvider";
import RefreshIndicator from "@/components/RefreshIndicator";
import LeftSidebar from "@/components/LeftSidebar";
import TrendsSidebar from "@/components/TrendsSidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import WhoToFollowSlot from "@/components/WhoToFollowSlot";
import LeftSidebarArea from "@/components/layout/LeftSidebarArea";
import RightSidebarArea from "@/components/layout/RightSidebarArea";
import FeedRightSidebar from "@/components/FeedRightSidebar";

// import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  const isLoggedIn = !!session.user;

  return (
    <SessionProvider value={session}>
      <SidebarProvider>
        <RefreshIndicator />
        
        <div className="flex min-h-screen flex-col md:h-auto overflow-x-hidden">
          {/* 좌측 사이드바 영역 */}
          {isLoggedIn && (
            <LeftSidebarArea>
              {/* 페이지별로 적절한 블록이 여기에 렌더링됩니다 */}
              <LeftSidebar whoToFollowSlot={<WhoToFollowSlot />}>
                <TrendsSidebar className="!static !w-full" />
              </LeftSidebar>
            </LeftSidebarArea>
          )}

          {/* 우측 사이드바 영역 */}
          {isLoggedIn && (
            <RightSidebarArea>
              <div className="sticky top-5 p-5">
                <FeedRightSidebar />
              </div>
            </RightSidebarArea>
          )}
        
        <div 
          className={`flex grow justify-center ${isLoggedIn ? 'px-0 py-0 md:p-5' : 'p-0'}`}
          style={{
            marginLeft: isLoggedIn ? 'var(--left-sidebar-width, 0px)' : '0px',
            marginRight: isLoggedIn ? 'var(--right-sidebar-width, 0px)' : '0px',
            maxWidth: isLoggedIn ? 'calc(100vw - var(--left-sidebar-width, 0px) - var(--right-sidebar-width, 0px))' : '100vw',
          }}
        >
          {/* 중앙 피드 영역 - 항상 중앙 정렬 */}
          <div className={`w-full min-w-0 ${isLoggedIn ? 'max-w-3xl' : 'max-w-full'} mobile-page-container md:pt-0 flex flex-col ${isLoggedIn ? 'items-center' : 'items-stretch'}`}>
            {children}
          </div>
        </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
