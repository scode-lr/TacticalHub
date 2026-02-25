import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { DynamicForm, DynamicFormSubmission, DynamicFormSubmissionResponse } from '@models/dynamic-form.model';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  private readonly apiService = inject(ApiService);

  private readonly _forms = signal<DynamicForm[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly Forms = this._forms.asReadonly();
  readonly IsLoading = this._isLoading.asReadonly();
  readonly Error = this._error.asReadonly();

  async fetchForms(): Promise<DynamicForm[]> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const forms = await firstValueFrom(
        this.apiService.get<ApiResponse<DynamicForm[]>>('/forms').pipe(
          map(response => response.data ?? [])
        )
      );
      this._forms.set(forms);
      return forms;
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Failed to fetch forms');
      return [];
    } finally {
      this._isLoading.set(false);
    }
  }

  async fetchFormById(id: string): Promise<DynamicForm | null> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<DynamicForm>>(`/forms/${id}`).pipe(
        map(response => response.data ?? null)
      )
    );
  }

  async submitForm(submission: DynamicFormSubmission): Promise<DynamicFormSubmissionResponse | null> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<DynamicFormSubmissionResponse>>(
        `/forms/${submission.FormId}/submit`,
        submission
      ).pipe(
        map(response => response.data ?? null)
      )
    );
  }
}
