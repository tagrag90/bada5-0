"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: Partial<UpdateUserProfileValues>) {
  const partialSchema = updateUserProfileSchema.partial();
  const validatedValues = partialSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  if (validatedValues.username && validatedValues.username !== user.username) {
    const existingUser = await prisma.user.findUnique({
      where: { username: validatedValues.username },
    });

    if (existingUser) {
      throw new Error("Username already taken.");
    }
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: validatedValues,
      select: getUserDataSelect(user.id),
    });

    // Stream User 업데이트
    const streamUpdateData: { name?: string; image?: string } = {};
    if (validatedValues.displayName) {
      streamUpdateData.name = validatedValues.displayName;
    }
    if (validatedValues.avatarUrl) {
      streamUpdateData.image = validatedValues.avatarUrl;
    }

    if (Object.keys(streamUpdateData).length > 0) {
      await streamServerClient.partialUpdateUser({
        id: user.id,
        set: streamUpdateData,
      });
    }
    return updatedUser;
  });

  console.log('✅ updateUserProfile 완료:', { id: updatedUser.id, avatarUrl: updatedUser.avatarUrl });

  return updatedUser;
}
