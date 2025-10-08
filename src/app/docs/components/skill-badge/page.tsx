import SkillBadge from "@/components/SkillBadge";
import ComponentPreview from "../../_components/ComponentPreview";

export default function SkillBadgePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>SkillBadge</h1>
        <p className="text-lg text-muted-foreground mt-2">
          스킬 뱃지 (툴/기술 표시)
        </p>
      </div>

      <div>
        <h2>기본</h2>
        <ComponentPreview
          component={<SkillBadge skillName="Adobe Premiere Pro" />}
          code={`<SkillBadge skillName="Adobe Premiere Pro" />`}
        />
      </div>

      <div>
        <h2>Sizes</h2>
        <ComponentPreview
          component={
            <div className="flex items-center gap-3">
              <SkillBadge skillName="Figma" size="sm" />
              <SkillBadge skillName="Figma" size="md" />
              <SkillBadge skillName="Figma" size="lg" />
            </div>
          }
          code={`<SkillBadge skillName="Figma" size="sm" />
<SkillBadge skillName="Figma" size="md" />
<SkillBadge skillName="Figma" size="lg" />`}
        />
      </div>

      <div>
        <h2>다양한 스킬</h2>
        <ComponentPreview
          component={
            <div className="flex flex-wrap gap-2">
              <SkillBadge skillName="Adobe Photoshop" />
              <SkillBadge skillName="Blender" />
              <SkillBadge skillName="Unity" />
              <SkillBadge skillName="FL Studio" />
              <SkillBadge skillName="Notion" />
            </div>
          }
          code={`<SkillBadge skillName="Adobe Photoshop" />
<SkillBadge skillName="Blender" />
<SkillBadge skillName="Unity" />
<SkillBadge skillName="FL Studio" />
<SkillBadge skillName="Notion" />`}
        />
      </div>

      <div>
        <h2>지원 스킬 목록</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-4">
          스킬 아이콘이 있는 항목들입니다.
        </p>
        <div className="text-sm space-y-1">
          <p><strong>영상:</strong> Premiere Pro, After Effects, Final Cut Pro</p>
          <p><strong>디자인:</strong> Photoshop, Illustrator, Figma</p>
          <p><strong>3D:</strong> Blender, Unity, Unreal Engine</p>
          <p><strong>음악:</strong> FL Studio, Logic Pro, Ableton Live</p>
          <p><strong>기타:</strong> VS Code, GitHub, Notion</p>
        </div>
      </div>
    </div>
  );
}

