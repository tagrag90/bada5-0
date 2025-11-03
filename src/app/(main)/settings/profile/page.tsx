"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import CropImageDialog from "@/components/CropImageDialog";
import LoadingButton from "@/components/LoadingButton";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Plus, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import StudioBadge from "@/components/StudioBadge";
import { StudioData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import Resizer from "react-image-file-resizer";
import { useUpdateProfileMutation } from "@/app/(main)/users/[username]/mutations";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useQuery } from "@tanstack/react-query";

interface FullUserData {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;
  skills: string[]; // 기존 필드, displayStudios로 재활용 예정
}

export default function ProfileSettingsPage() {
  const { user } = useSession();
  const router = useRouter();
  const { setSidebar } = useSidebar();

  // 전체 사용자 정보 가져오기 (bio, skills 포함)
  const { data: fullUser } = useQuery<FullUserData>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user,
  });

  // 모든 hooks는 최상위 레벨에서 호출해야 함
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
      skills: [],
    },
  });

  const mutation = useUpdateProfileMutation();

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const [selectedStudioIds, setSelectedStudioIds] = useState<string[]>([]);
  
  // 멤버 이상 권한이 있는 스튜디오 목록 조회
  const { data: availableStudios } = useQuery<StudioData[]>({
    queryKey: ["studios"],
    queryFn: async () => {
      const res = await fetch("/api/studios");
      if (!res.ok) throw new Error("Failed to fetch studios");
      return res.json();
    },
    enabled: !!user,
  });

  // 설정 페이지 사이드바 활성화
  useEffect(() => {
    setSidebar('discord', { activeTab: 'profile' });
  }, [setSidebar]);

  // user가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // fullUser 데이터가 로드되면 폼 업데이트
  useEffect(() => {
    if (fullUser) {
      form.reset({
        username: fullUser.username,
        displayName: fullUser.displayName,
        bio: fullUser.bio || "",
        skills: fullUser.skills || [],
      });
      // skills 필드를 displayStudios로 재활용 (스튜디오 ID 배열)
      setSelectedStudioIds(fullUser.skills || []);
    }
  }, [fullUser, form]);

  const handleToggleStudio = (studioId: string) => {
    if (selectedStudioIds.includes(studioId)) {
      setSelectedStudioIds(selectedStudioIds.filter(id => id !== studioId));
    } else {
      setSelectedStudioIds([...selectedStudioIds, studioId]);
    }
  };

  async function onSubmitProfile(values: UpdateUserProfileValues) {
    if (!fullUser) return;

    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${fullUser.id}.webp`)
      : undefined;

    let mutationValues: Partial<UpdateUserProfileValues> = { ...values }; 

    if (mutationValues.username === fullUser.username) {
      delete mutationValues.username;
    }

    // displayStudios를 skills 필드에 저장 (임시)
    mutationValues.skills = selectedStudioIds;

    mutation.mutate(
      {
        values: mutationValues,
        avatar: newAvatarFile,
      },
      {
        onSuccess: () => {
          setCroppedAvatar(null);
        },
      },
    );
  }

  if (!user || !fullUser) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">프로필 편집</h2>

        <div className="space-y-1.5 mb-6">
          <Label>Avatar</Label>
          <AvatarInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : fullUser.avatarUrl || avatarPlaceholder
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username (@아이디)</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* 스튜디오 뱃지 관리 섹션 */}
            <div className="space-y-4 pt-4 border-t">
              <Label>표시할 스튜디오</Label>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">선택된 스튜디오 ({selectedStudioIds.length})</p>
                {selectedStudioIds.length > 0 && availableStudios ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedStudioIds.map((studioId) => {
                      const studio = availableStudios.find(s => s.id === studioId);
                      return studio ? (
                        <div key={studioId} className="flex items-center gap-1">
                          <StudioBadge
                            studioId={studio.id}
                            studioName={studio.name}
                            studioAvatarUrl={studio.avatarUrl}
                            size="sm"
                            showLink={false}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 hover:bg-red-100"
                            onClick={() => handleToggleStudio(studioId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">선택된 스튜디오가 없습니다</p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">스튜디오 추가</p>
                {availableStudios && availableStudios.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
                    <div className="flex flex-wrap gap-2">
                      {availableStudios
                        .filter(s => !selectedStudioIds.includes(s.id))
                        .map((studio) => (
                          <button
                            key={studio.id}
                            type="button"
                            onClick={() => handleToggleStudio(studio.id)}
                            className="transition-all"
                          >
                            <StudioBadge
                              studioId={studio.id}
                              studioName={studio.name}
                              studioAvatarUrl={studio.avatarUrl}
                              size="sm"
                              showLink={false}
                            />
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">멤버 이상 권한을 가진 스튜디오가 없습니다</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <LoadingButton type="submit" loading={mutation.isPending}>
                저장
              </LoadingButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
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
          alt="Avatar preview"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera size={24} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}

