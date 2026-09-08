export interface ClubMember {
  id: number;
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  /**
   * Whether the member has a profile photo. The photo itself is private:
   * fetch it as a blob from `GET /clubs/{clubId}/users/{userId}/avatar`
   * (see `MemberAvatarService.getMemberAvatarUrl`).
   */
  hasAvatar: boolean;
  roleId: number;
  teamId?: number;
  teamName?: string;
  status: 'AC' | 'P';
  createdAt: string;
}

export interface ClubMembersPage {
  items: ClubMember[];
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface UpdateClubMemberRequest {
  roleId: number;
  teamId?: number;
  status: 'AC' | 'P';
}

export interface AssignClubRoleRequest {
  roleId: number;
  teamId?: number;
}
