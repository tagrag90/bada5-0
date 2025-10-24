import { validateRequest } from "@/auth";
import SessionProvider from "@/app/(main)/SessionProvider";
import ReactQueryProvider from "@/app/ReactQueryProvider";
import UILabSidebar from "./UILabSidebar";

export default async function UILabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  return (
    <SessionProvider value={session}>
      <ReactQueryProvider>
        <UILabSidebar session={session}>
          {children}
        </UILabSidebar>
      </ReactQueryProvider>
    </SessionProvider>
  );
}

