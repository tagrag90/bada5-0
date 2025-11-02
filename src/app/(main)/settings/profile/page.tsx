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
import { Camera, Plus, X, Search } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { allSkills } from "@/components/SkillBadge";
import SkillBadge from "@/components/SkillBadge";
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
  skills: string[];
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
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");

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
      setUserSkills(fullUser.skills || []);
    }
  }, [fullUser, form]);

  const handleAddSkill = (skillName: string) => {
    if (!userSkills.includes(skillName)) {
      setUserSkills([...userSkills, skillName]);
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setUserSkills(userSkills.filter(skill => skill !== skillName));
  };

  const filteredAvailableSkills = allSkills.filter(skill => 
    skill.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
    !userSkills.includes(skill)
  );

  async function onSubmitProfile(values: UpdateUserProfileValues) {
    if (!fullUser) return;

    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${fullUser.id}.webp`)
      : undefined;

    let mutationValues: Partial<UpdateUserProfileValues> = { ...values }; 

    if (mutationValues.username === fullUser.username) {
      delete mutationValues.username;
    }

    mutationValues.skills = userSkills;

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
            
            {/* 스킬 관리 섹션 */}
            <div className="space-y-4 pt-4 border-t">
              <Label>스킬 & 툴</Label>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">내 스킬 ({userSkills.length})</p>
                {userSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userSkills.map((skill) => (
                      <div key={skill} className="flex items-center gap-1">
                        <SkillBadge skillName={skill} size="sm" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 hover:bg-red-100"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">아직 추가된 스킬이 없습니다</p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">스킬 추가</p>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="스킬 검색..."
                    value={skillSearchTerm}
                    onChange={(e) => setSkillSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="max-h-32 overflow-y-auto border rounded-lg p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {filteredAvailableSkills.slice(0, 20).map((skill) => (
                      <Button
                        key={skill}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="justify-start text-xs h-8 px-2"
                        onClick={() => handleAddSkill(skill)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {skill}
                      </Button>
                    ))}
                  </div>
                  {filteredAvailableSkills.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      {skillSearchTerm ? "검색 결과가 없습니다" : "추가할 수 있는 스킬이 없습니다"}
                    </p>
                  )}
                </div>
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

