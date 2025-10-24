"use client";

import ServerList from "@/components/layout/ServerList";

export default function UILabSidebar({ 
  session, 
  children 
}: { 
  session: any; 
  children: React.ReactNode;
}) {
  const isLoggedIn = !!session?.user;

  return (
    <>
      {isLoggedIn && (
        <aside 
          className="fixed left-0 top-0 h-screen bg-card border-r border-border overflow-y-auto hidden xl:flex xl:flex-col z-30" 
          style={{ width: '80px' }}
        >
          <ServerList
            selectedStudioId={undefined}
            onStudioSelect={() => {}}
            onCreateStudio={() => {}}
          />
        </aside>
      )}
      {children}
    </>
  );
}

