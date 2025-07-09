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
  Bold,
  CodeIcon,
  HighlighterIcon,
  ImagesIcon,
  ItalicIcon,
  Loader2,
  StrikethroughIcon,
  UnderlineIcon,
  X,
  YoutubeIcon as _YoutubeIcon,
} from "lucide-react";
import Image from "next/image";
import { ClipboardEvent, useEffect, useRef, useState } from "react";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { YouTube } from "./extensions/YouTube";
import { PostData } from "@/lib/types";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";

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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false,
      }),
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => this.editor.commands.setHardBreak(),
          };
        },
      }).configure({
        keepMarks: true,
        HTMLAttributes: {
          class: "my-custom-break",
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
      Italic,
      Underline,
      Strike,
      Code,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        autolink: true,
        openOnClick: false,
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
        const initialAttachments: Attachment[] = post.attachments.map(
          (attachment) => ({
            id: attachment.id,
            url: attachment.url,
            type: attachment.type,
            file: new File([], "placeholder.jpg"),
            isUploading: false,
          }),
        );
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
          mediaIds: attachments
            .map((a) => a.id || a.mediaId)
            .filter(Boolean) as string[],
        });
      } else {
        await mutation.mutateAsync({
          content: editorInput,
          mediaIds: attachments
            .map((a) => a.mediaId)
            .filter(Boolean) as string[],
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
      const youtubeRegex =
        /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
      const match = url.match(youtubeRegex);

      if (match && match[1]) {
        const videoId = match[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        editor.commands.insertContent({
          type: "youtube",
          attrs: {
            src: embedUrl,
          },
        });
      } else {
        alert("유효하지 않은 YouTube URL입니다.");
      }
    }
  }

  const editorActiveStyle =
    "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground";

  if (!editor || !user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="flex gap-3">
          <UserAvatar avatarUrl={user.avatarUrl} userId={user.id} size={40} />
          <div className="flex-1">
            <EditorContent
              editor={editor}
              className="prose prose-stone dark:prose-invert w-full max-w-full focus:outline-none min-h-[150px]"
            />
          </div>
        </div>

        {attachments.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id || attachment.file.name}
                className="relative rounded-lg overflow-hidden aspect-square"
              >
                {attachment.type === "IMAGE" ||
                attachment.file.type.startsWith("image") ? (
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
                  onClick={() =>
                    removeAttachment(attachment.id || attachment.file.name)
                  }
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

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

        <div className="mt-2 flex items-center gap-1 border-y p-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full", editorActiveStyle)}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            data-active={editor.isActive("bold")}
            title="굵게"
          >
            <Bold className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full", editorActiveStyle)}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            data-active={editor.isActive("italic")}
            title="기울임꼴"
          >
            <ItalicIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full", editorActiveStyle)}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            data-active={editor.isActive("underline")}
            title="밑줄"
          >
            <UnderlineIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full", editorActiveStyle)}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            data-active={editor.isActive("strike")}
            title="취소선"
          >
            <StrikethroughIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full", editorActiveStyle)}
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            data-active={editor.isActive("code")}
            title="코드"
          >
            <CodeIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full", editorActiveStyle)}
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: "#B2FF85" }).run()
            }
            disabled={!editor.can().chain().focus().toggleHighlight().run()}
            data-active={editor.isActive("highlight", { color: "#B2FF85" })}
            title="하이라이트"
          >
            <HighlighterIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleImageClick}
            disabled={isUploading}
            title="미디어"
          >
            <ImagesIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleYoutubeEmbed}
            disabled={!editor}
            title="유튜브"
          >
            <_YoutubeIcon className="h-5 w-5" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              startUpload(Array.from(e.target.files));
              e.target.value = "";
            }
          }}
        />
        <div className="mt-2 flex justify-end">
          <LoadingButton
            onClick={handleSubmit}
            loading={mutation.isPending}
            disabled={!editorInput.trim() && attachments.length === 0}
            className="min-w-20"
          >
            {isEditMode ? "수정" : "게시"}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}  