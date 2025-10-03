"use client";

import { useEffect } from "react";

export default function StudioWriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 좌측 사이드바와 하단 네비바 숨김
    document.body.classList.add("hide-sidebar");
    
    return () => {
      document.body.classList.remove("hide-sidebar");
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body.hide-sidebar .mobile-navbar {
            display: none !important;
          }
          body.hide-sidebar .sm\\:block.sticky {
            display: none !important;
          }
          /* 데스크톱 floating 네비바 숨김 */
          body.hide-sidebar .hidden.sm\\:block {
            display: none !important;
          }
          body.hide-sidebar .flex.min-h-screen .mx-auto.flex {
            gap: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
        `
      }} />
      <div className="w-full h-screen">
        {children}
      </div>
    </>
  );
}

