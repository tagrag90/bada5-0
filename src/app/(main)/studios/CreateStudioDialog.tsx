"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateStudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateStudioDialog({
  open,
  onOpenChange,
}: CreateStudioDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"PERSONAL" | "TEAM">("PERSONAL");

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/studios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create studio");
      }
      return res.json();
    },
    onSuccess: (studio) => {
      queryClient.invalidateQueries({ queryKey: ["studios"] });
      onOpenChange(false);
      resetForm();
      router.push(`/studios/${studio.id}`);
    },
  });

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setType("PERSONAL");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name, slug, description, type });
  };

  // 이름에서 슬러그 자동 생성
  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(autoSlug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 p-6">
        <DialogHeader>
          <DialogTitle>새 스튜디오 만들기</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">스튜디오 이름 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="예: NewJeans Official"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">슬러그 (URL) *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="예: newjeans-official"
              required
            />
            <p className="text-xs text-muted-foreground">
              /studios/{slug || "your-studio"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="스튜디오 소개..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>타입</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="PERSONAL"
                  checked={type === "PERSONAL"}
                  onChange={(e) => setType(e.target.value as "PERSONAL")}
                />
                <span className="text-sm">개인 (1인 크리에이터)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="TEAM"
                  checked={type === "TEAM"}
                  onChange={(e) => setType(e.target.value as "TEAM")}
                />
                <span className="text-sm">팀 (협업)</span>
              </label>
            </div>
          </div>

          {createMutation.error && (
            <p className="text-sm text-red-500">
              {(createMutation.error as Error).message}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending ? "생성 중..." : "생성하기"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

