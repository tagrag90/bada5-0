"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import Image from "next/image";
import Resizer from "react-image-file-resizer";
import CropImageDialog from "@/components/CropImageDialog";
import { useToast } from "@/components/ui/use-toast";
import { validateRequest } from "@/auth";

export default function StudioSettingsPage() {
  const params = useParams<{ studioId: string }>();
  const router = useRouter();
  const studioId = params.studioId;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const [croppedBanner, setCroppedBanner] = useState<Blob | null>(null);
  const [imageToCrop, setImageToCrop] = useState<{ file: File; type: "avatar" | "banner" }>();

  // 스튜디오 데이터 조회
  const { data: studio, isLoading } = useQuery({
    queryKey: ["studio", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}`);
      if (!res.ok) throw new Error("Failed to fetch studio");
      return res.json();
    },
    enabled: !!studioId,
  });

  // 스튜디오 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (studio) {
      setName(studio.name);
      setDescription(studio.description || "");
      setIsPublic(studio.isPublic);
      setSocialLinks(studio.socialLinks || []);
    }
  }, [studio]);

  // 현재 로그인한 유저 가져오기
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  // 권한 확인 (소유자 또는 ADMIN만 접근 가능)
  const { data: membershipStatus } = useQuery({
    queryKey: ["studio-membership", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}/subscription-status`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!studioId,
  });

  const isOwner = membershipStatus?.isOwner === true || (currentUser && studio && studio.ownerId === currentUser.id);
  const isAdmin = isOwner || membershipStatus?.memberRole === "ADMIN";

  // 권한 없으면 리다이렉트
  useEffect(() => {
    if (studio && !isAdmin) {
      toast({
        title: "권한 없음",
        description: "스튜디오 설정은 관리자만 접근할 수 있습니다.",
        variant: "destructive",
      });
      router.push(`/studios/${studioId}`);
    }
  }, [studio, isAdmin, router, studioId, toast]);

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

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      let finalAvatarUrl = data.avatarUrl;
      let finalBannerUrl = data.bannerUrl;

      if (croppedAvatar) {
        const avatarFile = new File([croppedAvatar], `studio_avatar_${studioId}.webp`);
        const uploadResult = await uploadToBlob(avatarFile, 'studio-avatar');
        if (uploadResult?.url) {
          finalAvatarUrl = uploadResult.url;
        }
      }

      if (croppedBanner) {
        const bannerFile = new File([croppedBanner], `studio_banner_${studioId}.webp`);
        const uploadResult = await uploadToBlob(bannerFile, 'studio-banner');
        if (uploadResult?.url) {
          finalBannerUrl = uploadResult.url;
        }
      }

      const updateData = {
        ...data,
        ...(finalAvatarUrl !== data.avatarUrl && { avatarUrl: finalAvatarUrl }),
        ...(finalBannerUrl !== data.bannerUrl && { bannerUrl: finalBannerUrl }),
      };

      const res = await fetch(`/api/studios/${studioId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update studio");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio", studioId] });
      queryClient.invalidateQueries({ queryKey: ["studios"] });
      queryClient.invalidateQueries({ queryKey: ["studio-membership", studioId] });
      queryClient.invalidateQueries({ queryKey: ["studio-members", studioId] });

      setCroppedAvatar(null);
      setCroppedBanner(null);
      
      toast({
        title: "설정 저장 완료",
        description: "스튜디오 설정이 업데이트되었습니다.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "설정 저장 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      name,
      description,
      isPublic,
      socialLinks,
      avatarUrl: studio?.avatarUrl,
      bannerUrl: studio?.bannerUrl,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!studio || !isAdmin) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">기본 설정</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex justify-end pt-4">
            <LoadingButton type="submit" loading={updateMutation.isPending}>
              저장
            </LoadingButton>
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
      </Card>
    </div>
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

