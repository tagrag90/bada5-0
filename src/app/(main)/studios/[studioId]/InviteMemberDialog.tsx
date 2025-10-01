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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studioId: string;
}

export default function InviteMemberDialog({
  open,
  onOpenChange,
  studioId,
}: InviteMemberDialogProps) {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"MEMBER" | "MODERATOR" | "ADMIN">("MEMBER");

  const inviteMutation = useMutation({
    mutationFn: async (data: { username: string; role: string }) => {
      const res = await fetch(`/api/studios/${studioId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to invite member");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-members", studioId] });
      setUsername("");
      setRole("MEMBER");
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate({ username, role });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white dark:bg-gray-900 p-6">
        <DialogHeader>
          <DialogTitle>멤버 초대</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username">사용자 아이디</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>역할</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="MEMBER"
                  checked={role === "MEMBER"}
                  onChange={(e) => setRole(e.target.value as "MEMBER")}
                />
                <span className="text-sm">멤버 (기본)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="MODERATOR"
                  checked={role === "MODERATOR"}
                  onChange={(e) => setRole(e.target.value as "MODERATOR")}
                />
                <span className="text-sm">중간관리자</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="ADMIN"
                  checked={role === "ADMIN"}
                  onChange={(e) => setRole(e.target.value as "ADMIN")}
                />
                <span className="text-sm">관리자</span>
              </label>
            </div>
          </div>

          {inviteMutation.error && (
            <p className="text-sm text-red-500">
              {(inviteMutation.error as Error).message}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={inviteMutation.isPending}
              className="flex-1"
            >
              {inviteMutation.isPending ? "초대 중..." : "초대하기"}
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

