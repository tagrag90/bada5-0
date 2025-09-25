"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// 스킬 로고 매핑 (Adobe Apps Logo 및 기타 로고들)
const skillLogos: Record<string, string> = {
  // Adobe 제품군 (Adobe Apps Logo Community)
  "Adobe Premiere Pro": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-original.svg",
  "Adobe After Effects": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg",
  "Adobe Photoshop": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg",
  "Adobe Illustrator": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-original.svg",
  "Adobe Audition": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/audition/audition-original.svg",
  
  // 디자인 툴
  "Figma": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  "Sketch": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg",
  "Canva": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
  
  // 3D & 게임 엔진
  "Blender": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg",
  "Unity": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
  "Unreal Engine": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg",
  
  // 개발 툴
  "VS Code": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  "GitHub": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  
  // 협업 툴
  "Notion": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg",
  "Slack": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg",
  "Discord": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/discord/discord-original.svg",
  
  // 기타 (Simple Icons 또는 대체 아이콘)
  "Final Cut Pro": "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/finalcutpro.svg",
  "DaVinci Resolve": "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/davinciresolve.svg",
  "Logic Pro": "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/logicpro.svg",
  "FL Studio": "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/flstudio.svg",
  "Ableton Live": "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/abletonlive.svg",
  "Pro Tools": "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/protools.svg",
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
