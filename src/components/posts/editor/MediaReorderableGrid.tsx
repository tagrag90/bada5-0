"use client";

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
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, GripVertical, Image as ImageIcon, Video } from "lucide-react";
import Image from "next/image";
import { Attachment } from "./useMediaUpload";
import { cn } from "@/lib/utils";

interface MediaReorderableGridProps {
  attachments: Attachment[];
  onReorder: (newAttachments: Attachment[]) => void;
  onRemove: (attachmentId: string) => void;
}

interface SortableItemProps {
  attachment: Attachment;
  index: number;
  onRemove: (attachmentId: string) => void;
}

function SortableItem({ attachment, index, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: attachment.id || attachment.file.name + index,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group rounded-lg overflow-hidden w-32 h-32 bg-muted flex-shrink-0 cursor-grab active:cursor-grabbing",
        isDragging && "shadow-lg rotate-3 scale-105 z-50 opacity-50"
      )}
      {...attributes}
      {...listeners}
    >
      {/* 드래그 가능 영역 표시 (호버 시) */}
      <div
        className={cn(
          "absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10",
          isDragging && "opacity-100"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <GripVertical className="h-6 w-6 text-white drop-shadow-lg" />
        </div>
      </div>

      {/* 미디어 타입 표시 */}
      <div className="absolute top-2 right-2 z-15 pointer-events-none">
        <div className="px-2 py-1 rounded bg-black/60 text-white text-sm font-medium flex items-center">
          {attachment.type === "VIDEO" || attachment.file.type.startsWith("video") ? (
            <Video className="h-3 w-3" />
          ) : (
            <ImageIcon className="h-3 w-3" />
          )}
        </div>
      </div>

      {/* 미디어 콘텐츠 */}
      {attachment.type === "VIDEO" || attachment.file.type.startsWith("video") ? (
        <video
          src={attachment.url || URL.createObjectURL(attachment.file)}
          className="w-full h-full object-cover pointer-events-none"
          muted
          playsInline
        />
      ) : (
        <Image
          src={attachment.url || URL.createObjectURL(attachment.file)}
          alt={`Attachment ${index + 1}`}
          fill
          className="object-cover pointer-events-none"
        />
      )}

      {/* 업로드 중 오버레이 */}
      {attachment.isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mx-auto mb-2"></div>
            <p className="text-sm">업로드 중...</p>
          </div>
        </div>
      )}

      {/* 삭제 버튼 */}
      <button
        type="button"
        className={cn(
          "absolute top-2 right-14 z-20 p-1.5 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 pointer-events-auto",
          isDragging && "opacity-0"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(attachment.id || attachment.file.name);
        }}
        title="삭제"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClickCapture={(e) => e.stopPropagation()}
      >
        <X className="h-3 w-3" />
      </button>

      {/* 순서 번호 */}
      <div className="absolute bottom-2 left-2 z-15 px-2 py-1 rounded bg-black/60 text-white text-sm font-medium pointer-events-none">
        {index + 1}
      </div>
    </div>
  );
}

export default function MediaReorderableGrid({
  attachments,
  onReorder,
  onRemove,
}: MediaReorderableGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = attachments.findIndex(
        (item, index) => (item.id || item.file.name + index) === active.id
      );
      const newIndex = attachments.findIndex(
        (item, index) => (item.id || item.file.name + index) === over.id
      );

      const reorderedAttachments = arrayMove(attachments, oldIndex, newIndex);
      onReorder(reorderedAttachments);
    }
  }

  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          미디어 파일 ({attachments.length}/4)
        </span>
        <span className="text-xs text-muted-foreground">
          드래그하여 순서 변경 가능
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 p-3 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-x-auto">
          <SortableContext
            items={attachments.map((item, index) => item.id || item.file.name + index)}
            strategy={rectSortingStrategy}
          >
            {attachments.map((attachment, index) => (
              <SortableItem
                key={attachment.id || attachment.file.name + index}
                attachment={attachment}
                index={index}
                onRemove={onRemove}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {/* 도움말 */}
      <div className="mt-3 text-sm text-muted-foreground text-center">
        💡 사진을 클릭하여 드래그하면 표시 순서를 변경할 수 있습니다. 첫 번째 사진이 대표 이미지로 표시됩니다.
      </div>
    </div>
  );
}
