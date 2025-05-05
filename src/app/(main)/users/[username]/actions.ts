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

    if (validatedValues.displayName) {
      await streamServerClient.partialUpdateUser({
        id: user.id,
        set: {
          name: validatedValues.displayName,
        },
      });
    }
    return updatedUser;
  });

  return updatedUser;
}
