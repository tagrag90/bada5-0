"use client";

import { createContext, useContext, ReactNode, useState, useCallback } from "react";

type SidebarType = 'none' | 'studio' | 'docs' | 'discord';

interface SidebarData {
  studioId?: string;
  studioName?: string;
  isOwner?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface Studio {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  _count: {
    members: number;
    events: number;
  };
  subscribersCount: number;
}

interface DiscordSidebarData {
  selectedStudioId?: string | null;
  selectedChannel?: string;
  onStudioSelect?: (studioId: string | null) => void;
  onChannelSelect?: (channel: string) => void;
  isOwner?: boolean;
  studioName?: string;
  studio?: Studio;
}

interface SidebarContextType {
  sidebarType: SidebarType;
  sidebarData: SidebarData | null;
  discordData: DiscordSidebarData | null;
  setSidebar: (type: SidebarType, data?: SidebarData) => void;
  setDiscordSidebar: (data: DiscordSidebarData) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarType, setSidebarType] = useState<SidebarType>('none');
  const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
  const [discordData, setDiscordData] = useState<DiscordSidebarData | null>(null);

  const setSidebar = useCallback((type: SidebarType, data?: SidebarData) => {
    setSidebarType(type);
    setSidebarData(data || null);
  }, []);

  const setDiscordSidebar = useCallback((data: DiscordSidebarData) => {
    setSidebarType('discord');
    setDiscordData(data);
  }, []);

  return (
    <SidebarContext.Provider value={{
      sidebarType,
      sidebarData,
      discordData,
      setSidebar,
      setDiscordSidebar
    }}>
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

