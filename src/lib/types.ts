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

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
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
  include: ReturnType<typeof getPostDataInclude>;
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
    isPublic: true,
    isVerified: true,
    subscribersCount: true,
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
