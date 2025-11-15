"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import StudioWorkspace from "../../StudioWorkspace";
import WorkspaceFileHeader from "./WorkspaceFileHeader";

function WorkspaceFileContent() {
  const params = useParams();
  const studioId = params.studioId as string;
  const fileId = params.fileId as string;

  return (
    <div className="w-full h-full relative">
      {/* 파일 헤더 */}
      <WorkspaceFileHeader studioId={studioId} fileId={fileId} />
      
      {/* 화이트보드 */}
      <div className="w-full h-full">
        <StudioWorkspace studioId={studioId} fileId={fileId} />
      </div>
    </div>
  );
}

export default function WorkspaceFilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">로딩 중...</div>}>
      <WorkspaceFileContent />
    </Suspense>
  );
}

