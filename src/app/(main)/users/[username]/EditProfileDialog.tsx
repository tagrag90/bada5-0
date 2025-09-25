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
import { Camera, Plus, X, Search } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { allSkills, SkillList } from "@/components/SkillBadge";
import SkillBadge from "@/components/SkillBadge";
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
  const [userSkills, setUserSkills] = useState<string[]>(user.skills || []);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");

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

    // 스킬 데이터 추가
    mutationValues.skills = userSkills;

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
            
            {/* 스킬 관리 섹션 */}
            <div className="space-y-4 pt-4 border-t">
              <Label>스킬 & 툴</Label>
              
              {/* 현재 스킬들 */}
              <div>
                <p className="text-sm text-gray-600 mb-2">내 스킬 ({userSkills.length})</p>
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
                  <p className="text-sm text-gray-500">아직 추가된 스킬이 없습니다</p>
                )}
              </div>

              {/* 스킬 추가 */}
              <div>
                <p className="text-sm text-gray-600 mb-2">스킬 추가</p>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                    <p className="text-xs text-gray-500 text-center py-2">
                      {skillSearchTerm ? "검색 결과가 없습니다" : "추가할 수 있는 스킬이 없습니다"}
                    </p>
                  )}
                </div>
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
