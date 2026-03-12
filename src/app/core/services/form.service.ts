import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { FormDetail } from '@core/responses/form.response';
import { CreateFormRequest, UpdateFormRequest } from '@core/requests/form.request';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private readonly apiService = inject(ApiService);

  async createForm(request: CreateFormRequest): Promise<FormDetail> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<FormDetail>>('/forms', request).pipe(
        map(response => response.data!)
      )
    );
  }

  async updateForm(formId: number, request: UpdateFormRequest): Promise<FormDetail> {
    return await firstValueFrom(
      this.apiService.put<ApiResponse<FormDetail>>(`/forms/${formId}`, request).pipe(
        map(response => response.data!)
      )
    );
  }

  async getFormsByClubId(clubId: number): Promise<FormDetail[]> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<FormDetail[]>>('/forms', {
        params: { clubId: String(clubId) }
      }).pipe(
        map(response => response.data ?? [])
      )
    );
  }

  async getFormById(formId: number): Promise<FormDetail> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<FormDetail>>(`/forms/${formId}`).pipe(
        map(response => response.data!)
      )
    );
  }

  async deleteForm(formId: number): Promise<void> {
    await firstValueFrom(this.apiService.delete(`/forms/${formId}`));
  }
}
