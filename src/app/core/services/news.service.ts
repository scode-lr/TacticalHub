import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { CreateNewsPostRequest, NewsPost, NewsPostsPage, UpdateNewsPostRequest, UploadNewsImageResponse } from '@models/news.model';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly apiService = inject(ApiService);
  private readonly defaultLimit = 12;

  async getByClubId(clubId: number, includeUnpublished = false, limit = this.defaultLimit, offset = 0): Promise<NewsPostsPage> {
    const params = {
      includeUnpublished: includeUnpublished ? 'true' : 'false',
      limit: limit.toString(),
      offset: offset.toString()
    };
    return await firstValueFrom(
      this.apiService.get<ApiResponse<NewsPostsPage>>(`clubs/${clubId}/news`, { params }).pipe(
        map(response => response.data!)
      )
    );
  }

  async getById(clubId: number, id: number): Promise<NewsPost> {
    return await firstValueFrom(
      this.apiService.get<ApiResponse<NewsPost>>(`clubs/${clubId}/news/${id}`).pipe(
        map(response => response.data!)
      )
    );
  }

  async create(clubId: number, request: CreateNewsPostRequest): Promise<NewsPost> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<NewsPost>>(`clubs/${clubId}/news`, request).pipe(
        map(response => response.data!)
      )
    );
  }

  async update(clubId: number, id: number, request: UpdateNewsPostRequest): Promise<NewsPost> {
    return await firstValueFrom(
      this.apiService.put<ApiResponse<NewsPost>>(`clubs/${clubId}/news/${id}`, request).pipe(
        map(response => response.data!)
      )
    );
  }

  async delete(clubId: number, id: number): Promise<void> {
    await firstValueFrom(this.apiService.delete<ApiResponse<NewsPost>>(`clubs/${clubId}/news/${id}`));
  }

  async publish(clubId: number, id: number): Promise<NewsPost> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<NewsPost>>(`clubs/${clubId}/news/${id}/publish`, {}).pipe(
        map(response => response.data!)
      )
    );
  }

  async unpublish(clubId: number, id: number): Promise<NewsPost> {
    return await firstValueFrom(
      this.apiService.post<ApiResponse<NewsPost>>(`clubs/${clubId}/news/${id}/unpublish`, {}).pipe(
        map(response => response.data!)
      )
    );
  }

  async uploadImage(clubId: number, file: File): Promise<UploadNewsImageResponse> {
    const formData = new FormData();
    formData.append('Image', file);
    return await firstValueFrom(
      this.apiService.post<ApiResponse<UploadNewsImageResponse>>(`clubs/${clubId}/news/images`, formData, { isFormData: true, skipErrorHandler: true }).pipe(
        map(response => response.data!)
      )
    );
  }

  async deleteImages(clubId: number, urls: string[]): Promise<void> {
    if (!urls.length) return;
    await firstValueFrom(
      this.apiService.delete(`clubs/${clubId}/news/images`, { body: { urls }, skipErrorHandler: true })
    );
  }
}
