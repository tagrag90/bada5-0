import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: requiredString.email("올바른 이메일 주소를 입력해주세요"),
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export const updatePostSchema = z.object({
  id: z.string(),
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export const updateUserProfileSchema = z.object({
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "사용자 이름은 영문, 숫자, - 또는 _ 만 포함할 수 있습니다.",
  ).min(3, "3자 이상이어야 합니다.").max(20, "20자 이하여야 합니다."),
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
  skills: z.array(z.string()).max(20, "최대 20개의 스킬까지 추가할 수 있습니다.").optional(),
  avatarUrl: z.string().url().optional(), // 아바타 URL 추가
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export const createStudioSchema = z.object({
  name: requiredString.min(1, "스튜디오 이름은 필수입니다").max(50, "50자 이하여야 합니다"),
  description: z.string().max(500, "500자 이하여야 합니다").optional(),
  avatarUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  socialLinks: z.array(z.string().url()).optional(),
  isPublic: z.boolean().optional(),
});

export const updateStudioSchema = z.object({
  name: requiredString.min(1, "스튜디오 이름은 필수입니다").max(50, "50자 이하여야 합니다").optional(),
  description: z.string().max(500, "500자 이하여야 합니다").optional(),
  avatarUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  socialLinks: z.array(z.string().url()).optional(),
  isPublic: z.boolean().optional(),
});

export type CreateStudioValues = z.infer<typeof createStudioSchema>;
export type UpdateStudioValues = z.infer<typeof updateStudioSchema>;

export const createCommentSchema = z.object({
  content: requiredString,
});
