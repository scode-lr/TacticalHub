import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { FormSubmissionRequest } from '@core/requests/form.request';
import { RolesService } from '@services/roles.service';
import { FormSubmissionResult, SubmissionDetail, SubmissionPage } from '@core/responses/form.response';
import { FormDetail } from '@core/responses/form.response';
import { FormSubmission } from '@core/models/form-submission.model';
import { ExportProfile, SaveExportProfileRequest } from '@core/models/export-profile.model';
import { CreateGoogleSheetsIntegrationRequest, CreateGoogleSheetsIntegrationResponse, ExternalIntegration, ExternalIntegrationTestResult, ExternalSyncResult, SaveExternalIntegrationRequest } from '@core/models/external-integration.model';

export interface FormsSubmissionsPageState {
  viewState: 'list' | 'detail';
  selectedFormId: number | null;
  forms: FormDetail[];
  formsLimit: number;
  formsOffset: number;
  searchValue: string;
  submissions: FormSubmission[];
  totalSubmissions: number;
  pageSize: number;
  currentPage: number;
  currentSort: string | undefined;
  submissionsSearchValue: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormSubmissionsService {
  private readonly apiService = inject(ApiService);
  private readonly rolesService = inject(RolesService);

  savedPageState: FormsSubmissionsPageState | null = null;

  async submitForm(formId: number, request: FormSubmissionRequest): Promise<FormSubmissionResult> {
    const userClubRoleId = String(this.rolesService.getCurrentRole()!.id);
    return await firstValueFrom(
      this.apiService.post<ApiResponse<FormSubmissionResult>>(`/forms/${formId}/submit`, request, { params: { userClubRoleId } }).pipe(
        map(response => response.data!)
      )
    );
  }

  async getSubmissions(formId: number, limit = 12, offset = 0, username?: string, sort?: string): Promise<SubmissionPage> {
    const params: Record<string, string> = { limit: String(limit), offset: String(offset) };
    if (username) params['username'] = username;
    if (sort) params['sort'] = sort;
    return await firstValueFrom(
      this.apiService.get<ApiResponse<SubmissionPage>>(`/forms/${formId}/submissions`, { params }).pipe(
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

  async reviewSubmission(submissionId: number, approved: boolean): Promise<void> {
    await firstValueFrom(
      this.apiService.put<ApiResponse<void>>(`/forms/submissions/${submissionId}/review`, { approved })
    );
  }

  async getMySubmissions(formId: number): Promise<FormSubmission[]> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<{ submissions: FormSubmission[] }>>(`/forms/${formId}/my-submissions`).pipe(
        map(response => response.data?.submissions ?? [])
      )
    );
  }

  async exportSubmissions(formId: number, formName: string): Promise<void> {
    const blob = await firstValueFrom(
      this.apiService.getBlob(`/forms/${formId}/submissions/export`)
    );
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${formName}_submissions.csv`;
    anchor.click();
    window.URL.revokeObjectURL(url);
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
}
