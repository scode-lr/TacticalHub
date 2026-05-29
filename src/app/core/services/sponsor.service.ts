import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { ApiService } from './api.service';
import { Sponsor, AdditionalInfo, CreateSponsorRequest, UpdateSponsorRequest, ReorderSponsorsRequest, UploadImageResponse, DeleteImagesRequest, BatchSponsorRequest } from '@core/models/sponsor.model';
import { environment } from '@environment';

@Injectable({ providedIn: 'root' })
export class SponsorService {
  private readonly apiService = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  async getByClubId(clubId: number): Promise<Sponsor[]> {
    return await firstValueFrom(
      this.apiService.get<Sponsor[]>(`clubs/${clubId}/sponsors`)
        .pipe(map(data => ((data as any[]) ?? []).map(s => this.normalizeSponsor(s))))
    );
  }

  async create(clubId: number, request: CreateSponsorRequest): Promise<Sponsor> {
    const formData = this.buildFormData(request);
    return await firstValueFrom(
      this.http.post<Sponsor>(`${this.baseUrl}/clubs/${clubId}/sponsors`, formData)
        .pipe(map(data => this.normalizeSponsor(data as any)))
    );
  }

  async update(clubId: number, id: number, request: UpdateSponsorRequest): Promise<Sponsor> {
    const formData = this.buildFormData(request);
    return await firstValueFrom(
      this.http.put<Sponsor>(`${this.baseUrl}/clubs/${clubId}/sponsors/${id}`, formData)
        .pipe(map(data => this.normalizeSponsor(data as any)))
    );
  }

  async delete(clubId: number, id: number): Promise<void> {
    await firstValueFrom(
      this.apiService.delete(`clubs/${clubId}/sponsors/${id}`)
    );
  }

  async reorder(clubId: number, request: ReorderSponsorsRequest): Promise<void> {
    await firstValueFrom(
      this.apiService.put(`clubs/${clubId}/sponsors/reorder`, request)
    );
  }

  async uploadImage(clubId: number, file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('Image', file);
    return await firstValueFrom(
      this.http.post<UploadImageResponse>(`${this.baseUrl}/clubs/${clubId}/sponsors/images`, formData)
        .pipe(map(data => data as UploadImageResponse))
    );
  }

  async deleteImages(clubId: number, urls: string[]): Promise<void> {
    if (!urls.length) return;
    await firstValueFrom(
      this.http.delete(`${this.baseUrl}/clubs/${clubId}/sponsors/images`, {
        body: { urls } as DeleteImagesRequest
      })
    );
  }

  async batch(clubId: number, request: BatchSponsorRequest): Promise<Sponsor[]> {
    return await firstValueFrom(
      this.http.put<Sponsor[]>(`${this.baseUrl}/clubs/${clubId}/sponsors/batch`, request)
        .pipe(map(data => ((data as any[]) ?? []).map(s => this.normalizeSponsor(s))))
    );
  }

  private buildFormData(request: CreateSponsorRequest | UpdateSponsorRequest): FormData {
    const formData = new FormData();
    formData.append('Name', request.name);
    formData.append('Tier', request.tier.toString());

    if (request.title) formData.append('Title', request.title);
    if (request.description) formData.append('Description', request.description);

    if ('image' in request && request.image) {
      formData.append('Image', request.image);
    }

    if (request.additionalInfo) {
      request.additionalInfo.forEach((info, i) => {
        if (info.key && info.value) {
          formData.append(`AdditionalInfo[${i}].Key`, info.key);
          formData.append(`AdditionalInfo[${i}].Value`, info.value);
        }
      });
    }

    return formData;
  }

  private normalizeSponsor(raw: any): Sponsor {
    const additionalInfo: AdditionalInfo[] = [];
    if (raw.additionalInfo && typeof raw.additionalInfo === 'object' && !Array.isArray(raw.additionalInfo)) {
      for (const [key, value] of Object.entries(raw.additionalInfo)) {
        additionalInfo.push({ key, value: value as string });
      }
    }
    return { ...raw, additionalInfo };
  }
}
