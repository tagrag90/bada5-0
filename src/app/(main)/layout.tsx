import { validateRequest } from "@/auth";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";
import RefreshIndicator from "@/components/RefreshIndicator";

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
      <RefreshIndicator />
      <div className="flex min-h-screen flex-col md:h-auto">
        {/* <Navbar /> */}
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 px-0 py-0 md:p-5">
          {isLoggedIn && (
            <div className="sticky top-[5.25rem] hidden h-fit flex-none flex-col space-y-3 sm:block">
              <MenuBar className="rounded-2xl bg-card px-3 py-5 lg:px-5" />
              {/* 테마 스위처 비활성화 */}
            </div>
          )}
          <div className="w-full min-w-0 md:max-w-5xl mobile-page-container md:pt-0">{children}</div>
        </div>
        {isLoggedIn && (
          <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 mobile-navbar sm:hidden flex-shrink-0" />
        )}
      </div>
    </SessionProvider>
  );
}
