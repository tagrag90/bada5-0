"use client";

import { useState } from "react";
import { 
  Upload, 
  Search, 
  Grid3x3, 
  List, 
  Folder, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Download, 
  Share2, 
  Trash2, 
  MoreVertical,
  Plus,
  ArrowLeft,
  Star,
  Clock,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 목업 데이터
const mockFiles = [
  {
    id: 1,
    name: "2024 컨셉 사진",
    type: "folder",
    size: null,
    createdAt: "2024-01-10T10:30:00",
    updatedAt: "2024-01-15T14:20:00",
    owner: "김민지",
    isStarred: true,
    parentId: null,
    children: [
      {
        id: 11,
        name: "concept_01.jpg",
        type: "image",
        size: "2.4 MB",
        createdAt: "2024-01-10T10:35:00",
        updatedAt: "2024-01-10T10:35:00",
        owner: "김민지",
        isStarred: false,
        parentId: 1,
        thumbnail: "/api/placeholder/150/150"
      },
      {
        id: 12,
        name: "concept_02.jpg",
        type: "image",
        size: "3.1 MB",
        createdAt: "2024-01-10T10:36:00",
        updatedAt: "2024-01-10T10:36:00",
        owner: "김민지",
        isStarred: false,
        parentId: 1,
        thumbnail: "/api/placeholder/150/150"
      }
    ]
  },
  {
    id: 2,
    name: "뮤직비디오 기획서.docx",
    type: "document",
    size: "856 KB",
    createdAt: "2024-01-08T16:20:00",
    updatedAt: "2024-01-12T09:45:00",
    owner: "하니",
    isStarred: true,
    parentId: null
  },
  {
    id: 3,
    name: "신곡 데모",
    type: "folder",
    size: null,
    createdAt: "2024-01-05T11:15:00",
    updatedAt: "2024-01-14T16:30:00",
    owner: "다니엘",
    isStarred: false,
    parentId: null,
    children: [
      {
        id: 31,
        name: "demo_v1.mp3",
        type: "audio",
        size: "4.2 MB",
        createdAt: "2024-01-05T11:20:00",
        updatedAt: "2024-01-05T11:20:00",
        owner: "다니엘",
        isStarred: false,
        parentId: 3
      },
      {
        id: 32,
        name: "demo_v2.mp3",
        type: "audio",
        size: "4.5 MB",
        createdAt: "2024-01-08T14:10:00",
        updatedAt: "2024-01-08T14:10:00",
        owner: "다니엘",
        isStarred: true,
        parentId: 3
      }
    ]
  },
  {
    id: 4,
    name: "팬미팅 프레젠테이션.pptx",
    type: "presentation",
    size: "12.3 MB",
    createdAt: "2024-01-03T13:45:00",
    updatedAt: "2024-01-11T10:20:00",
    owner: "혜린",
    isStarred: false,
    parentId: null
  },
  {
    id: 5,
    name: "메이킹 필름.mp4",
    type: "video",
    size: "245 MB",
    createdAt: "2024-01-12T18:30:00",
    updatedAt: "2024-01-12T18:30:00",
    owner: "김민지",
    isStarred: false,
    parentId: null,
    thumbnail: "/api/placeholder/150/100"
  }
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "folder":
      return <Folder className="h-6 w-6 text-blue-500" />;
    case "image":
      return <Image className="h-6 w-6 text-green-500" />;
    case "video":
      return <Video className="h-6 w-6 text-red-500" />;
    case "audio":
      return <Music className="h-6 w-6 text-purple-500" />;
    case "document":
    case "presentation":
      return <FileText className="h-6 w-6 text-orange-500" />;
    default:
      return <FileText className="h-6 w-6 text-gray-500" />;
  }
};

