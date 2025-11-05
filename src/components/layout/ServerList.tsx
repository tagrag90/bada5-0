"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Logo from "@/assets/logo.png";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useToast } from "@/components/ui/use-toast";

interface Studio {
  id: string;
  name: string;
  avatarUrl?: string;
  type: 'PERSONAL' | 'TEAM';
  isVerified: boolean;
  order?: number | null;
  _count: {
    members: number;
    events: number;
  };
}

interface ServerListProps {
  selectedStudioId?: string;
  onStudioSelect: (studioId: string | null) => void;
  onCreateStudio: () => void;
}

interface SortableStudioItemProps {
  studio: Studio;
  selectedStudioId?: string;
  onStudioSelect: (studioId: string) => void;
}

function SortableStudioItem({ studio, selectedStudioId, onStudioSelect }: SortableStudioItemProps) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: studio.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button
        {...attributes}
        {...(isDragging ? {} : listeners)}
        onClick={(e) => {
          if (!isDragging) {
            onStudioSelect(studio.id);
            router.push(`/studios/${studio.id}`);
          }
        }}
        className={cn(
          "group relative flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 transition-all hover:bg-gray-200",
          selectedStudioId === studio.id && "bg-black hover:bg-black"
        )}
        title={studio.name}
      >
        {studio.avatarUrl ? (
          <Image
            key={studio.avatarUrl}
            src={studio.avatarUrl}
            alt={studio.name}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-300 text-xl font-bold text-black">
            {studio.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* 선택 표시 - 초록색 점 */}
        {selectedStudioId === studio.id && (
          <div className="absolute -left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-green-500 border-2 border-gray-50" />
        )}

        {/* 호버 툴팁 */}
        <div className="absolute left-24 top-1/2 z-50 hidden -translate-y-1/2 rounded bg-gray-900 px-2 py-1 text-sm font-medium text-white group-hover:block">
          {studio.name}
        </div>
      </button>
    </div>
  );
}

export default function ServerList({
  selectedStudioId,
  onStudioSelect,
  onCreateStudio,
}: ServerListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px 이상 이동해야 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 사용자 스튜디오 목록 조회
  const { data: studios, isLoading } = useQuery({
    queryKey: ["studios"],
    queryFn: async () => {
      const res = await fetch("/api/studios");
      if (!res.ok) throw new Error("Failed to fetch studios");
      const data = await res.json() as Studio[];
      // order 필드 기준으로 정렬 (null인 경우 createdAt으로 정렬하도록 클라이언트에서 처리)
      return data.sort((a, b) => {
        if (a.order !== null && a.order !== undefined && b.order !== null && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== null && a.order !== undefined) return -1;
        if (b.order !== null && b.order !== undefined) return 1;
        return 0; // 둘 다 null이면 기존 순서 유지
      });
    },
  });

  // 스튜디오 순서 변경 뮤테이션
  const reorderMutation = useMutation({
    mutationFn: async (studioIds: string[]) => {
      const res = await fetch("/api/studios/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studioIds }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to reorder studios");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studios"] });
      toast({
        title: "순서 변경 완료",
        description: "스튜디오 순서가 변경되었습니다.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "순서 변경 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !studios) {
      return;
    }

    const oldIndex = studios.findIndex((studio) => studio.id === active.id);
    const newIndex = studios.findIndex((studio) => studio.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newStudios = arrayMove(studios, oldIndex, newIndex);
      const studioIds = newStudios.map((studio) => studio.id);
      // 서버에서 소유한 스튜디오만 필터링하여 처리
      reorderMutation.mutate(studioIds);
    }
  };

  return (
    <>
      {/* 상단: 홈 버튼 (바다 로고) */}
      <div className="flex flex-col items-center p-3">
        <Link href="/">
          <button
            onClick={() => onStudioSelect(null)}
            className={cn(
              "group relative mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 transition-all hover:bg-gray-200",
              !selectedStudioId && "bg-black hover:bg-black"
            )}
            title="홈으로"
          >
            <Image
              src={Logo}
              alt="Dive to Bada"
              width={56}
              height={56}
              className={cn(
                "h-14 w-14 rounded-full object-contain opacity-60 group-hover:opacity-80",
                !selectedStudioId && "opacity-100 group-hover:opacity-100"
              )}
            />
          </button>
        </Link>

        {/* 찾기 버튼 */}
        <Link href="/explore">
          <button
            className="group relative mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 transition-all hover:bg-gray-200"
            title="스튜디오 찾기"
          >
            <Search className="h-7 w-7 text-gray-600 group-hover:text-gray-800" />
          </button>
        </Link>

        <div className="h-0.5 w-10 rounded-full bg-gray-300 mb-3" />
      </div>

      {/* 서버 목록 */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-2">
          {/* 스튜디오 목록 */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 w-14 animate-pulse rounded-full bg-gray-100"
                />
              ))}
            </div>
          ) : studios && studios.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={studios.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {studios.map((studio) => (
                  <SortableStudioItem
                    key={studio.id}
                    studio={studio}
                    selectedStudioId={selectedStudioId}
                    onStudioSelect={onStudioSelect}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : studios && studios.length === 0 ? (
            <div className="text-xs text-gray-400 text-center py-2">
              스튜디오 없음
            </div>
          ) : null}

          {/* 새 스튜디오 생성 버튼 */}
          <button
            onClick={onCreateStudio}
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-black hover:text-white"
            title="새 스튜디오 생성"
          >
            <Plus className="h-7 w-7" />
          </button>
        </div>
      </div>
    </>
  );
}
