import { validateRequest } from "@/auth";
import SessionProvider from "@/app/(main)/SessionProvider";
import ReactQueryProvider from "@/app/ReactQueryProvider";

export default async function UILabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  return (
    <SessionProvider value={session}>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </SessionProvider>
  );
}

