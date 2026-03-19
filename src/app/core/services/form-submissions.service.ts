import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { FormSubmissionRequest } from '@core/requests/form.request';
import { FormSubmissionResult } from '@core/responses/form.response';

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
}
