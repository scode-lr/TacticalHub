import { Club } from '../models';

export interface TeamResponse {
  team: Club;
}

export interface TeamsListResponse {
  teams: Club[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface JoinTeamResponse {
  success: boolean;
  message: string;
  requestId: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface TeamMembersResponse {
  members: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    role: string;
    joinedAt: Date;
  }>;
  total: number;
}
