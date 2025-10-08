import { validateRequest } from "@/auth";
import DocsSidebar from "./_components/DocsSidebar";
import TableOfContents from "./_components/TableOfContents";
import "./globals-docs.css";

export const metadata = {
  title: "Documentation | Dive to Bada",
  description: "Dive to Bada 개발자 문서, 컴포넌트 가이드 및 브랜드 자산",
};

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  return (
    <div className="docs-root">
      <div className="docs-container">
        <DocsSidebar user={session.user} />
        <main className="docs-content">{children}</main>
        <TableOfContents />
      </div>
    </div>
  );
}