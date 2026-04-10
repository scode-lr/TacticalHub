import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { PaginatedResponse } from '@core/responses/api.response';
import { Form, FormField, FormSubmission } from '@core/models/form.model';
import { CreateFormRequest, AddFormFieldRequest, SubmitFormRequest } from '@core/requests/form.request';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  private readonly apiService = inject(ApiService);

  async getAvailableForms(clubId: number): Promise<Form[]> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<Form[]>>('/forms', {
        params: { clubId: String(clubId) }
      }).pipe(map(response => response.data ?? []))
    );
  }

  async getFormWithFields(formId: number): Promise<Form | null> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<Form>>(`/forms/${formId}`).pipe(
        map(response => response.data ?? null)
      )
    );
  }

  async getFormSubmissions(formId: number, page = 1, limit = 20): Promise<PaginatedResponse<FormSubmission> | null> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<PaginatedResponse<FormSubmission>>>(`/forms/${formId}/submissions`, {
        params: { page: String(page), limit: String(limit) }
      }).pipe(map(response => response.data ?? null))
    );
  }

  async getSubmissionValues(submissionId: number): Promise<FormSubmission | null> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<FormSubmission>>(`/forms/submissions/${submissionId}`).pipe(
        map(response => response.data ?? null)
      )
    );
  }

  async submitForm(formId: number, request: SubmitFormRequest): Promise<FormSubmission | null> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<FormSubmission>>(`/forms/${formId}/submit`, request).pipe(
        map(response => response.data ?? null)
      )
    );
  }

  async createForm(request: CreateFormRequest): Promise<Form | null> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<Form>>('/forms', request).pipe(
        map(response => response.data ?? null)
      )
    );
  }

  async addFormField(formId: number, request: AddFormFieldRequest): Promise<FormField | null> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<FormField>>(`/forms/${formId}/fields`, request).pipe(
        map(response => response.data ?? null)
      )
    );
  }
}
