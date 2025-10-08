"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Color {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  usage: string;
  textColor: string;
}

export default function ColorsPage() {
  const [copiedColor, setCopiedColor] = useState<string>("");

  const copyToClipboard = (text: string, colorName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorName);
    setTimeout(() => setCopiedColor(""), 2000);
  };

  const colors: Color[] = [
    {
      name: "Background",
      hex: "#F0F2F5",
      rgb: "240, 242, 245",
      hsl: "210, 17%, 95%",
      usage: "전체 배경색",
      textColor: "text-gray-900",
    },
    {
      name: "Primary",
      hex: "#1a1a1a",
      rgb: "26, 26, 26",
      hsl: "240, 5.9%, 10%",
      usage: "주요 액션 버튼, 강조",
      textColor: "text-white",
    },
    {
      name: "Card",
      hex: "#FFFFFF",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      usage: "카드 배경",
      textColor: "text-gray-900",
    },
    {
      name: "Border",
      hex: "#E5E7EB",
      rgb: "229, 231, 235",
      hsl: "240, 5.9%, 90%",
      usage: "테두리",
      textColor: "text-gray-900",
    },
    {
      name: "Muted",
      hex: "#F3F4F6",
      rgb: "243, 244, 246",
      hsl: "240, 4.8%, 95.9%",
      usage: "비활성화 요소",
      textColor: "text-gray-900",
    },
    {
      name: "Destructive",
      hex: "#EF4444",
      rgb: "239, 68, 68",
      hsl: "0, 84.2%, 60.2%",
      usage: "삭제, 경고",
      textColor: "text-white",
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1>색상</h1>
        <p className="text-lg text-muted-foreground mt-2">
          브랜드 색상 팔레트
        </p>
      </div>

      <div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {colors.map((color) => (
            <div key={color.name} className="border rounded-lg overflow-hidden">
              {/* 색상 미리보기 */}
              <div
                className={`h-32 flex items-center justify-center ${color.textColor}`}
                style={{ backgroundColor: color.hex }}
              >
                <span className="text-2xl font-bold">{color.name}</span>
              </div>

              {/* 색상 정보 */}
              <div className="p-4 bg-white space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">사용처</p>
                  <p className="text-sm font-medium">{color.usage}</p>
                </div>

                {/* HEX */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">HEX</p>
                    <p className="text-sm font-mono">{color.hex}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(color.hex, `${color.name}-hex`)}
                  >
                    {copiedColor === `${color.name}-hex` ? "✓" : "📋"}
                  </Button>
                </div>

                {/* RGB */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">RGB</p>
                    <p className="text-sm font-mono">{color.rgb}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`rgb(${color.rgb})`, `${color.name}-rgb`)}
                  >
                    {copiedColor === `${color.name}-rgb` ? "✓" : "📋"}
                  </Button>
                </div>

                {/* HSL */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">HSL</p>
                    <p className="text-sm font-mono">{color.hsl}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`hsl(${color.hsl})`, `${color.name}-hsl`)}
                  >
                    {copiedColor === `${color.name}-hsl` ? "✓" : "📋"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>CSS Variables</h2>
        <p className="text-muted-foreground mb-4">
          프로젝트에서는 CSS Variables를 사용하여 색상을 관리합니다.
        </p>
        <pre className="p-4 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto">
          <code>{`:root {
  --background: #F0F2F5;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --destructive: 0 84.2% 60.2%;
}`}</code>
        </pre>
      </div>

      <div>
        <h2>Tailwind에서 사용하기</h2>
        <p className="text-muted-foreground mb-4">
          Tailwind CSS 클래스로 쉽게 사용할 수 있습니다.
        </p>
        <pre className="p-4 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto">
          <code>{`<div className="bg-background text-foreground">
  <div className="bg-card border-border">
    <button className="bg-primary text-primary-foreground">
      Click me
    </button>
  </div>
</div>`}</code>
        </pre>
      </div>

    </div>
  );
}

