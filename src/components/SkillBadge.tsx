"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// 스킬 로고 매핑 (Skill Icons API 사용)
const skillLogos: Record<string, string> = {
  // Adobe 제품군
  "Adobe Premiere Pro": "https://skillicons.dev/icons?i=pr",
  "Adobe After Effects": "https://skillicons.dev/icons?i=ae", 
  "Adobe Photoshop": "https://skillicons.dev/icons?i=ps",
  "Adobe Illustrator": "https://skillicons.dev/icons?i=ai",
  "Adobe Audition": "https://skillicons.dev/icons?i=au",
  
  // 디자인 툴
  "Figma": "https://skillicons.dev/icons?i=figma",
  "Sketch": "https://skillicons.dev/icons?i=sketch",
  "Canva": "https://skillicons.dev/icons?i=canva",
  
  // 3D & 게임 엔진
  "Blender": "https://skillicons.dev/icons?i=blender",
  "Unity": "https://skillicons.dev/icons?i=unity",
  "Unreal Engine": "https://skillicons.dev/icons?i=unreal",
  "Maya": "https://skillicons.dev/icons?i=maya",
  "Cinema 4D": "https://skillicons.dev/icons?i=c4d",
  
  // 개발 툴
  "VS Code": "https://skillicons.dev/icons?i=vscode",
  "GitHub": "https://skillicons.dev/icons?i=github",
  
  // 협업 툴
  "Notion": "https://skillicons.dev/icons?i=notion",
  "Slack": "https://skillicons.dev/icons?i=slack",
  "Discord": "https://skillicons.dev/icons?i=discord",
  
  // 음악 툴
  "Logic Pro": "https://skillicons.dev/icons?i=logic",
  "FL Studio": "https://skillicons.dev/icons?i=fl",
  "Ableton Live": "https://skillicons.dev/icons?i=ableton",
  "Pro Tools": "https://skillicons.dev/icons?i=protools",
  
  // 기타
  "Final Cut Pro": "https://skillicons.dev/icons?i=finalcut",
  "DaVinci Resolve": "https://skillicons.dev/icons?i=davinci",
};

// 전체 스킬 목록 (단순화)
export const allSkills = [
  // 영상 편집 & 모션그래픽
  "Adobe Premiere Pro",
  "Adobe After Effects", 
  "Final Cut Pro",
  "DaVinci Resolve",
  "CapCut",
  "VN",
  
  // 그래픽 디자인 & 편집
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Figma",
  "Sketch", 
  "Canva",
  
  // 3D & 모델링/렌더링
  "Blender",
  "Cinema 4D",
  "Maya",
  "3ds Max", 
  "ZBrush",
  "Unity",
  "Unreal Engine",
  
  // 음악/사운드 제작
  "Adobe Audition",
  "FL Studio",
  "Logic Pro",
  "Ableton Live",
  "Pro Tools",
  
  // 개발 & 협업 툴
  "VS Code",
  "GitHub",
  "Notion",
  "Slack",
  "Discord"
];

interface SkillBadgeProps {
  skillName: string;
  size?: "sm" | "md" | "lg";
}

export default function SkillBadge({ 
  skillName, 
  size = "sm" 
}: SkillBadgeProps) {
  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2", 
    lg: "text-lg px-5 py-2.5"
  };

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20
  };

  const hasLogo = skillLogos[skillName];

  return (
    <Badge 
      variant="secondary" 
      className={`bg-gray-100 text-gray-700 border-2 border-transparent ${sizeClasses[size]} font-semibold rounded-md flex items-center gap-1.5 hover:bg-gray-200 hover:border-black hover:shadow-lg hover:shadow-black/10 transition-all duration-200 cursor-pointer`}
    >
      {hasLogo && (
        <Image
          src={skillLogos[skillName]}
          alt={`${skillName} logo`}
          width={iconSize[size]}
          height={iconSize[size]}
          className="flex-shrink-0"
        />
      )}
      <span>{skillName}</span>
    </Badge>
  );
}

// 스킬 목록 표시 컴포넌트
interface SkillListProps {
  skills: string[];
}

export function SkillList({ skills }: SkillListProps) {
  if (skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <SkillBadge key={skill} skillName={skill} size="sm" />
      ))}
    </div>
  );
}
