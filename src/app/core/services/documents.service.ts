import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { DocumentsPage, FormDocument } from '@core/models/document.model';
import { saveBlob } from '@core/utils/file-download.util';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private readonly apiService = inject(ApiService);

  async getMyDocuments(clubId: number, limit = 12, offset = 0): Promise<DocumentsPage> {
    const params = { clubId: String(clubId), limit: String(limit), offset: String(offset) };
    return await firstValueFrom(
      this.apiService.get<ApiResponse<DocumentsPage>>('/documents', { params }).pipe(
        map(response => response.data!)
      )
    );
  }

  /** Returns the document issued for a submission, generating it if it is missing. */
  async getBySubmission(submissionId: number): Promise<FormDocument> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<FormDocument>>(`/documents/by-submission/${submissionId}`).pipe(
        map(response => response.data!)
      )
    );
  }

  /** Raw PDF bytes. Shared by preview and download so the file is fetched once per action. */
  async fetchBlob(documentId: number): Promise<Blob> {
    return await firstValueFrom(this.apiService.getBlob(`/documents/${documentId}/download`));
  }

  async download(documentId: number, fileName: string): Promise<void> {
    await saveBlob(await this.fetchBlob(documentId), fileName);
  }
}
