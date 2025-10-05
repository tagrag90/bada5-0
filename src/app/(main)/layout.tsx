import { validateRequest } from "@/auth";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";
import RefreshIndicator from "@/components/RefreshIndicator";
import LeftSidebar from "@/components/LeftSidebar";
import TrendsSidebar from "@/components/TrendsSidebar";
import FeedRightSidebar from "@/components/FeedRightSidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";

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
        <div className="flex min-h-screen flex-col md:h-auto">
          {/* 좌측 사이드바 - 브랜드 정보 */}
          {isLoggedIn && (
            <LeftSidebar>
              <TrendsSidebar className="!static !w-full" />
            </LeftSidebar>
          )}
        
        {/* <Navbar /> */}
        <div 
          className="mx-auto flex w-full grow justify-center gap-6 px-0 py-0 md:p-5 xl:pl-[var(--sidebar-width,256px)]"
        >
          {/* 중앙 피드 영역 */}
          <div className="w-full min-w-0 max-w-3xl mobile-page-container md:pt-0">{children}</div>
          
          {/* 우측 사이드바 - Notice, 친구 찾기, 스튜디오 */}
          {isLoggedIn && (
            <div className="sticky top-5 hidden h-fit w-80 flex-none xl:block">
              <FeedRightSidebar />
            </div>
          )}
        </div>
        
        {/* 모바일 하단 네비바 */}
        {isLoggedIn && (
          <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 mobile-navbar sm:hidden flex-shrink-0" />
        )}
        
        {/* 데스크톱 하단 중앙 Floating 네비바 */}
        {isLoggedIn && (
          <div className="hidden sm:block">
            <MenuBar className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex gap-3 bg-white rounded-full shadow-xl px-6 py-3 border border-gray-200" />
          </div>
        )}
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
