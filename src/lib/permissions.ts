import { StudioRole } from "@prisma/client";
import prisma from "./prisma";

/**
 * Studio 소유자인지 확인
 */
export async function requireStudioOwner(userId: string, studioId: string) {
  const studio = await prisma.studio.findUnique({
    where: { id: studioId },
  });

  if (!studio) {
    throw new Error("Studio를 찾을 수 없습니다");
  }

  if (studio.ownerId !== userId) {
    throw new Error("Studio 소유자만 가능합니다");
  }

  return studio;
}

/**
 * Studio 멤버인지 확인 (최소 역할 요구)
 */
export async function requireStudioMember(
  userId: string,
  studioId: string,
  minRole: StudioRole = "MEMBER"
) {
  const member = await prisma.studioMember.findFirst({
    where: {
      studioId,
      userId,
      role: { in: getRolesAboveOrEqual(minRole) },
    },
    include: {
      studio: true,
    },
  });

  if (!member) {
    throw new Error("접근 권한이 없습니다");
  }

  return member;
}

/**
 * Studio 접근 권한 확인 (소유자 또는 멤버)
 */
export async function checkStudioAccess(userId: string, studioId: string) {
  const studio = await prisma.studio.findUnique({
    where: { id: studioId },
    include: {
      members: {
        where: { userId },
      },
    },
  });

  if (!studio) {
    return null;
  }

  const isOwner = studio.ownerId === userId;
  const isMember = studio.members.length > 0;

  if (!isOwner && !isMember) {
    return null;
  }

  return {
    studio,
    isOwner,
    isMember,
    role: isMember ? studio.members[0].role : "OWNER",
  };
}

/**
 * Studio 권한 레벨 가져오기
 */
export async function getStudioPermission(userId: string, studioId: string) {
  const studio = await prisma.studio.findUnique({
    where: { id: studioId },
  });

  if (!studio) {
    return null;
  }

  // 소유자인 경우
  if (studio.ownerId === userId) {
    return {
      canManage: true,
      canModerate: true,
      canPost: true,
      role: "OWNER" as StudioRole,
    };
  }

  // 멤버인 경우
  const member = await prisma.studioMember.findFirst({
    where: {
      studioId,
      userId,
    },
  });

  if (!member) {
    return null;
  }

  return {
    canManage: member.role === "ADMIN",
    canModerate: ["ADMIN", "MODERATOR"].includes(member.role),
    canPost: true,
    role: member.role,
  };
}

/**
 * 특정 역할 이상의 모든 역할 반환
 */
function getRolesAboveOrEqual(role: StudioRole): StudioRole[] {
  const hierarchy: StudioRole[] = ["MEMBER", "MODERATOR", "ADMIN", "OWNER"];
  const index = hierarchy.indexOf(role);
  return hierarchy.slice(index);
}

/**
 * Event가 특정 Studio에 속하는지 확인
 */
export async function verifyEventOwnership(
  userId: string,
  eventId: string,
  minRole: StudioRole = "ADMIN"
) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      studio: true,
    },
  });

  if (!event) {
    throw new Error("이벤트를 찾을 수 없습니다");
  }

  // 소유자 확인
  if (event.studio.ownerId === userId) {
    return { event, studio: event.studio };
  }

  // 멤버 권한 확인
  const member = await prisma.studioMember.findFirst({
    where: {
      studioId: event.studioId,
      userId,
      role: { in: getRolesAboveOrEqual(minRole) },
    },
  });

  if (!member) {
    throw new Error("이벤트를 관리할 권한이 없습니다");
  }

  return { event, studio: event.studio, member };
}

/**
 * 유저가 구독 중인지 확인
 */
export async function checkSubscription(userId: string, studioId: string) {
  const subscription = await prisma.studioSubscription.findUnique({
    where: {
      studioId_userId: {
        studioId,
        userId,
      },
    },
  });

  return !!subscription;
}

