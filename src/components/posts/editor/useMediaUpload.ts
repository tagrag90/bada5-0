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
      const errorData = await response.json();
      
      // 파일 크기 초과 에러 처리
      if (errorData.error === 'File too large' && errorData.message) {
        throw new Error(errorData.message);
      }
      
      // 파일 타입 에러 처리
      if (errorData.error?.includes('Invalid file type')) {
        throw new Error('지원하지 않는 파일 형식입니다. 이미지 또는 비디오 파일만 업로드할 수 있습니다.');
      }
      
      // 일반 에러 처리
      throw new Error(errorData.message || errorData.error || '업로드에 실패했습니다. 다시 시도해주세요.');
    }

    return response.json();
  };

  // 이미지 압축 함수 (파일 크기에 따라 최적화된 설정 적용)
  const compressImage = (file: File, originalSize: number): Promise<File> => {
    return new Promise((resolve) => {
      // GIF 파일은 압축하지 않음 (애니메이션 유지)
      if (file.type === 'image/gif') {
        resolve(file);
        return;
      }

      // 파일 크기에 따른 압축 설정
      let maxWidth = 1920;
      let maxHeight = 1920;
      let quality = 85;

      if (originalSize > 5 * 1024 * 1024) {
        // 5MB 이상: 강한 압축
        maxWidth = 1600;
        maxHeight = 1600;
        quality = 75;
      } else if (originalSize > 2 * 1024 * 1024) {
        // 2MB~5MB: 중간 압축
        maxWidth = 1920;
        maxHeight = 1920;
        quality = 80;
      } else if (originalSize > 500 * 1024) {
        // 500KB~2MB: 가벼운 압축
        maxWidth = 1920;
        maxHeight = 1920;
        quality = 85;
      } else {
        // 500KB 이하: 최소 압축 (품질 유지)
        maxWidth = 1920;
        maxHeight = 1920;
        quality = 90;
      }

      Resizer.imageFileResizer(
        file,
        maxWidth,
        maxHeight,
        "WEBP", // 포맷
        quality,
        0, // 회전
        (uri) => {
          const compressedFile = uri as File;
          // 압축 후에도 원본보다 큰 경우 원본 반환
          if (compressedFile.size > originalSize) {
            resolve(file);
          } else {
            resolve(compressedFile);
          }
        },
        "file",
        maxWidth,
        maxHeight
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

    // 비디오 파일 크기 검증 (압축 불가, API 제한 8MB)
    const oversizedVideos = files.filter(file =>
      file.type.startsWith('video/') && file.size > 8 * 1024 * 1024
    );

    if (oversizedVideos.length > 0) {
      const oversizedFile = oversizedVideos[0];
      const fileSizeMB = (oversizedFile.size / (1024 * 1024)).toFixed(2);
      toast({
        variant: "destructive",
        description: `비디오 파일 크기가 너무 큽니다. (${fileSizeMB}MB / 최대 8MB) 더 작은 파일을 선택해주세요.`,
      });
      return;
    }

    // 이미지 파일 크기 검증 (압축 가능하지만 8MB 초과 시 경고)
    const oversizedImages = files.filter(file =>
      file.type.startsWith('image/') && file.size > 8 * 1024 * 1024
    );

    if (oversizedImages.length > 0) {
      const oversizedFile = oversizedImages[0];
      const fileSizeMB = (oversizedFile.size / (1024 * 1024)).toFixed(2);
      toast({
        variant: "destructive",
        description: `이미지 파일 크기가 큽니다. (${fileSizeMB}MB) 자동으로 압축 중...`,
      });
      // 경고 후 계속 진행 (압축 시도)
    }

    setIsUploading(true);

    try {
      // 모든 이미지 파일 자동 압축 처리
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (file.type.startsWith('image/')) {
            const originalSize = file.size;
            
            // GIF는 압축하지 않음
            if (file.type === 'image/gif') {
              return file;
            }

            // 모든 이미지에 자동 압축 적용 (500KB 이상)
            if (originalSize > 500 * 1024) {
              try {
                const compressedFile = await compressImage(file, originalSize);
                const compressedSize = compressedFile.size;
                const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
                
                // 압축 효과가 있는 경우 (10% 이상 감소)
                if (compressedSize < originalSize * 0.9) {
                  console.log(`✅ 압축 완료: ${file.name} (${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB, ${reduction}% 감소)`);
                }
                
                return compressedFile;
              } catch (error) {
                console.error('압축 실패, 원본 사용:', error);
                return file;
              }
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

          // 에러 메시지 개선
          let errorMessage = '알 수 없는 오류가 발생했습니다.';
          
          if (error instanceof Error) {
            const errorMsg = error.message.toLowerCase();
            
            // 파일 크기 초과 에러
            if (errorMsg.includes('크기') || errorMsg.includes('too large') || errorMsg.includes('max')) {
              errorMessage = error.message;
            }
            // 파일 타입 에러
            else if (errorMsg.includes('타입') || errorMsg.includes('type') || errorMsg.includes('형식')) {
              errorMessage = error.message;
            }
            // 네트워크 에러
            else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('연결')) {
              errorMessage = '인터넷 연결을 확인해주세요. 연결이 불안정할 수 있습니다.';
            }
            // 기타 에러
            else {
              errorMessage = `${tempAttachment.file.name} 업로드 실패: ${error.message}`;
            }
          }

          toast({
            variant: "destructive",
            description: errorMessage,
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
