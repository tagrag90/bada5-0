"use client";

import { useState } from "react";

interface ComponentPreviewProps {
  component: React.ReactNode;
  code: string;
}

export default function ComponentPreview({
  component,
  code,
}: ComponentPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 space-y-4">
      <div className="border rounded-lg p-6 flex items-center justify-center min-h-[120px] bg-gray-50">
        {component}
      </div>

      <div className="relative">
        <pre className="p-4 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
        >
          {copied ? "✓" : "복사"}
        </button>
      </div>
    </div>
  );
}

