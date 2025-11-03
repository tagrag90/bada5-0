import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import CropImageDialog from "@/components/CropImageDialog";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserData } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Plus, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import StudioBadge from "@/components/StudioBadge";
import { StudioData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Resizer from "react-image-file-resizer";
import { useUpdateProfileMutation } from "./mutations";

interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      username: user.username,
      displayName: user.displayName,
      bio: user.bio || "",
      skills: user.skills || [],
    },
  });

  const mutation = useUpdateProfileMutation();

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const [selectedStudioIds, setSelectedStudioIds] = useState<string[]>(user.skills || []);
  
  // 멤버 이상 권한이 있는 스튜디오 목록 조회
  const { data: availableStudios } = useQuery<StudioData[]>({
    queryKey: ["studios"],
    queryFn: async () => {
      const res = await fetch("/api/studios");
      if (!res.ok) throw new Error("Failed to fetch studios");
      return res.json();
    },
    enabled: open,
  });

  const handleToggleStudio = (studioId: string) => {
    if (selectedStudioIds.includes(studioId)) {
      setSelectedStudioIds(selectedStudioIds.filter(id => id !== studioId));
    } else {
      setSelectedStudioIds([...selectedStudioIds, studioId]);
    }
  };

  async function onSubmit(values: UpdateUserProfileValues) {
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;

    // Prepare values for mutation
    let mutationValues: Partial<UpdateUserProfileValues> = { ...values }; 

    // If username hasn't changed, remove it from the values to avoid unnecessary checks/updates
    if (mutationValues.username === user.username) {
      delete mutationValues.username;
    }

    // displayStudios를 skills 필드에 저장 (임시)
    mutationValues.skills = selectedStudioIds;

    mutation.mutate(
      {
        values: mutationValues, // Pass the potentially modified values
        avatar: newAvatarFile,
      },
      {
        onSuccess: () => {
          setCroppedAvatar(null);
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white p-6" style={{ borderRadius: '1.5rem' }}>
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <AvatarInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.avatarUrl || avatarPlaceholder
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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

            <DialogFooter>
              <LoadingButton type="submit" loading={mutation.isPending}>
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
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
