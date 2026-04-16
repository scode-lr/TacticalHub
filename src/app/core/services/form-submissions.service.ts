import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { FormSubmissionRequest } from '@core/requests/form.request';
import { FormSubmissionResult, SubmissionDetail, SubmissionPage } from '@core/responses/form.response';
import { FormDetail } from '@core/responses/form.response';
import { FormSubmission } from '@core/models/form-submission.model';

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

  savedPageState: FormsSubmissionsPageState | null = null;

  async submitForm(formId: number, request: FormSubmissionRequest): Promise<FormSubmissionResult> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<FormSubmissionResult>>(`/forms/${formId}/submit`, request).pipe(
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
}
