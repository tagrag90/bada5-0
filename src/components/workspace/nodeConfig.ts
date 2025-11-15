import { FileText, Calendar, Share2, FileImage, Image as ImageIcon } from "lucide-react";

// 노드 타입별 아이콘
export const nodeTypeIcons: Record<string, any> = {
  PLANNING: FileText,
  NOTE: FileText,
  SCHEDULE: Calendar,
  RESOURCE: Share2,
  POST: FileImage,
  PHOTO: ImageIcon,
};

// 노드 타입별 라벨
export const nodeTypeLabels: Record<string, string> = {
  PLANNING: "기획",
  NOTE: "메모",
  SCHEDULE: "캘린더",
  RESOURCE: "드라이브",
  POST: "게시물",
  PHOTO: "사진",
};

