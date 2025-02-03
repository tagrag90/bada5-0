"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDropzone } from "@uploadthing/react";
import {
  ImageIcon,
  ImagesIcon,
  Loader2,
  X,
  YoutubeIcon as _YoutubeIcon,
} from "lucide-react";
import Image from "next/image";
import { ClipboardEvent, useRef, useState } from "react";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { YouTube } from "./extensions/YouTube";

interface PostEditorProps {
  onSuccess?: () => void;
}

export default function PostEditor({ onSuccess }: PostEditorProps) {
  const { user } = useSession();
  const [editorInput, setEditorInput] = useState("");

  const mutation = useSubmitPostMutation();

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();

  const input = useRef("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "무슨 일이 있었나요??",
      }),
      YouTube.configure({
        HTMLAttributes: {
          class: "w-full aspect-video",
        },
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setEditorInput(editor.getHTML());
      input.current = editor.getText();
    },
    immediatelyRender: false
  });

  const onSubmit = async () => {
    console.log("Submitting content:", input);
    console.log("Editor HTML:", editor?.getHTML());

    mutation.mutate(
      {
        content: editor?.getHTML() || "",
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUploads();
          onSuccess?.();
        },
      },
    );
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
    const url = prompt("YouTube URL을 입력해주세요:");
    if (!url) return;

    try {
      const videoId = extractYoutubeVideoId(url);
      if (videoId) {
        editor?.commands.insertContent({
          type: "youtube",
          attrs: {
            src: `https://www.youtube.com/embed/${videoId}`,
          },
        });
      } else {
        alert("올바른 YouTube URL을 입력해주세요.");
      }
    } catch (e) {
      alert("올바른 URL을 입력해주세요.");
    }
  }

  function extractYoutubeVideoId(url: string) {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card">
      <div className="flex gap-5">
        <div className="flex flex-col items-center">
          <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        </div>
        <div className="w-full">
          <div className="mb-2 text-sm font-medium">{user.username}</div>
          <div {...rootProps} className="w-full">
            <EditorContent
              editor={editor}
              className={cn(
                "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-[#fff]",
                isDragActive && "outline-dashed",
              )}
              onPaste={onPaste}
            />
            <input {...getInputProps()} />
          </div>
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex items-center">
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
          onYoutubeEmbed={handleYoutubeEmbed}
        />
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <div className="flex-1" />
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={
            (!input.current?.trim() &&
              attachments.length === 0 &&
              !editor?.getHTML()?.includes("youtube.com/embed")) ||
            isUploading
          }
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
  onYoutubeEmbed: () => void;
}

function AddAttachmentsButton({
  onFilesSelected,
  disabled,
  onYoutubeEmbed,
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary p-0"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImagesIcon size={22} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}

function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className="relative w-full overflow-x-auto">
      <div className="flex gap-2 pb-2 ml-6 pl-5">
        {attachments.map((attachment) => (
          <AttachmentPreview
            key={attachment.file.name}
            attachment={attachment}
            onRemoveClick={() => removeAttachment(attachment.file.name)}
          />
        ))}
      </div>
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

function AttachmentPreview({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn(
        "relative flex-shrink-0",
        isUploading && "opacity-50"
      )}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="h-[200px] w-[200px] rounded-xl object-cover"
        />
      ) : (
        <video 
          controls
          preload="metadata"
          playsInline
          className="h-[200px] w-[200px] rounded-xl object-cover"
        >
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}  