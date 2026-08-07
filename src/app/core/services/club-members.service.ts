import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { AssignClubRoleRequest, ClubMember, ClubMembersPage, UpdateClubMemberRequest } from '@core/models/club-member.model';
import { ApiResponse, ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ClubMembersService {
  private readonly apiService = inject(ApiService);

  getByClub(clubId: number, limit = 20, offset = 0, search = ''): Promise<ClubMembersPage> {
    const params: Record<string, string> = {
      limit: String(limit),
      offset: String(offset)
    };
    if (search.trim()) params['search'] = search.trim();

    return firstValueFrom(this.apiService
      .get<ClubMember[] | ClubMembersPage | ApiResponse<ClubMember[] | ClubMembersPage>>(
        `/roles/clubs/${clubId}/members`, { params })
      .pipe(map(response => this.normalizePage(this.unwrap(response), limit, offset))));
  }

  assignRole(
    clubId: number,
    userId: number,
    request: AssignClubRoleRequest
  ): Promise<ClubMember> {
    return firstValueFrom(this.apiService
      .post<ClubMember | ApiResponse<ClubMember>>(`/roles/clubs/${clubId}/members/${userId}/roles`, request)
      .pipe(map(response => this.unwrap(response))));
  }

  update(clubId: number, relationId: number, request: UpdateClubMemberRequest): Promise<ClubMember> {
    return firstValueFrom(this.apiService
      .patch<ClubMember | ApiResponse<ClubMember>>(`/roles/clubs/${clubId}/members/${relationId}`, request)
      .pipe(map(response => this.unwrap(response))));
  }

  remove(clubId: number, relationId: number): Promise<void> {
    return firstValueFrom(this.apiService
      .delete<ApiResponse<ClubMember>>(`/roles/clubs/${clubId}/members/${relationId}`)
      .pipe(map(() => undefined)));
  }

  deactivateUser(clubId: number, userId: number): Promise<void> {
    return firstValueFrom(this.apiService
      .delete<ApiResponse<unknown>>(`/roles/clubs/${clubId}/members/users/${userId}`)
      .pipe(map(() => undefined)));
  }

  private unwrap<T>(response: T | ApiResponse<T>): T {
    if (response !== null && typeof response === 'object' && 'data' in response) {
      return (response as ApiResponse<T>).data!;
    }
    return response as T;
  }

  private normalizePage(
    response: ClubMember[] | ClubMembersPage,
    limit: number,
    offset: number
  ): ClubMembersPage {
    if (Array.isArray(response)) {
      return {
        items: response,
        totalCount: new Set(response.map(member => member.userId)).size,
        limit,
        offset,
        hasMore: false
      };
    }

    return {
      items: response?.items ?? [],
      totalCount: response?.totalCount ?? 0,
      limit: response?.limit ?? limit,
      offset: response?.offset ?? offset,
      hasMore: response?.hasMore ?? false
    };
  }
}
