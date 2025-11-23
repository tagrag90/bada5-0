import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    skills: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
        following: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

// 최적화: include 대신 select 사용하여 필요한 필드만 가져오기
export function getPostDataSelect(loggedInUserId: string) {
  return {
    id: true,
    title: true,
    content: true,
    createdAt: true,
    userId: true,
    studioId: true,
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    studio: {
      select: {
        id: true,
        name: true,
        slug: true,
        avatarUrl: true,
      },
    },
    attachments: {
      select: {
        id: true,
        url: true,
        type: true,
        createdAt: true,
        postId: true,
      },
    },
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostSelect;
}

// 하위 호환성을 위한 별칭 (점진적 마이그레이션)
export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    studio: {
      select: {
        id: true,
        name: true,
        slug: true,
        avatarUrl: true,
      },
    },
    attachments: {
      select: {
        id: true,
        url: true,
        type: true,
        createdAt: true,
        postId: true,
      },
    },
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  select: ReturnType<typeof getPostDataSelect>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

export interface NotificationCountInfo {
  unreadCount: number;
}

export interface MessageCountInfo {
  unreadCount: number;
}

export interface FollowingInfo {
  following: number;
}

// ============= Studio Types =============

export function getStudioDataSelect(loggedInUserId: string) {
  return {
    id: true,
    name: true,
    slug: true,
    description: true,
    type: true,
    avatarUrl: true,
    bannerUrl: true,
    socialLinks: true,
    isPublic: true,
    isVerified: true,
    subscribersCount: true,
    order: true,
    createdAt: true,
    updatedAt: true,
    ownerId: true,
    owner: {
      select: getUserDataSelect(loggedInUserId),
    },
    members: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        role: true,
      },
    },
    subscriptions: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        members: true,
        subscriptions: true,
        events: true,
      },
    },
  } satisfies Prisma.StudioSelect;
}

export type StudioData = Prisma.StudioGetPayload<{
  select: ReturnType<typeof getStudioDataSelect>;
}>;

export interface StudiosPage {
  studios: StudioData[];
  nextCursor: string | null;
}

// ============= Event Types =============

export function getEventDataInclude(loggedInUserId: string) {
  return {
    studio: {
      select: getStudioDataSelect(loggedInUserId),
    },
    ticketTypes: {
      select: {
        id: true,
        name: true,
        description: true,
        totalCount: true,
        issuedCount: true,
        price: true,
        color: true,
      },
    },
    _count: {
      select: {
        tickets: true,
      },
    },
  } satisfies Prisma.EventInclude;
}

export type EventData = Prisma.EventGetPayload<{
  include: ReturnType<typeof getEventDataInclude>;
}>;

export interface EventsPage {
  events: EventData[];
  nextCursor: string | null;
}

// ============= Ticket Types =============

export function getTicketDataInclude(loggedInUserId: string) {
  return {
    event: {
      include: {
        studio: true,
        ticketTypes: true,
      },
    },
    type: true,
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.TicketInclude;
}

export type TicketData = Prisma.TicketGetPayload<{
  include: ReturnType<typeof getTicketDataInclude>;
}>;

export interface TicketsPage {
  tickets: TicketData[];
  nextCursor: string | null;
}
