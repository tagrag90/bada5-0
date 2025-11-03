"use client";

import { PostData } from "@/lib/types";
import { MoreHorizontal, Trash, Pencil, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeletePostDialog from "./DeletePostDialog";
import AddToNodeDialog from "./AddToNodeDialog";
import { useState } from "react";

interface PostMoreButtonProps {
  post: PostData;
  onEditClick: () => void;
}

export default function PostMoreButton({ post, onEditClick }: PostMoreButtonProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddToNodeDialogOpen, setIsAddToNodeDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-background/80"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={onEditClick} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsAddToNodeDialogOpen(true)} 
            className="cursor-pointer"
          >
            <Share2 className="mr-2 h-4 w-4" />
            노드로 추가
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)} 
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeletePostDialog
        post={post}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
      
      <AddToNodeDialog
        post={post}
        open={isAddToNodeDialogOpen}
        onClose={() => setIsAddToNodeDialogOpen(false)}
      />
    </>
  );
}
