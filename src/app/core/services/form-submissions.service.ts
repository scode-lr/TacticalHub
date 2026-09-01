import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { FormSubmissionRequest, ReviewSubmissionRequest } from '@core/requests/form.request';
import { saveBlob } from '@core/utils/file-download.util';
import { RolesService } from '@services/roles.service';
import { ClubSubmissionsPage, FormSubmissionResult, SubmissionDetail, SubmissionPage, SubmissionStatusCounts } from '@core/responses/form.response';
import { FormSubmission } from '@core/models/form-submission.model';
import { ExportProfile, SaveExportProfileRequest } from '@core/models/export-profile.model';
import { CreateGoogleSheetsIntegrationRequest, CreateGoogleSheetsIntegrationResponse, ExternalIntegration, ExternalIntegrationTestResult, ExternalSyncResult, FormsSyncStatusPage, PendingSyncAction, SaveExternalIntegrationRequest } from '@core/models/external-integration.model';

export interface ReviewSubmissionResult {
  submissionId: number;
  status: string;
  reviewedByUserId: number;
  reviewedAt: string;
  documentId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class FormSubmissionsService {
  private readonly apiService = inject(ApiService);
  private readonly rolesService = inject(RolesService);

  async submitForm(formId: number, request: FormSubmissionRequest): Promise<FormSubmissionResult> {
    const userClubRoleId = String(this.rolesService.getCurrentRole()!.id);
    return await firstValueFrom(
      this.apiService.post<ApiResponse<FormSubmissionResult>>(`/forms/${formId}/submit`, request, { params: { userClubRoleId } }).pipe(
        map(response => response.data!)
      )
    );
  }

  async getSubmissions(formId: number, limit = 12, offset = 0, username?: string, sort?: string, status?: string): Promise<SubmissionPage> {
    const params: Record<string, string> = { limit: String(limit), offset: String(offset) };
    if (username) params['username'] = username;
    if (sort) params['sort'] = sort;
    if (status) params['status'] = status;
    return await firstValueFrom(
      this.apiService.get<ApiResponse<SubmissionPage>>(`/forms/${formId}/submissions`, { params }).pipe(
        map(response => response.data!)
      )
    );
  }

  /**
   * The dashboard's status-tab counts for a club. A separate call from `getClubSubmissions()` on
   * purpose — the counts don't change with the list's own pagination/status filter/search, so they
   * don't need to be refetched every time that list reloads.
   */
  async getClubSubmissionCounts(clubId: number): Promise<SubmissionStatusCounts> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<SubmissionStatusCounts>>('/forms/submissions/counts', { params: { clubId: String(clubId) } }).pipe(
        map(response => response.data!)
      )
    );
  }

  /** Every reviewable submission across every form of a club. */
  async getClubSubmissions(
    clubId: number,
    limit = 12,
    offset = 0,
    options: { status?: string; formId?: number; search?: string; sort?: string } = {}
  ): Promise<ClubSubmissionsPage> {
    const params: Record<string, string> = { clubId: String(clubId), limit: String(limit), offset: String(offset) };
    if (options.status) params['status'] = options.status;
    if (options.formId) params['formId'] = String(options.formId);
    if (options.search) params['search'] = options.search;
    if (options.sort) params['sort'] = options.sort;
    return await firstValueFrom(
      this.apiService.get<ApiResponse<ClubSubmissionsPage>>('/forms/submissions', { params }).pipe(
        map(response => response.data!)
      )
    );
  }

  async getSubmission(submissionId: number): Promise<SubmissionDetail> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<SubmissionDetail>>(`/forms/submissions/${submissionId}`).pipe(
        map(response => response.data!)
      )
    );
  }

  async resubmitForm(submissionId: number, request: FormSubmissionRequest): Promise<FormSubmissionResult> {
    const userClubRoleId = String(this.rolesService.getCurrentRole()!.id);
    return await firstValueFrom(
      this.apiService.put<ApiResponse<FormSubmissionResult>>(`/forms/submissions/${submissionId}`, request, { params: { userClubRoleId } }).pipe(
        map(response => response.data!)
      )
    );
  }

  /**
   * Approves or rejects a submission. Replaces the old notification-resolve call: reviewing is an
   * operation on the submission, and the API closes the linked coordination task itself.
   */
  async reviewSubmission(
    submissionId: number,
    approved: boolean,
    comment?: string | null,
    fieldStatuses?: Record<number, string>
  ): Promise<ReviewSubmissionResult> {
    const request: ReviewSubmissionRequest = { approved, comment: comment ?? null, fieldStatuses: fieldStatuses ?? {} };
    return await firstValueFrom(
      this.apiService.put<ApiResponse<ReviewSubmissionResult>>(`/forms/submissions/${submissionId}/review`, request).pipe(
        map(response => response.data!)
      )
    );
  }

  async getMySubmissions(formId: number): Promise<FormSubmission[]> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<{ submissions: FormSubmission[] }>>(`/forms/${formId}/my-submissions`).pipe(
        map(response => response.data?.submissions ?? [])
      )
    );
  }

  /**
   * Fetches the current user's latest submission for every open form in a club in one request.
   * A formId absent from the returned map means the user has no submission for it.
   */
  async getMySubmissionsByClub(clubId: number): Promise<Record<number, FormSubmission>> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<{ submissions: Record<number, FormSubmission> }>>('/forms/my-submissions', {
        params: { clubId: String(clubId) }
      }).pipe(
        map(response => response.data?.submissions ?? {})
      )
    );
  }

  async exportSubmissions(formId: number, formName: string): Promise<void> {
    const blob = await firstValueFrom(
      this.apiService.getBlob(`/forms/${formId}/submissions/export`)
    );
    await saveBlob(blob, `${formName}_submissions.csv`);
  }

  async getExportProfile(formId: number): Promise<ExportProfile> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<ExportProfile>>(`/forms/${formId}/export-profile`).pipe(
        map(response => response.data!)
      )
    );
  }

  async saveExportProfile(formId: number, request: SaveExportProfileRequest): Promise<ExportProfile> {
    return await firstValueFrom(
      this.apiService.put<ApiResponse<ExportProfile>>(`/forms/${formId}/export-profile`, request).pipe(
        map(response => response.data!)
      )
    );
  }

  async getIntegrations(formId: number): Promise<ExternalIntegration[]> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<ExternalIntegration[]>>(`/forms/${formId}/integrations`).pipe(
        map(response => response.data ?? [])
      )
    );
  }

  async createIntegration(formId: number, request: SaveExternalIntegrationRequest): Promise<ExternalIntegration> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<ExternalIntegration>>(`/forms/${formId}/integrations`, request).pipe(
        map(response => response.data!)
      )
    );
  }

  async createGoogleSheetsIntegration(formId: number, request: CreateGoogleSheetsIntegrationRequest): Promise<CreateGoogleSheetsIntegrationResponse> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<CreateGoogleSheetsIntegrationResponse>>(`/forms/${formId}/integrations/google-sheets/create`, request).pipe(
        map(response => response.data!)
      )
    );
  }

  async updateIntegration(formId: number, integrationId: number, request: SaveExternalIntegrationRequest): Promise<ExternalIntegration> {
    return await firstValueFrom(
      this.apiService.put<ApiResponse<ExternalIntegration>>(`/forms/${formId}/integrations/${integrationId}`, request).pipe(
        map(response => response.data!)
      )
    );
  }

  async deleteIntegration(formId: number, integrationId: number): Promise<void> {
    await firstValueFrom(
      this.apiService.delete<ApiResponse<ExternalIntegration>>(`/forms/${formId}/integrations/${integrationId}`)
    );
  }

  async testIntegration(formId: number, integrationId: number): Promise<ExternalIntegrationTestResult> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<ExternalIntegrationTestResult>>(`/forms/${formId}/integrations/${integrationId}/test`, {}).pipe(
        map(response => response.data!)
      )
    );
  }

  async syncPendingIntegration(formId: number, integrationId: number): Promise<ExternalSyncResult> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<ExternalSyncResult>>(`/forms/${formId}/integrations/${integrationId}/sync-pending`, {}).pipe(
        map(response => response.data!)
      )
    );
  }

  /**
   * Every integration in the club that currently needs attention (a failed sync, or items waiting
   * to sync) — a quick-action panel. Separate from `getFormsSyncStatus()` so it doesn't refetch
   * every form's status just to check for pending syncs.
   */
  async getPendingSyncActions(clubId: number): Promise<PendingSyncAction[]> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<PendingSyncAction[]>>('/forms/integrations/pending-sync', { params: { clubId: String(clubId) } }).pipe(
        map(response => response.data ?? [])
      )
    );
  }

  /** A page of the club's forms (optionally filtered by name) with their sync status, computed server-side in one query. */
  async getFormsSyncStatus(clubId: number, limit = 10, offset = 0, search?: string): Promise<FormsSyncStatusPage> {
    const params: Record<string, string> = { clubId: String(clubId), limit: String(limit), offset: String(offset) };
    if (search) params['search'] = search;
    return await firstValueFrom(
      this.apiService.get<ApiResponse<FormsSyncStatusPage>>('/forms/sync-status', { params }).pipe(
        map(response => response.data ?? { items: [], limit, offset, totalCount: 0 })
      )
    );
  }
}
