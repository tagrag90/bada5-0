import StudioBadge from "@/components/StudioBadge";
import ComponentPreview from "../../_components/ComponentPreview";

export default function StudioBadgePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>StudioBadge</h1>
        <p className="text-lg text-muted-foreground mt-2">
          스튜디오 인증 뱃지
        </p>
      </div>

      <div>
        <h2>기본</h2>
        <ComponentPreview
          component={<StudioBadge />}
          code={`<StudioBadge />`}
        />
      </div>

      <div>
        <h2>Sizes</h2>
        <ComponentPreview
          component={
            <div className="flex items-center gap-4">
              <StudioBadge size="sm" />
              <StudioBadge size="md" />
              <StudioBadge size="lg" />
            </div>
          }
          code={`<StudioBadge size="sm" />
<StudioBadge size="md" />
<StudioBadge size="lg" />`}
        />
      </div>

      <div>
        <h2>Props</h2>
        <div className="border rounded-lg overflow-hidden mt-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Prop</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">size</td>
                <td className="px-4 py-3 font-mono text-xs">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td>
                <td className="px-4 py-3 font-mono text-xs">&quot;md&quot;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2>색상</h2>
        <p className="mt-2">배경: #00DD89 (민트)</p>
        <p className="mt-1">텍스트: #000000 (검정)</p>
      </div>
    </div>
  );
}

