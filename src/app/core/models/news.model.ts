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
