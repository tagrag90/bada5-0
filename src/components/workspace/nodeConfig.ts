import { Lightbulb, FileText, Calendar, Package, Share2 } from "lucide-react";

// 노드 타입별 아이콘
export const nodeTypeIcons: Record<string, any> = {
  IDEA: Lightbulb,
  PLANNING: FileText,
  NOTE: FileText,
  SCHEDULE: Calendar,
  RESULT: Package,
  RESOURCE: Share2,
};

// 노드 타입별 라벨
export const nodeTypeLabels: Record<string, string> = {
  IDEA: "아이디어",
  PLANNING: "기획",
  NOTE: "메모",
  SCHEDULE: "일정관리",
  RESULT: "결과물",
  RESOURCE: "자료공유",
};

