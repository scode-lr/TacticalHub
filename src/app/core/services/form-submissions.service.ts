import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { FormSubmissionRequest } from '@core/requests/form.request';
import { FormSubmissionResult, SubmissionDetail, SubmissionPage } from '@core/responses/form.response';

@Injectable({
  providedIn: 'root'
})
export class FormSubmissionsService {
  private readonly apiService = inject(ApiService);

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
}
