"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import InviteMemberDialog from "./InviteMemberDialog";

interface MembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studioId: string;
}

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    OWNER: "소유자",
    ADMIN: "관리자",
    MODERATOR: "중간관리자",
    MEMBER: "멤버",
  };
  return labels[role] || role;
};

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    OWNER: "bg-red-100 text-red-800",
    ADMIN: "bg-blue-100 text-blue-800",
    MODERATOR: "bg-green-100 text-green-800",
    MEMBER: "bg-gray-100 text-gray-800",
  };
  return colors[role] || "bg-gray-100 text-gray-800";
};

export default function MembersDialog({
  open,
  onOpenChange,
  studioId,
}: MembersDialogProps) {
  const queryClient = useQueryClient();
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ["studio-members", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}/members`);
      if (!res.ok) throw new Error("Failed to fetch members");
      return res.json();
    },
    enabled: open,
  });

  const removeMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await fetch(
        `/api/studios/${studioId}/members?memberId=${memberId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-members", studioId] });
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>팀 멤버</DialogTitle>
              <Button size="sm" onClick={() => setShowInviteDialog(true)}>
                초대
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : members && members.length > 0 ? (
              members.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.user.avatarUrl} />
                      <AvatarFallback>
                        {member.user.displayName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.user.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        @{member.user.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(member.role)}>
                      {getRoleLabel(member.role)}
                    </Badge>
                    {member.role !== "OWNER" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMutation.mutate(member.id)}
                        disabled={removeMutation.isPending}
                        className="text-red-500"
                      >
                        제거
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                멤버가 없습니다
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <InviteMemberDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        studioId={studioId}
      />
    </>
  );
}

