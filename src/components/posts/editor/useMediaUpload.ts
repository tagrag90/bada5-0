import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { getUserFriendlyMessage } from "@/lib/error-messages";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
  id?: string;
  url?: string;
  type?: string;
}

export default function useMediaUpload() {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>();

  const [isUploading, setIsUploading] = useState(false);

  // Vercel Blob으로 파일 업로드
  const uploadToBlob = async (file: File): Promise<{ url: string; mediaId: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  };

  // 이미지 압축 함수
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1920, // 최대 너비
        1920, // 최대 높이
        "WEBP", // 포맷
        85, // 품질
        0, // 회전
        (uri) => resolve(uri as File),
        "file"
      );
    });
  };

  async function handleStartUpload(files: File[]) {
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

    // 지원하지 않는 파일 형식 검증
    const unsupportedFiles = files.filter(file =>
      !file.type.startsWith('image/') && !file.type.startsWith('video/')
    );

    if (unsupportedFiles.length > 0) {
      toast({
        variant: "destructive",
        description: "이미지 또는 비디오 파일만 업로드할 수 있습니다.",
      });
      return;
    }

    // 비디오 파일 크기 검증 (압축 불가)
    const oversizedVideos = files.filter(file =>
      file.type.startsWith('video/') && file.size > 32 * 1024 * 1024
    );

    if (oversizedVideos.length > 0) {
      toast({
        variant: "destructive",
        description: "비디오 파일 크기가 너무 큽니다. 32MB 이하의 파일을 업로드해주세요.",
      });
      return;
    }

    setIsUploading(true);

    try {
      // 이미지 파일 자동 압축 처리
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (file.type.startsWith('image/')) {
            // 8MB 이상의 이미지는 자동 압축
            if (file.size > 8 * 1024 * 1024) {
              toast({
                description: `${file.name} 파일이 큽니다. 자동으로 압축 중...`,
              });
              return await compressImage(file);
            }
            // 2MB 이상의 이미지도 가벼운 압축 적용
            if (file.size > 2 * 1024 * 1024) {
              return await compressImage(file);
            }
          }
          return file;
        })
      );

      // 파일들을 임시 attachments에 추가
      const tempAttachments = processedFiles.map((file) => ({
        file,
        isUploading: true,
        id: crypto.randomUUID(),
      }));

      setAttachments((prev) => [...prev, ...tempAttachments]);

      // 각 파일을 순차적으로 업로드
      for (const tempAttachment of tempAttachments) {
        try {
          const result = await uploadToBlob(tempAttachment.file);

          // 업로드 성공 시 attachment 업데이트
          setAttachments((prev) =>
            prev.map((a) =>
              a.id === tempAttachment.id
                ? {
                    ...a,
                    url: result.url,
                    mediaId: result.mediaId,
                    type: tempAttachment.file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
                    isUploading: false,
                  }
                : a
            )
          );

          toast({
            description: `${tempAttachment.file.name} 업로드 완료!`,
          });

        } catch (error) {
          console.error('Upload error:', error);

          // 실패한 파일 제거
          setAttachments((prev) =>
            prev.filter((a) => a.id !== tempAttachment.id)
          );

          toast({
            variant: "destructive",
            description: `${tempAttachment.file.name} 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          });
        }
      }

    } catch (error) {
      toast({
        variant: "destructive",
        description: "이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const fileNameMatch = prev.find(a => a.file?.name === id);
      if (fileNameMatch) {
        return prev.filter(a => a.file?.name !== id);
      }
      
      return prev.filter(a => a.id !== id);
    });
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
    setAttachments,
  };
}
