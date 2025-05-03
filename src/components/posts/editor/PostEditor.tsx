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
import Link from "@tiptap/extension-link";
import {
  ImageIcon,
  ImagesIcon,
  Loader2,
  X,
  YoutubeIcon as _YoutubeIcon,
  LinkIcon,
} from "lucide-react";
import Image from "next/image";
import { ClipboardEvent, useEffect, useRef, useState, MouseEvent } from "react";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { YouTube } from "./extensions/YouTube";
import { PostData } from "@/lib/types";
import { LinkPreview } from "./extensions/LinkPreview";
import LinkPreviewComponent from "./LinkPreviewComponent";

type LinkMetadata = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
};

interface PostEditorProps {
  post?: PostData;
  isEditMode?: boolean;
  onSuccess?: () => void;
}

export default function PostEditor({ post, isEditMode = false, onSuccess }: PostEditorProps) {
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editorInput, setEditorInput] = useState("");
  const { attachments, handleUpload, isUploading, removeAttachment } =
    useMediaUpload({
      initialAttachments: post?.attachments || [],
    });

  const [linkMetadata, setLinkMetadata] = useState<LinkMetadata | null>(null);
  const [isLoadingLinkData, setIsLoadingLinkData] = useState(false);
  const [embeddedLinks, setEmbeddedLinks] = useState<LinkMetadata[]>([]);

  const fetchLinkMetadata = async (url: string) => {
    try {
      setIsLoadingLinkData(true);
      const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        setEmbeddedLinks(prev => [...prev, data]);
        setLinkMetadata(null);
      }
    } catch (error) {
      console.error("Error fetching link metadata:", error);
    } finally {
      setIsLoadingLinkData(false);
    }
  };

  const removeEmbeddedLink = (index: number) => {
    setEmbeddedLinks(prev => prev.filter((_, i) => i !== index));
  };

  const renderEmbeddedLinks = () => {
    if (embeddedLinks.length === 0) return null;
    
    return (
      <div className="mt-4 space-y-3">
        <div className="text-sm font-medium text-gray-500">첨부된 링크</div>
        {embeddedLinks.map((link, index) => (
          <div key={index} className="relative border border-gray-200 rounded-lg overflow-hidden">
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col md:flex-row no-underline"
            >
              {link.image && (
                <div className="relative md:w-1/3 h-40">
                  <Image 
                    src={link.image}
                    alt={link.title || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 flex-1">
                <div className="text-sm text-gray-500 mb-1">
                  {new URL(link.url).hostname}
                </div>
                {link.title && (
                  <h3 className="font-medium text-base mb-1">{link.title}</h3>
                )}
                {link.description && (
                  <p className="text-sm text-gray-700 line-clamp-2">{link.description}</p>
                )}
              </div>
            </a>
            <button
              onClick={() => removeEmbeddedLink(index)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-1 rounded-full text-white"
              aria-label="Remove link"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const handleLinkPreview = () => {
    if (linkMetadata && editor) {
      try {
        // 미리보기 대신 링크 제목 + URL을 삽입
        const linkText = linkMetadata.title || linkMetadata.url;
        
        // 새 단락에 텍스트 삽입
        editor.commands.focus();
        
        // 이전에 삽입된 내용 다음에 새 문단 생성하고 링크 삽입
        editor.commands.createParagraphNear();
        
        // 먼저 일반 텍스트로 제목 삽입
        editor.commands.insertContent(linkText);
        
        // 선택 영역을 이전에 삽입한 텍스트로 확장
        if (editor.commands.setTextSelection) {
          const { to } = editor.state.selection;
          const from = to - linkText.length;
          editor.commands.setTextSelection({ from, to });
        }
        
        // 선택된 텍스트를 링크로 변환
        editor.commands.setLink({ href: linkMetadata.url });
        
        // 커서를 링크 다음으로 이동
        editor.commands.focus();
        
        setLinkMetadata(null);
      } catch (error) {
        console.error('링크 삽입 중 오류 발생:', error);
      }
    }
  };

  const removeLinkPreview = () => {
    setLinkMetadata(null);
  };

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
      // 트위터 스타일 링크 확장
      Link.configure({
        openOnClick: true,
        autolink: true, // URL 자동 감지
        linkOnPaste: true, // 붙여넣기 시 자동으로 링크 생성
        HTMLAttributes: {
          class: 'text-primary underline hover:no-underline',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      LinkPreview.configure({
        HTMLAttributes: {
          class: 'link-preview-block',
        },
      }),
    ],
    content: post?.content || "",
    onUpdate: ({ editor }) => {
      setEditorInput(editor.getHTML());
    },
  });

  useEffect(() => {
    if (post && editor && !editor.isDestroyed) {
      editor.commands.setContent(post.content || "");
    }
  }, [post, editor]);

  // const post mutation/query
  const mutation = useSubmitPostMutation();

  function handleImageClick() {
    inputRef.current?.click();
  }

  function handleRemoveImage(e: MouseEvent, idx: number) {
    e.stopPropagation();
    removeAttachment(idx);
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text/plain");
    // YouTube URL 감지
    const youtubeRegex =
      /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/g;
    const youtubeMatch = text.match(youtubeRegex);

    if (youtubeMatch && youtubeMatch[0]) {
      e.preventDefault();
      const videoIdMatch = youtubeMatch[0].match(/(?:v=|be\/)([^&\s]+)/);
      if (videoIdMatch && videoIdMatch[1]) {
        editor?.commands.insertContent({
          type: "youtube",
          attrs: {
            src: `https://www.youtube.com/embed/${videoIdMatch[1]}`,
          },
        });
      }
      return;
    }

    // 일반 URL 감지 (YouTube URL이 아닌 경우만)
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urlMatch = text.match(urlRegex);
    
    if (urlMatch && urlMatch[0] && !youtubeMatch) {
      try {
        const url = new URL(urlMatch[0]);
        fetchLinkMetadata(url.toString());
      } catch (error) {
        console.error("Invalid URL:", error);
      }
    }
  }

  function handleYoutubeEmbed() {
    const url = prompt("YouTube URL을 입력하세요");
    if (url && editor) {
      // YouTube URL에서 ID 추출 시도
      const videoIdMatch = url.match(/(?:v=|be\/)([^&\s]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : url;
      
      editor.commands.insertContent({
        type: "youtube",
        attrs: {
          src: videoId.includes('youtube.com/embed/') ? videoId : `https://www.youtube.com/embed/${videoId}`,
        },
      });
    }
  }

  function handleLinkInsert() {
    const url = prompt("URL을 입력하세요");
    if (url) {
      try {
        const validatedUrl = new URL(url);
        fetchLinkMetadata(validatedUrl.toString());
        
        if (editor) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      } catch (e) {
        alert('유효한 URL을 입력해주세요.');
      }
    }
  }

  async function handleSubmit() {
    if (
      (!editorInput || editorInput === "<p></p>") &&
      attachments.length === 0 &&
      embeddedLinks.length === 0
    ) {
      return;
    }

    try {
      // mediaId 배열만 추출하여 전달
      const mediaIdsToSend = attachments
        .map(att => att.mediaId)
        .filter(id => id !== undefined) as string[]; // mediaId가 있는 것만 필터링

      await mutation.mutateAsync({
        content: editorInput,
        mediaIds: mediaIdsToSend, // <<< 변경 후: ID 배열 전달
        embeddedLinks,
        ...(isEditMode && post ? { postId: post.id } : {}),
      });

      if (editor) {
        editor.commands.clearContent();
      }
      
      setEmbeddedLinks([]);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting post", error);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <UserAvatar
            user={session?.user}
            className="h-10 w-10 sm:h-12 sm:w-12"
          />
        </div>
        <div className="flex-grow flex flex-col gap-2 min-w-0">
          {/* 파일 입력 (숨김) */}
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            multiple
          />

          {/* 에디터 영역 */}
          <div
            className={cn("w-full min-h-[100px] outline-none", {
              "opacity-50 pointer-events-none": mutation.isPending,
            })}
            onClick={() => editor?.commands.focus()}
            onPaste={onPaste}
          >
            <EditorContent editor={editor} className="prose max-w-full" />
          </div>

          {/* 링크 미리보기 영역 */}
          {linkMetadata && (
            <div className="my-2">
              <LinkPreviewComponent
                url={linkMetadata.url}
                title={linkMetadata.title}
                description={linkMetadata.description}
                image={linkMetadata.image}
                onRemove={removeLinkPreview}
              />
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={removeLinkPreview}
                >
                  취소
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleLinkPreview}
                >
                  미리보기 추가
                </Button>
              </div>
            </div>
          )}

          {/* 미디어 업로드 표시 */}
          {isUploading && (
            <div className="border border-border rounded-md p-4 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">업로드 중...</span>
              </div>
            </div>
          )}

          {/* 이미지 첨부 미리보기 */}
          {attachments.length > 0 && (
            <div
              className={cn(
                "grid gap-2 mt-2",
                attachments.length === 1
                  ? "grid-cols-1"
                  : "grid-cols-2 sm:grid-cols-3"
              )}
            >
              {attachments.map((att, idx) => (
                <div
                  key={att.url}
                  className="relative rounded-md overflow-hidden aspect-square bg-gray-100 group"
                >
                  <Image
                    src={att.url}
                    alt={`Attachment ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleRemoveImage(e, idx)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 임베드된 링크 렌더링 */}
          {renderEmbeddedLinks()}

          {/* 하단 버튼 영역 - 트위터 스타일 */}
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full h-10 w-10 text-primary hover:bg-primary/10",
                  editor?.isActive('bold') && "bg-primary/10"
                )}
                onClick={() => editor?.chain().focus().toggleBold().run()}
                title="볼드체"
                disabled={!editor?.can().chain().focus().toggleBold().run()}
              >
                <span className="font-bold text-lg" style={{ fontFamily: "'MaruBuri', serif" }}>B</span>
              </Button>

              {/* 세로 구분선 */}
              <div className="h-6 w-px bg-gray-300" />

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
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 text-primary hover:bg-primary/10"
                onClick={handleLinkInsert}
                title="링크 추가"
              >
                <LinkIcon className="h-5 w-5" />
              </Button>
            </div>
            
            <LoadingButton
              loading={mutation.isPending}
              disabled={
                (!editorInput || editorInput === "<p></p>") &&
                attachments.length === 0 &&
                embeddedLinks.length === 0
              }
              onClick={handleSubmit}
              className="rounded-full px-4"
            >
              {isEditMode ? "수정하기" : "게시하기"}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}  