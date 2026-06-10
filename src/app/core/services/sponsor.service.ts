import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiService } from './api.service';
import { Sponsor, AdditionalInfo, CreateSponsorRequest, UpdateSponsorRequest, ReorderSponsorsRequest, UploadImageResponse, DeleteImagesRequest, BatchSponsorRequest } from '@core/models/sponsor.model';

@Injectable({ providedIn: 'root' })
export class SponsorService {
  private readonly apiService = inject(ApiService);

  async getByClubId(clubId: number): Promise<Sponsor[]> {
    return await firstValueFrom(
      this.apiService.get<Sponsor[]>(`clubs/${clubId}/sponsors`)
        .pipe(map(data => ((data as any[]) ?? []).map(s => this.normalizeSponsor(s))))
    );
  }

  async create(clubId: number, request: CreateSponsorRequest): Promise<Sponsor> {
    const formData = this.buildFormData(request);
    return await firstValueFrom(
      this.apiService.post<Sponsor>(`clubs/${clubId}/sponsors`, formData, { isFormData: true })
        .pipe(map(data => this.normalizeSponsor(data as any)))
    );
  }

  async update(clubId: number, id: number, request: UpdateSponsorRequest): Promise<Sponsor> {
    const formData = this.buildFormData(request);
    return await firstValueFrom(
      this.apiService.put<Sponsor>(`clubs/${clubId}/sponsors/${id}`, formData, { isFormData: true })
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
      this.apiService.post<UploadImageResponse>(`clubs/${clubId}/sponsors/images`, formData, { isFormData: true })
        .pipe(map(data => data as UploadImageResponse))
    );
  }

  async deleteImages(clubId: number, urls: string[]): Promise<void> {
    if (!urls.length) return;
    await firstValueFrom(
      this.apiService.delete(`clubs/${clubId}/sponsors/images`, { body: { urls } as DeleteImagesRequest })
    );
  }

  async batch(clubId: number, request: BatchSponsorRequest): Promise<Sponsor[]> {
    return await firstValueFrom(
      this.apiService.put<Sponsor[]>(`clubs/${clubId}/sponsors/batch`, request)
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
