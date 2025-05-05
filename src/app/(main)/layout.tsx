import { validateRequest } from "@/auth";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();
  const isLoggedIn = !!session.user;

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        {/* <Navbar /> */}
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 px-0 py-5 md:p-5">
          {isLoggedIn && (
            <MenuBar className="xl:w-75 sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl px-3 py-5 sm:block lg:px-5 bg-card border" />
          )}
          <div className="w-full max-w-5xl">{children}</div>
        </div>
        {isLoggedIn && (
          <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
        )}
      </div>
    </SessionProvider>
  );
}
