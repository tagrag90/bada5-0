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
import { ClipboardEvent, DragEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";
import "./DragHandle.css";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import MediaReorderableGrid from "./MediaReorderableGrid";
// import { YouTube } from "./extensions/YouTube"; // YouTube 별도 임베드 기능 제거
import { PostData } from "@/lib/types";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import LinkPreview from "./extensions/LinkPreview";
import LinkPreviewComponent from "./LinkPreviewComponent";

// 디바운스 함수 추가
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

interface PostEditorProps {
  onSuccess?: () => void;
  post?: PostData;
  studioId?: string;
  studio?: any;
}

export default function PostEditor({ onSuccess, post, studioId, studio }: PostEditorProps) {
  const { user } = useSession();
  const [editorInput, setEditorInput] = useState("");
  const [title, setTitle] = useState(post?.title || "");
  const isEditMode = !!post;
  const placeholderText = studio ? "이야기를 시작하세요..." : "무슨 일이 일어나고 있나요?";
  
  // 드래그 앤 드롭 상태 관리
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  
  // 링크 미리보기 상태 관리 (임시 비활성화)
  const [linkPreviews, setLinkPreviews] = useState<Array<{
    url: string;
    title?: string;
    description?: string;
    image?: string;
    id: string;
  }>>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

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
    if (studio) {
      // 스튜디오: 파일 선택기 열기 (인라인 삽입용)
      fileInputRef.current?.click();
    } else {
      // 일반 유저: 기존 방식
      fileInputRef.current?.click();
    }
  };

  // 드래그 앤 드롭 이벤트 핸들러들
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragCounter(prev => prev + 1);
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      // 파일이 포함된 드래그인지 확인
      const hasFiles = Array.from(e.dataTransfer.items).some(
        item => item.kind === 'file' && item.type.startsWith('image/')
      );
      
      if (hasFiles) {
        setIsDragOver(true);
      }
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragCounter(prev => prev - 1);
    
    if (dragCounter <= 1) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    setDragCounter(0);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (imageFiles.length > 0) {
      if (studio) {
        // 스튜디오: 인라인 삽입을 위해 업로드
        handleStudioImageUpload(imageFiles);
      } else {
        // 일반: 기존 방식
        startUpload(imageFiles);
      }
    }
  };

  // 스튜디오 이미지 업로드
  const handleStudioImageUpload = (files: File[]) => {
    startUpload(files);
  };

  // URL별 로딩 상태 관리 (중복 방지)
  const [loadingUrls, setLoadingUrls] = useState<Set<string>>(new Set());
  const lastProcessedContent = useRef<string>("");
  
  // 디바운스된 URL 감지 함수 - React StrictMode 대응
  const detectAndPreviewUrls = useCallback(
    debounce(async (content: string) => {
      // 개발 모드에서만 중복 방지 (StrictMode 대응)
      if (process.env.NODE_ENV === 'development') {
        if (lastProcessedContent.current === content) return;
        lastProcessedContent.current = content;
      }
      
      // URL 패턴 감지 (http, https로 시작하는 URL)
      const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
      const urls = content.match(urlRegex);
      
      if (!urls) return;
      
      // img 태그 안의 URL 추출 (제외용)
      const imgSrcRegex = /<img[^>]+src=["']([^"']+)["']/g;
      const imgUrls = new Set<string>();
      let imgMatch;
      while ((imgMatch = imgSrcRegex.exec(content)) !== null) {
        imgUrls.add(imgMatch[1]);
      }
      
      // 새로운 URL만 처리 (이미 미리보기가 생성된 URL 또는 로딩 중인 URL 제외)
      const newUrls = urls.filter(url => 
        !linkPreviews.some(preview => preview.url === url) &&
        !loadingUrls.has(url) &&
        !url.match(/\.(jpg|jpeg|png|gif|webp|mp4|avi|mov)$/i) && // 이미지/비디오 파일 제외
        !url.includes('utfs.io') && // uploadthing 이미지 URL 제외
        !imgUrls.has(url) && // img 태그 안의 URL 제외
        true // 모든 URL 처리 (YouTube 포함)
      );
      
      if (newUrls.length === 0) return;
      
      // 각 URL에 대해 미리보기 생성 (순차 처리로 중복 방지)
      for (const url of newUrls.slice(0, 2)) { // 최대 2개로 제한
        await fetchLinkPreview(url);
      }
    }, 1500), // 1.5초 디바운스로 충분한 지연
    [linkPreviews, loadingUrls]
  );

  // 링크 미리보기 데이터 가져오기 (완전한 중복 방지)
  const fetchLinkPreview = async (url: string) => {
    // URL별 중복 요청 방지
    if (loadingUrls.has(url)) {
      console.log(`이미 로딩 중인 URL: ${url}`);
      return;
    }
    
    // 이미 존재하는 미리보기 확인
    if (linkPreviews.some(preview => preview.url === url)) {
      console.log(`이미 존재하는 미리보기: ${url}`);
      return;
    }
    
    console.log(`새로운 링크 미리보기 생성 시작: ${url}`);
    
    // 로딩 상태에 URL 추가
    setLoadingUrls(prev => {
      const newSet = new Set(prev);
      newSet.add(url);
      return newSet;
    });
    setIsLoadingPreview(true);
    
    try {
      const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const metadata = await response.json();
      console.log(`링크 미리보기 데이터 수신:`, metadata);
      
      // 미리보기 데이터 추가 (중복 체크 한번 더)
      setLinkPreviews(prev => {
        const exists = prev.some(preview => preview.url === url);
        if (exists) {
          console.log(`중복 방지: 이미 존재하는 URL ${url}`);
          return prev;
        }
        
        // URL 제거 안내
        console.log(`✅ 링크 미리보기 생성 완료: ${url}`);
        console.log(`💡 게시 시 해당 URL은 자동으로 숨겨집니다.`);
        
        return [...prev, {
          ...metadata,
          id: crypto.randomUUID()
        }];
      });
      
    } catch (error) {
      console.error('링크 미리보기 생성 실패:', error);
    } finally {
      // 로딩 상태에서 URL 제거
      setLoadingUrls(prev => {
        const newSet = new Set(prev);
        newSet.delete(url);
        return newSet;
      });
      
      // 모든 로딩이 완료되면 전체 로딩 상태 해제
      setTimeout(() => {
        setLoadingUrls(current => {
          if (current.size === 0) {
            setIsLoadingPreview(false);
          }
          return current;
        });
      }, 100);
    }
  };

  // 링크 미리보기 제거
  const removeLinkPreview = (id: string) => {
    setLinkPreviews(prev => prev.filter(preview => preview.id !== id));
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false,
        paragraph: {
          HTMLAttributes: {
            class: "my-2",
            ...(studio && {
              draggable: "true",
              'data-drag-handle': "",
            }),
          },
        },
        heading: {
          HTMLAttributes: {
            ...(studio && {
              draggable: "true",
              'data-drag-handle': "",
            }),
          },
        },
        blockquote: {
          HTMLAttributes: {
            ...(studio && {
              draggable: "true",
              'data-drag-handle': "",
            }),
          },
        },
        codeBlock: {
          HTMLAttributes: {
            ...(studio && {
              draggable: "true",
              'data-drag-handle': "",
            }),
          },
        },
      }),
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            "Shift-Enter": () => this.editor.commands.setHardBreak(),
          };
        },
      }).configure({
        keepMarks: true,
        HTMLAttributes: {
          class: "my-custom-break",
        },
      }),
      Placeholder.configure({
        placeholder: placeholderText,
      }),
      // YouTube.configure({
      //   inline: false,
      //   HTMLAttributes: {
      //     class: "w-full aspect-video rounded-xl overflow-hidden",
      //   },
      // }),
      Italic,
      Underline,
      Strike,
      Code,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        autolink: true,
        openOnClick: false,
      }),
      TiptapImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4 cursor-move",
          draggable: "true",
        },
      }),
      Dropcursor.configure({
        color: "#00DD89",
        width: 3,
      }),
      // LinkPreview.configure({
      //   HTMLAttributes: {
      //     class: 'link-preview-block'
      //   }
      // }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setEditorInput(editor.getHTML());
      // URL 감지 및 미리보기 생성 (개선된 중복 방지)
      detectAndPreviewUrls(editor.getHTML());
    },
  });

  useEffect(() => {
    if (isEditMode && post && editor) {
      // 수정 모드에서 content 처리
      let cleanContent = post.content || "";
      let extractedPreviews: any[] = [];
      
      // content에서 링크 미리보기 메타데이터 추출
      const linkPreviewMatch = cleanContent.match(/<!-- LINK_PREVIEWS: (.*?) -->/);
      if (linkPreviewMatch) {
        try {
          extractedPreviews = JSON.parse(linkPreviewMatch[1]);
          setLinkPreviews(extractedPreviews);
        } catch (error) {
          console.error('링크 미리보기 파싱 오류:', error);
        }
      }
      
      // 숨겨진 링크들을 다시 복원하여 에디터에 표시
      const restoredContent = cleanContent
        .replace(/<!-- LINK_PREVIEWS: .*? -->/g, '') // 메타데이터 제거
        .replace(/<!-- HIDDEN_LINK: (.*?) -->/g, (match, hiddenUrl) => {
          // 숨겨진 하이퍼링크를 다시 복원
          return `<a href="${hiddenUrl}" target="_blank" rel="noopener noreferrer">${hiddenUrl}</a>`;
        })
        .replace(/<!-- HIDDEN_URL: (.*?) -->/g, '$1'); // 숨겨진 URL 텍스트 복원
      
      editor.commands.setContent(restoredContent);
      setEditorInput(restoredContent);

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

  // 이미 삽입된 이미지 URL 추적
  const insertedImageUrls = useRef<Set<string>>(new Set());

  // 스튜디오에서 업로드 완료 시 에디터에 삽입
  useEffect(() => {
    if (studio && attachments.length > 0 && editor) {
      attachments.forEach((attachment) => {
        if (
          attachment.url && 
          !attachment.isUploading && 
          !insertedImageUrls.current.has(attachment.url)
        ) {
          // 에디터에 이미지 삽입
          editor.commands.setImage({ 
            src: attachment.url,
            alt: attachment.file.name 
          });
          // 삽입 완료 표시
          insertedImageUrls.current.add(attachment.url);
          // attachments에서 제거
          setTimeout(() => removeAttachment(attachment.file.name), 100);
        }
      });
    }
  }, [attachments, studio, editor, removeAttachment]);

  const handleSubmit = async () => {
    try {
      if (isEditMode && post) {
        await mutation.mutateAsync({
          id: post.id,
          title: studio ? title : undefined,
          content: editorInput,
          mediaIds: studio ? [] : attachments
            .map((a) => a.id || a.mediaId)
            .filter(Boolean) as string[],
          linkPreviews: linkPreviews.length > 0 ? linkPreviews : undefined,
        });
      } else {
        await mutation.mutateAsync({
          title: studio ? title : undefined,
          content: editorInput,
          mediaIds: studio ? [] : attachments
            .map((a) => a.mediaId)
            .filter(Boolean) as string[],
          linkPreviews: linkPreviews.length > 0 ? linkPreviews : undefined,
          studioId,
        });
      }

      editor?.commands.clearContent();
      resetMediaUploads();
      setLinkPreviews([]); // 링크 미리보기 초기화
      setEditorInput("");
      setTitle("");
      insertedImageUrls.current.clear(); // 삽입된 이미지 추적 초기화
      onSuccess?.();
    } catch (error) {
      console.error("Failed to submit post:", error);
    }
  };

  // YouTube 별도 붙여넣기 처리 제거
  // function onPaste(e: ClipboardEvent<HTMLInputElement>) {
  //   const text = e.clipboardData.getData("text/plain");
  //   const youtubeRegex =
  //     /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/g;
  //   const match = text.match(youtubeRegex);

  //   if (match && match[1]) {
  //     e.preventDefault();
  //     const videoId = match[1];
  //     editor?.commands.insertContent({
  //       type: "youtube",
  //       attrs: {
  //         src: `https://www.youtube.com/embed/${videoId}`,
  //       },
  //     });
  //   }
  // }

  // YouTube 수동 임베드 기능 제거
  // function handleYoutubeEmbed() {
  //   const url = prompt("YouTube URL을 입력하세요");

  //   if (url && editor) {
  //     const youtubeRegex =
  //       /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
  //     const match = url.match(youtubeRegex);

  //     if (match && match[1]) {
  //       const videoId = match[1];
  //       const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  //       editor.commands.insertContent({
  //         type: "youtube",
  //         attrs: {
  //           src: embedUrl,
  //         },
  //       });
  //     } else {
  //       alert("유효하지 않은 YouTube URL입니다.");
  //     }
  //   }
  // }

  const editorActiveStyle =
    "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground";

  if (!editor || !user) {
    return null;
  }

  return (
    <div className={cn(
      "flex flex-col",
      studio ? "gap-8 min-h-[calc(100vh-200px)]" : "gap-4"
    )}>
      {/* 제목 입력 (스튜디오 전용) */}
      {studio && (
        <div>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-5xl font-bold border-none outline-none focus:outline-none bg-transparent placeholder:text-muted-foreground/40 px-0"
          />
        </div>
      )}

      <div className={cn("flex flex-col", studio ? "flex-1" : "")}>
        <div 
          className={cn(
            "flex gap-3 relative transition-all duration-200",
            isDragOver && "bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* 드래그 오버 오버레이 */}
          {isDragOver && (
            <div className="absolute inset-0 bg-blue-50/90 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center z-10 pointer-events-none">
              <div className="text-center">
                <ImagesIcon className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-blue-700 font-medium">이미지를 여기에 드롭하세요</p>
                <p className="text-blue-500 text-sm">JPG, PNG, GIF, MP4 파일 지원</p>
              </div>
            </div>
          )}
          
          {/* 스튜디오가 아닐 때만 아바타 표시 */}
          {!studio && (
            <UserAvatar avatarUrl={user.avatarUrl} userId={user.id} size={40} />
          )}
          
          <div className="flex-1">
            <EditorContent
              editor={editor}
              className={cn(
                "prose prose-stone dark:prose-invert w-full max-w-full focus:outline-none",
                studio ? "prose-lg min-h-[400px] text-lg" : "min-h-[150px]"
              )}
            />
          </div>
        </div>

        {/* 스튜디오가 아닐 때만 하단 그리드 표시 */}
        {!studio && attachments.length > 0 && (
          <MediaReorderableGrid
            attachments={attachments}
            onReorder={setAttachments}
            onRemove={removeAttachment}
          />
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

        {/* 링크 미리보기 섹션 */}
        {linkPreviews.length > 0 && (
          <div className="mt-4 space-y-3">
            {linkPreviews.map((preview) => (
              <LinkPreviewComponent
                key={preview.id}
                url={preview.url}
                title={preview.title}
                description={preview.description}
                image={preview.image}
                onRemove={() => removeLinkPreview(preview.id)}
              />
            ))}
          </div>
        )}

        {/* 링크 미리보기 로딩 상태 */}
        {isLoadingPreview && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>링크 미리보기 생성 중...</span>
          </div>
        )}

        {/* URL 자동 숨김 안내 */}
        {linkPreviews.length > 0 && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✨ <strong>자동 처리:</strong> 링크 미리보기가 생성되었습니다. 게시 시 원본 URL은 자동으로 숨겨집니다.
            </p>
          </div>
        )}

        {/* 하단 고정 툴바 (스튜디오용) + 호버 효과 */}
        {studio ? (
          <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pointer-events-none">
            <div className="group pointer-events-auto">
              <div className="bg-card border shadow-lg rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-300 ease-in-out transform group-hover:-translate-y-2 group-hover:shadow-xl">
                {/* 볼드체 버튼 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("rounded-full h-9 w-9", editorActiveStyle)}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                  data-active={editor.isActive("bold")}
                  title="굵게"
                >
                  <Bold className="h-4 w-4" />
                </Button>

                {/* 이탈릭체 버튼 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("rounded-full h-9 w-9", editorActiveStyle)}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                  data-active={editor.isActive("italic")}
                  title="기울임꼴"
                >
                  <ItalicIcon className="h-4 w-4" />
                </Button>

                {/* 취소선 버튼 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("rounded-full h-9 w-9", editorActiveStyle)}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  disabled={!editor.can().chain().focus().toggleStrike().run()}
                  data-active={editor.isActive("strike")}
                  title="취소선"
                >
                  <StrikethroughIcon className="h-4 w-4" />
                </Button>

                {/* 하이라이트 버튼 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("rounded-full h-9 w-9", editorActiveStyle)}
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                  disabled={!editor.can().chain().focus().toggleHighlight().run()}
                  data-active={editor.isActive("highlight")}
                  title="하이라이트"
                >
                  <HighlighterIcon className="h-4 w-4" />
                </Button>

                {/* 코드 버튼 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("rounded-full h-9 w-9", editorActiveStyle)}
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  disabled={!editor.can().chain().focus().toggleCode().run()}
                  data-active={editor.isActive("code")}
                  title="코드"
                >
                  <CodeIcon className="h-4 w-4" />
                </Button>

                {/* 구분선 */}
                <div className="w-px h-6 bg-border mx-1" />

                {/* 사진 첨부 버튼 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9"
                  onClick={handleImageClick}
                  disabled={isUploading}
                  title="미디어"
                >
                  <ImagesIcon className="h-4 w-4" />
                </Button>

                {/* 구분선 */}
                <div className="w-px h-6 bg-border mx-1" />

                {/* 게시 버튼 */}
                <LoadingButton
                  onClick={handleSubmit}
                  loading={mutation.isPending || isUploading}
                  disabled={!editor.getText().trim() && attachments.length === 0}
                  className="rounded-full px-6 h-9"
                >
                  게시
                </LoadingButton>
              </div>
            </div>
          </div>
        ) : (
          /* 일반 툴바 (일반 포스트용) */
          <div className="mt-2 flex items-center gap-1 border-y p-2">
            {/* 볼드체 버튼 - 활성화 */}
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

            {/* 사진 첨부 버튼 - 활성화 */}
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

            {/* 이탈릭체 버튼 */}
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

            {/* 취소선 버튼 */}
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

            {/* 하이라이트 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full", editorActiveStyle)}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              disabled={!editor.can().chain().focus().toggleHighlight().run()}
              data-active={editor.isActive("highlight")}
              title="하이라이트"
            >
              <HighlighterIcon className="h-5 w-5" />
            </Button>

            {/* 코드 버튼 */}
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
          </div>
        )}

        {/* 파일 인풋 - 사진 첨부 기능 유지 */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              const files = Array.from(e.target.files);
              if (studio) {
                handleStudioImageUpload(files);
              } else {
                startUpload(files);
              }
              e.target.value = "";
            }
          }}
        />
        {!studio && (
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
        )}
      </div>
    </div>
  );
}