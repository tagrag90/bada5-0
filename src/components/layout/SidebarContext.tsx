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

interface NodeEditData {
  nodeId: string;
  initialTitle: string;
  initialContent?: string;
  initialEmoji?: string;
  nodeType?: string;
  onSave?: (nodeId: string, title: string, content?: string, emoji?: string) => Promise<void>;
  onDelete?: (nodeId: string) => Promise<void>;
  onClose?: () => void;
}

interface DiscordSidebarData {
  selectedStudioId?: string | null;
  selectedChannel?: string;
  onStudioSelect?: (studioId: string | null) => void;
  onChannelSelect?: (channel: string) => void;
  isOwner?: boolean;
  studioName?: string;
  studio?: Studio;
  fileId?: string; // 화이트보드 파일 ID
  nodeEditData?: NodeEditData | null; // 노드 편집 데이터
}

interface SidebarContextType {
  sidebarType: SidebarType;
  sidebarData: SidebarData | null;
  discordData: DiscordSidebarData | null;
  sidebarsCollapsed: boolean;
  setSidebar: (type: SidebarType, data?: SidebarData) => void;
  setDiscordSidebar: (data: DiscordSidebarData) => void;
  setNodeEditData: (data: NodeEditData | null) => void;
  toggleSidebars: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarType, setSidebarType] = useState<SidebarType>('none');
  const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
  const [discordData, setDiscordData] = useState<DiscordSidebarData | null>(null);
  const [sidebarsCollapsed, setSidebarsCollapsed] = useState(false);

  const setSidebar = useCallback((type: SidebarType, data?: SidebarData) => {
    setSidebarType(type);
    setSidebarData(data || null);
  }, []);

  const setDiscordSidebar = useCallback((data: DiscordSidebarData) => {
    setSidebarType('discord');
    setDiscordData(data);
  }, []);

  const setNodeEditData = useCallback((data: NodeEditData | null) => {
    setDiscordData(prev => prev ? { ...prev, nodeEditData: data } : null);
  }, []);

  const toggleSidebars = useCallback(() => {
    setSidebarsCollapsed(prev => !prev);
  }, []);

  return (
    <SidebarContext.Provider value={{
      sidebarType,
      sidebarData,
      discordData,
      sidebarsCollapsed,
      setSidebar,
      setDiscordSidebar,
      setNodeEditData,
      toggleSidebars
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