const formatFileSize = (size: string | null) => {
  if (!size) return "";
  return size;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function TeamDrive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);

  // 현재 폴더의 파일들 가져오기
  const getCurrentFiles = () => {
    if (currentFolder === null) {
      return mockFiles.filter(file => file.parentId === null);
    } else {
      const folder = mockFiles.find(f => f.id === currentFolder);
      return folder?.children || [];
    }
  };

  const filteredFiles = getCurrentFiles().filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileClick = (file: any) => {
    if (file.type === "folder") {
      setCurrentFolder(file.id);
    }
    // 다른 파일 타입의 경우 미리보기나 다운로드 로직
  };

  const getCurrentFolderName = () => {
    if (currentFolder === null) return "팀 드라이브";
    const folder = mockFiles.find(f => f.id === currentFolder);
    return folder?.name || "알 수 없는 폴더";
  };

  const recentFiles = mockFiles
    .flatMap(file => file.children ? [file, ...file.children] : [file])
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const starredFiles = mockFiles
    .flatMap(file => file.children ? [file, ...file.children] : [file])
    .filter(file => file.isStarred);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentFolder && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFolder(null)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>뒤로</span>
            </Button>
          )}
          <h2 className="text-2xl font-bold">{getCurrentFolderName()}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>폴더</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-white p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>새 폴더 만들기</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-2 bg-white px-1">
                <div className="grid gap-2">
                  <Label htmlFor="folder-name">폴더명</Label>
                  <Input id="folder-name" placeholder="폴더명을 입력하세요" />
                </div>
                <div className="flex justify-between gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsNewFolderOpen(false)} className="flex-1">
                    취소
                  </Button>
                  <Button onClick={() => setIsNewFolderOpen(false)} className="flex-1">
                    만들기
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>업로드</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-white p-6">
              <DialogHeader className="pb-4">
                <DialogTitle>파일 업로드</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-2 bg-white px-1">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">파일을 드래그하여 업로드하거나</p>
                  <Button variant="outline">파일 선택</Button>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  지원 형식: 이미지, 비디오, 오디오, 문서 파일
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">전체 파일</TabsTrigger>
            <TabsTrigger value="recent">최근 파일</TabsTrigger>
            <TabsTrigger value="starred">즐겨찾기</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="파일 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* 보기 모드 */}
            <div className="flex border rounded">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <Card 
                  key={file.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleFileClick(file)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {/* 파일 아이콘/썸네일 */}
                      <div className="aspect-square flex items-center justify-center bg-gray-50 rounded">
                        {file.thumbnail ? (
                          <img 
                            src={file.thumbnail} 
                            alt={file.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          getFileIcon(file.type)
                        )}
                      </div>

                      {/* 파일 정보 */}
                      <div className="space-y-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium line-clamp-2">{file.name}</p>
                          {file.isStarred && <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        <p className="text-xs text-gray-400">{formatDate(file.updatedAt)}</p>
                      </div>

                      {/* 더보기 메뉴 */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            다운로드
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            공유
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            즐겨찾기
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <Card 
                  key={file.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleFileClick(file)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* 아이콘 */}
                      <div className="flex-shrink-0">
                        {file.thumbnail ? (
                          <img 
                            src={file.thumbnail} 
                            alt={file.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          getFileIcon(file.type)
                        )}
                      </div>

                      {/* 파일 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium truncate">{file.name}</p>
                          {file.isStarred && <Star className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{file.owner}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(file.updatedAt)}</span>
                          </div>
                          {file.size && <span>{formatFileSize(file.size)}</span>}
                        </div>
                      </div>

                      {/* 더보기 메뉴 */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            다운로드
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            공유
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            즐겨찾기
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentFiles.map((file) => (
              <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="aspect-square flex items-center justify-center bg-gray-50 rounded">
                      {file.thumbnail ? (
                        <img 
                          src={file.thumbnail} 
                          alt={file.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        getFileIcon(file.type)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-2">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(file.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="starred" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {starredFiles.map((file) => (
              <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="aspect-square flex items-center justify-center bg-gray-50 rounded">
                      {file.thumbnail ? (
                        <img 
                          src={file.thumbnail} 
                          alt={file.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        getFileIcon(file.type)
                      )}
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(file.updatedAt)}</p>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
