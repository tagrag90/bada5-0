"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
// UploadThing 제거 - Vercel Blob 사용
import Image from "next/image";
import Resizer from "react-image-file-resizer";
import CropImageDialog from "@/components/CropImageDialog";

interface EditStudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studio: any;
}

export default function EditStudioDialog({
  open,
  onOpenChange,
  studio,
}: EditStudioDialogProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(studio.name);
  const [description, setDescription] = useState(studio.description || "");
  const [isPublic, setIsPublic] = useState(studio.isPublic);
  const [socialLinks, setSocialLinks] = useState<string[]>(studio.socialLinks || []);
  const [newLink, setNewLink] = useState("");
  
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const [croppedBanner, setCroppedBanner] = useState<Blob | null>(null);
  const [imageToCrop, setImageToCrop] = useState<{ file: File; type: "avatar" | "banner" }>();

  // Vercel Blob 업로드 함수들
  const uploadToBlob = async (file: File, type: 'studio-avatar' | 'studio-banner') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

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

  useEffect(() => {
    if (studio) {
      setName(studio.name);
      setDescription(studio.description || "");
      setIsPublic(studio.isPublic);
      setSocialLinks(studio.socialLinks || []);
    }
  }, [studio]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      // 이미지 업로드 먼저 수행
      let finalAvatarUrl = data.avatarUrl;
      let finalBannerUrl = data.bannerUrl;

      if (croppedAvatar) {
        console.log("Uploading avatar...");
        console.log("Cropped avatar size:", croppedAvatar.size);
        const avatarFile = new File([croppedAvatar], `studio_avatar_${studio.id}.webp`);
        console.log("Avatar file created:", avatarFile.name, avatarFile.size);
        const uploadResult = await uploadToBlob(avatarFile, 'studio-avatar');
        console.log("Upload result:", uploadResult);
        if (uploadResult?.url) {
          finalAvatarUrl = uploadResult.url;
          console.log("Avatar uploaded successfully:", finalAvatarUrl);
        } else {
          console.error("Avatar upload failed:", uploadResult);
        }
      }

      if (croppedBanner) {
        console.log("Uploading banner...");
        const bannerFile = new File([croppedBanner], `studio_banner_${studio.id}.webp`);
        const uploadResult = await uploadToBlob(bannerFile, 'studio-banner');
        if (uploadResult?.url) {
          finalBannerUrl = uploadResult.url;
          console.log("Banner uploaded:", finalBannerUrl);
        } else {
          console.error("Banner upload failed:", uploadResult);
        }
      }

      // API 호출 시 이미지 URL 포함
      const updateData = {
        ...data,
        ...(finalAvatarUrl !== data.avatarUrl && { avatarUrl: finalAvatarUrl }),
        ...(finalBannerUrl !== data.bannerUrl && { bannerUrl: finalBannerUrl }),
      };

      console.log("Sending update data:", updateData);

      const res = await fetch(`/api/studios/${studio.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update studio");
      }
      const result = await res.json();
      console.log("Update result:", result);
      return result;
    },
    onSuccess: () => {
      // 모든 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["studio", studio.id] });
      queryClient.invalidateQueries({ queryKey: ["studios"] });
      queryClient.invalidateQueries({ queryKey: ["studio-membership", studio.id] });
      queryClient.invalidateQueries({ queryKey: ["studio-members", studio.id] });

      setCroppedAvatar(null);
      setCroppedBanner(null);
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      name,
      description,
      isPublic,
      socialLinks,
      avatarUrl: studio.avatarUrl, // 현재 avatarUrl을 기본값으로 전달
      bannerUrl: studio.bannerUrl, // 현재 bannerUrl을 기본값으로 전달
    });
  };

  const addLink = () => {
    if (newLink.trim() && !socialLinks.includes(newLink.trim())) {
      setSocialLinks([...socialLinks, newLink.trim()]);
      setNewLink("");
    }
  };

  const removeLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleImageSelect = (file: File | undefined, type: "avatar" | "banner") => {
    if (!file) return;

    Resizer.imageFileResizer(
      file,
      type === "avatar" ? 512 : 1200,
      type === "avatar" ? 512 : 630,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop({ file: uri as File, type }),
      "file",
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle>스튜디오 설정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* 프로필 사진 */}
          <div className="space-y-2">
            <Label>프로필 사진</Label>
            <AvatarInput
              src={
                croppedAvatar
                  ? URL.createObjectURL(croppedAvatar)
                  : studio.avatarUrl || "/logo-bada.png"
              }
              onImageSelect={(file) => handleImageSelect(file, "avatar")}
            />
          </div>

          {/* 배너 이미지 */}
          <div className="space-y-2">
            <Label>배너 이미지</Label>
            <BannerInput
              src={
                croppedBanner
                  ? URL.createObjectURL(croppedBanner)
                  : studio.bannerUrl || "/banner.png"
              }
              onImageSelect={(file) => handleImageSelect(file, "banner")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">스튜디오 이름</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>소셜 링크</Label>
            <div className="space-y-2">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={link} disabled className="flex-1 text-sm" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLink(index)}
                    className="text-red-500"
                  >
                    삭제
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="https://instagram.com/..."
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={addLink}>
                  추가
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              URL을 입력하면 자동으로 플랫폼 아이콘이 표시됩니다
            </p>
          </div>

          <div className="space-y-2">
            <Label>공개 설정</Label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="cursor-pointer"
              />
              <label htmlFor="isPublic" className="text-sm cursor-pointer">
                스튜디오를 공개합니다
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              비공개 시 멤버만 접근 가능합니다
            </p>
          </div>

          {updateMutation.error && (
            <p className="text-sm text-red-500">
              {(updateMutation.error as Error).message}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1"
            >
              {updateMutation.isPending ? "저장 중..." : "저장하기"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
          </div>
        </form>

        {/* 이미지 크롭 다이얼로그 */}
        {imageToCrop && (
          <CropImageDialog
            src={URL.createObjectURL(imageToCrop.file)}
            cropAspectRatio={imageToCrop.type === "avatar" ? 1 : 21 / 9}
            onCropped={(blob) => {
              if (imageToCrop.type === "avatar") {
                setCroppedAvatar(blob);
              } else {
                setCroppedBanner(blob);
              }
              setImageToCrop(undefined);
            }}
            onClose={() => setImageToCrop(undefined)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// 프로필 사진 입력
function AvatarInput({
  src,
  onImageSelect,
}: {
  src: string;
  onImageSelect: (file: File | undefined) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelect(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <Image
          src={src}
          alt="Studio avatar"
          width={150}
          height={150}
          className="size-32 rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25 text-xs">
          사진
        </span>
      </button>
    </>
  );
}

// 배너 이미지 입력
function BannerInput({
  src,
  onImageSelect,
}: {
  src: string;
  onImageSelect: (file: File | undefined) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelect(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block w-full"
      >
        <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden">
          <Image
            src={src}
            alt="Studio banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-colors duration-200 group-hover:bg-opacity-25 text-white text-sm">
            배너
          </div>
        </div>
      </button>
    </>
  );
}

