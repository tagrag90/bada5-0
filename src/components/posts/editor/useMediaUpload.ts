import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState, useEffect } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
  id?: string;
  url: string;
  type?: string;
}

interface UseMediaUploadProps {
  initialAttachments?: Array<{ id: string; url: string; type?: string }>;
}

export default function useMediaUpload({ initialAttachments = [] }: UseMediaUploadProps = {}) {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // 초기 첨부파일 설정
  useEffect(() => {
    if (initialAttachments.length > 0) {
      // File 객체가 필요하므로 더미 파일 생성
      const initialAtts = initialAttachments.map(att => ({
        file: new File([], 'placeholder.jpg', { type: 'image/jpeg' }),
        url: att.url,
        mediaId: att.id,
        isUploading: false,
        type: att.type || 'IMAGE',
      }));
      
      setAttachments(initialAtts);
    }
  }, [initialAttachments]);

  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          },
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ 
          file, 
          isUploading: true, 
          url: URL.createObjectURL(file) 
        })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);

          if (!uploadResult) return a;

          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            url: uploadResult.url,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        description: e.message,
      });
    },
  });

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      handleStartUpload(files);
      e.target.value = '';
    }
  }

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "현재 업로드가 완료될 때까지 기다려 주세요.",
      });
      return;
    }

    if (attachments.length + files.length > 4) {
      toast({
        variant: "destructive",
        description: "게시물당 최대 4개의 첨부 파일을 업로드할 수 있습니다.",
      });
      return;
    }

    startUpload(files);
  }

  function removeAttachment(idx: number) {
    setAttachments(prev => {
      const newAttachments = [...prev];
      newAttachments.splice(idx, 1);
      return newAttachments;
    });
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    handleUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
    setAttachments,
  };
}
