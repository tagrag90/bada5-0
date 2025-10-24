import { validateRequest } from "@/auth";
import SessionProvider from "@/app/(main)/SessionProvider";
import ReactQueryProvider from "@/app/ReactQueryProvider";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import LeftSidebar from "@/components/LeftSidebar";
import TrendsSidebar from "@/components/TrendsSidebar";

export default async function UILabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  const isLoggedIn = !!session.user;

  return (
    <SessionProvider value={session}>
      <SidebarProvider>
        <ReactQueryProvider>
          {isLoggedIn && (
            <LeftSidebar>
              <TrendsSidebar className="!static !w-full" />
            </LeftSidebar>
          )}
          {children}
        </ReactQueryProvider>
      </SidebarProvider>
    </SessionProvider>
  );
}

