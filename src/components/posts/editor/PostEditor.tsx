"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HardBreak from "@tiptap/extension-hard-break";
import {
  ImageIcon,
  ImagesIcon,
  Loader2,
  X,
  YoutubeIcon as _YoutubeIcon,
} from "lucide-react";
import Image from "next/image";
import { ClipboardEvent, useEffect, useRef, useState, MouseEvent } from "react";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { YouTube } from "./extensions/YouTube";
import { PostData } from "@/lib/types";

interface PostEditorProps {
  onSuccess?: () => void;
  post?: PostData;
}

export default function PostEditor({ onSuccess, post }: PostEditorProps) {
  const { user } = useSession();
  const [editorInput, setEditorInput] = useState("");
  const isEditMode = !!post;

  const mutation = useSubmitPostMutation();
  
  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
    setAttachments,
  } = useMediaUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 이미지 버튼 클릭 핸들러
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const input = useRef("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 기본 하드 브레이크 비활성화 (Shift+Enter)
        hardBreak: false,
      }),
      // 커스텀 하드 브레이크 설정 (Enter로 줄바꿈)
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            'Enter': () => this.editor.commands.setHardBreak(),
          }
        },
      }).configure({
        keepMarks: true,
        HTMLAttributes: {
          class: 'my-custom-break',
        },
      }),
      Placeholder.configure({
        placeholder: "무슨 일이 일어나고 있나요?",
      }),
      YouTube.configure({
        inline: false,
        HTMLAttributes: {
          class: "w-full aspect-video rounded-xl overflow-hidden",
        },
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setEditorInput(editor.getHTML());
    },
  });

  useEffect(() => {
    if (isEditMode && post && editor) {
      editor.commands.setContent(post.content || "");
      setEditorInput(post.content || "");
      
      if (post.attachments && post.attachments.length > 0) {
        const initialAttachments: Attachment[] = post.attachments.map((attachment) => ({
          id: attachment.id,
          url: attachment.url,
          type: attachment.type,
          file: new File([], "placeholder.jpg"),
          isUploading: false,
        }));
        setAttachments(initialAttachments);
      }
    }
  }, [isEditMode, post, editor, setAttachments]);

  const handleSubmit = async () => {
    try {
      if (isEditMode && post) {
        await mutation.mutateAsync({
          id: post.id,
          content: editorInput,
          mediaIds: attachments.map((a) => a.id || a.mediaId).filter(Boolean) as string[],
        });
      } else {
        await mutation.mutateAsync({
          content: editorInput,
          mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
        });
      }

      editor?.commands.clearContent();
      resetMediaUploads();
      setEditorInput("");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to submit post:", error);
    }
  };

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text/plain");
    const youtubeRegex =
      /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/g;
    const match = text.match(youtubeRegex);

    if (match && match[1]) {
      e.preventDefault();
      const videoId = match[1];
      editor?.commands.insertContent({
        type: "youtube",
        attrs: {
          src: `https://www.youtube.com/embed/${videoId}`,
        },
      });
    }
  }

  function handleYoutubeEmbed() {
    const url = prompt("YouTube URL을 입력하세요");
    if (url && editor) {
      editor.commands.insertContent({
        type: "youtube",
        attrs: {
          src: url,
        },
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="flex gap-3">
          <UserAvatar avatarUrl={user?.avatarUrl} size={40} />
          <div className="flex-1">
            <EditorContent
              editor={editor}
              className="prose prose-stone dark:prose-invert w-full max-w-full focus:outline-none min-h-[150px]"
            />
          </div>
        </div>

        {/* 첨부파일 미리보기 */}
        {attachments.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id || attachment.file.name}
                className="relative rounded-lg overflow-hidden aspect-square"
              >
                {(attachment.type === "IMAGE" || attachment.file.type.startsWith("image")) ? (
                  <Image
                    src={attachment.url || URL.createObjectURL(attachment.file)}
                    alt="Attachment"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={attachment.url || URL.createObjectURL(attachment.file)}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                  onClick={() => removeAttachment(attachment.id || attachment.file.name)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 업로드 진행 상태 */}
        {isUploading && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                업로드 중... {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-muted h-1 mt-1 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length) {
              startUpload(files);
              e.target.value = '';
            }
          }}
        />
      </div>

      {/* 하단 버튼 영역 - 트위터 스타일 */}
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 text-primary hover:bg-primary/10"
            onClick={handleImageClick}
            title="이미지 추가"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 text-primary hover:bg-primary/10"
            onClick={handleYoutubeEmbed}
            title="YouTube 영상 추가"
          >
            <_YoutubeIcon className="h-5 w-5" />
          </Button>
        </div>
        
        <LoadingButton
          loading={mutation.isPending}
          disabled={
            (!editorInput || editorInput === "<p></p>") &&
            attachments.length === 0
          }
          onClick={handleSubmit}
          className="rounded-full px-4"
        >
          {isEditMode ? "수정하기" : "게시하기"}
        </LoadingButton>
      </div>
    </div>
  );
}  