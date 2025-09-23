"use client";

import { useState } from "react";
import { 
  Calendar, 
  StickyNote, 
  FolderOpen, 
  Users, 
  Settings, 
  Bell,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TeamCalendar from "./TeamCalendar";
import TeamNotes from "./TeamNotes";
import TeamDrive from "./TeamDrive";

// 목업 팀 데이터
const mockTeam = {
  id: 1,
  name: "NewJeans",
  handle: "@newjeans",
  description: "K-pop girl group under ADOR",
  avatarUrl: "/logo-bada.png",
  bannerUrl: "/banner-1.jpg",
  isVerified: true,
  memberCount: 5,
  members: [
    { id: 1, name: "김민지", role: "OWNER", avatarUrl: "/avatars/default-1.png" },
    { id: 2, name: "하니", role: "ADMIN", avatarUrl: "/avatars/default-2.png" },
    { id: 3, name: "다니엘", role: "EDITOR", avatarUrl: "/avatars/default-3.png" },
    { id: 4, name: "해린", role: "EDITOR", avatarUrl: "/avatars/default-4.png" },
    { id: 5, name: "혜인", role: "MEMBER", avatarUrl: "/avatars/default-5.png" }
  ]
};

const navigation = [
  { id: "calendar", name: "캘린더", icon: Calendar },
  { id: "notes", name: "메모", icon: StickyNote },
  { id: "drive", name: "드라이브", icon: FolderOpen },
];

const getRoleLabel = (role: string) => {
  const roles = {
    OWNER: "소유자",
    ADMIN: "관리자", 
    EDITOR: "에디터",
    MEMBER: "멤버"
  };
  return roles[role as keyof typeof roles] || role;
};

const getRoleColor = (role: string) => {
  const colors = {
    OWNER: "bg-red-100 text-red-800",
    ADMIN: "bg-blue-100 text-blue-800",
    EDITOR: "bg-green-100 text-green-800",
    MEMBER: "bg-gray-100 text-gray-800"
  };
  return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

interface TeamSpaceLayoutProps {
  children?: React.ReactNode;
}

export default function TeamSpaceLayout({ children }: TeamSpaceLayoutProps) {
  const [activeTab, setActiveTab] = useState("calendar");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "calendar":
        return <TeamCalendar />;
      case "notes":
        return <TeamNotes />;
      case "drive":
        return <TeamDrive />;
      default:
        return <TeamCalendar />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 팀 프로필 카드 */}
      <div className="p-6 bg-gray-50">
        <div
          className="w-full border bg-card shadow-sm overflow-hidden"
          style={{ borderRadius: '1.5rem' }}
        >
          {/* 배너 이미지 */}
          <div 
            className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative"
            style={{
              backgroundImage: `url(${mockTeam.bannerUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>

          {/* 팀 정보 */}
          <div className="relative p-8">
            <div className="flex items-start justify-between gap-6 -mt-20">
              <div className="flex items-end space-x-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={mockTeam.avatarUrl} alt={mockTeam.name} />
                  <AvatarFallback>{mockTeam.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="pt-12">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold">{mockTeam.name}</h1>
                    {mockTeam.isVerified && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        인증됨
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">{mockTeam.handle}</p>
                  <p className="text-foreground max-w-md">{mockTeam.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-12">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 팀 통계 */}
            <div className="flex items-center gap-8 text-sm mt-6 pt-6 border-t">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">42</span>
                <span className="text-muted-foreground">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">{mockTeam.memberCount}</span>
                <span className="text-muted-foreground">Members</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">1.2M</span>
                <span className="text-muted-foreground">Followers</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  팀 멤버 관리
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 탭 - 웹에서만 표시 */}
      <div className="hidden lg:block px-6">
        <div className="bg-card border border-border rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            {/* 네비게이션 버튼들 */}
            <nav className="flex items-center space-x-2">
              {navigation.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* 팀 멤버 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>팀 멤버</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                {mockTeam.members.map((member) => (
                  <DropdownMenuItem key={member.id} className="p-3">
                    <div className="flex items-center space-x-3 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getRoleColor(member.role)}`}
                        >
                          {getRoleLabel(member.role)}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* 모바일 사이드바 */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border border-border rounded-2xl shadow-sm transform transition-transform duration-300 ease-in-out lg:hidden
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">팀 스페이스</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4 space-y-6">
            {/* 네비게이션 */}
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* 팀 멤버 */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>팀 멤버</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="start">
                  {mockTeam.members.map((member) => (
                    <DropdownMenuItem key={member.id} className="p-3">
                      <div className="flex items-center space-x-3 w-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{member.name}</p>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getRoleColor(member.role)}`}
                          >
                            {getRoleLabel(member.role)}
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* 모바일 헤더 */}
        <div className="lg:hidden bg-card border border-border rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="font-semibold">
              {navigation.find(item => item.id === activeTab)?.name}
            </h2>
            <div></div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          {children || renderContent()}
        </div>
      </div>

      {/* 모바일 오버레이 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
