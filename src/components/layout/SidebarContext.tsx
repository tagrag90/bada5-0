"use client";

import { createContext, useContext, ReactNode, useState, useCallback } from "react";

type SidebarType = 'none' | 'studio' | 'docs';

interface SidebarData {
  studioId?: string;
  studioName?: string;
  isOwner?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface SidebarContextType {
  sidebarType: SidebarType;
  sidebarData: SidebarData | null;
  setSidebar: (type: SidebarType, data?: SidebarData) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarType, setSidebarType] = useState<SidebarType>('none');
  const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);

  const setSidebar = useCallback((type: SidebarType, data?: SidebarData) => {
    setSidebarType(type);
    setSidebarData(data || null);
  }, []);

  return (
    <SidebarContext.Provider value={{ sidebarType, sidebarData, setSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

