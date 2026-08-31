import { AppStatus } from './app-status.model';

export interface NewsPostImage {
  id?: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface NewsPost {
  id: number;
  clubId: number;
  authorUserId: number;
  authorName: string;
  title: string;
  body: string;
  externalLinkUrl?: string | null;
  externalLinkLabel?: string | null;
  linkedFormId?: number | null;
  status: AppStatus;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  images: NewsPostImage[];
}

export interface CreateNewsPostRequest {
  title: string;
  body: string;
  externalLinkUrl?: string | null;
  externalLinkLabel?: string | null;
  linkedFormId?: number | null;
  publishNow: boolean;
  images: NewsPostImage[];
}

export interface UpdateNewsPostRequest {
  title: string;
  body: string;
  externalLinkUrl?: string | null;
  externalLinkLabel?: string | null;
  linkedFormId?: number | null;
  images: NewsPostImage[];
}

export interface NewsPostsPage {
  items: NewsPost[];
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface UploadNewsImageResponse {
  url: string;
}

/** Trimmed shape for the "related post" widget — no body, matches the backend's summary endpoint. */
export interface NewsPostSummary {
  id: number;
  title: string;
  publishedAt?: string | null;
  createdAt: string;
  images: NewsPostImage[];
}

export interface NewsComment {
  id: number;
  author: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  body: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  replies?: NewsComment[];
}

export interface News {
  id: number;
  title: string;
  body: string;
  imageUrl?: string;
  author: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  category: NewsCategory;
  publishedAt: Date;
  createdAt: Date;
  updatedAt?: Date;
  upvotes: number;
  downvotes: number;
  userVote?: VoteType | null;
  comments: NewsComment[];
  commentCount: number;
}

export enum NewsCategory {
  General = 'general',
  Match = 'match',
  Training = 'training',
  Event = 'event',
  Announcement = 'announcement',
  Achievement = 'achievement'
}

export enum TimeFilter {
  Today = 'today',
  Week = 'week',
  Month = 'month',
  Year = 'year',
  All = 'all'
}

export type VoteType = 'up' | 'down';
