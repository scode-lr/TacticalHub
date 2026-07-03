import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import {
  ContactMessageDetail,
  ContactMessageGlobalStatus,
  ContactMessageRecipientStatus,
  ContactMessagesPage,
  CreateContactMessage
} from '@core/models/contact-message.model';

@Injectable({ providedIn: 'root' })
export class ContactMessageService {
  private readonly apiService = inject(ApiService);

  async create(clubId: number, request: CreateContactMessage): Promise<ContactMessageDetail> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<ContactMessageDetail>>(`clubs/${clubId}/contact-messages`, request).pipe(
        map(response => response.data!)
      )
    );
  }

  async getForCoordinator(
    clubId: number,
    userClubRoleId: number,
    limit = 20,
    offset = 0,
    globalStatus?: ContactMessageGlobalStatus,
    recipientStatus?: ContactMessageRecipientStatus
  ): Promise<ContactMessagesPage> {
    const params: Record<string, string> = {
      userClubRoleId: userClubRoleId.toString(),
      limit: limit.toString(),
      offset: offset.toString()
    };
    if (globalStatus) params['globalStatus'] = globalStatus;
    if (recipientStatus) params['recipientStatus'] = recipientStatus;

    return await firstValueFrom(
      this.apiService.get<ApiResponse<ContactMessagesPage>>(`clubs/${clubId}/contact-messages`, { params }).pipe(
        map(response => response.data ?? { items: [], totalCount: 0, limit, offset, hasMore: false })
      )
    );
  }

  async getById(clubId: number, id: number, userClubRoleId: number): Promise<ContactMessageDetail> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<ContactMessageDetail>>(`clubs/${clubId}/contact-messages/${id}`, {
        params: { userClubRoleId: userClubRoleId.toString() }
      }).pipe(map(response => response.data!))
    );
  }

  async markAsRead(clubId: number, id: number, userClubRoleId: number): Promise<ContactMessageDetail> {
    return await firstValueFrom(
      this.apiService.put<ApiResponse<ContactMessageDetail>>(`clubs/${clubId}/contact-messages/${id}/read`, {}, {
        params: { userClubRoleId: userClubRoleId.toString() }
      }).pipe(map(response => response.data!))
    );
  }

  async updateRecipientStatus(clubId: number, id: number, userClubRoleId: number, status: ContactMessageRecipientStatus): Promise<ContactMessageDetail> {
    return await firstValueFrom(
      this.apiService.put<ApiResponse<ContactMessageDetail>>(`clubs/${clubId}/contact-messages/${id}/recipient-status`, { status }, {
        params: { userClubRoleId: userClubRoleId.toString() }
      }).pipe(map(response => response.data!))
    );
  }

  async close(clubId: number, id: number, userClubRoleId: number): Promise<ContactMessageDetail> {
    return await firstValueFrom(
      this.apiService.put<ApiResponse<ContactMessageDetail>>(`clubs/${clubId}/contact-messages/${id}/close`, {}, {
        params: { userClubRoleId: userClubRoleId.toString() }
      }).pipe(map(response => response.data!))
    );
  }
}
