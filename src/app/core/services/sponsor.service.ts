import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { ApiService } from './api.service';
import { Sponsor, SponsorLink, CreateSponsorRequest, UpdateSponsorRequest, ReorderSponsorsRequest } from '@core/models/sponsor.model';
import { environment } from '@environment';

@Injectable({ providedIn: 'root' })
export class SponsorService {
  private readonly apiService = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  async getByClubId(clubId: number): Promise<Sponsor[]> {
    return await firstValueFrom(
      this.apiService.get<Sponsor[]>(`clubs/${clubId}/sponsors`)
        .pipe(map(data => (data as Sponsor[]) ?? []))
    );
  }

  async create(clubId: number, request: CreateSponsorRequest): Promise<Sponsor> {
    const formData = this.buildFormData(request);
    return await firstValueFrom(
      this.http.post<Sponsor>(`${this.baseUrl}/clubs/${clubId}/sponsors`, formData)
        .pipe(map(data => data as Sponsor))
    );
  }

  async update(clubId: number, id: number, request: UpdateSponsorRequest): Promise<Sponsor> {
    const formData = this.buildFormData(request);
    return await firstValueFrom(
      this.http.put<Sponsor>(`${this.baseUrl}/clubs/${clubId}/sponsors/${id}`, formData)
        .pipe(map(data => data as Sponsor))
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

  private buildFormData(request: CreateSponsorRequest | UpdateSponsorRequest): FormData {
    const formData = new FormData();
    formData.append('Name', request.name);
    formData.append('Tier', request.tier.toString());

    if (request.title) formData.append('Title', request.title);
    if (request.description) formData.append('Description', request.description);

    if ('image' in request && request.image) {
      formData.append('Image', request.image);
    }

    if (request.links) {
      request.links.forEach((link, i) => {
        if (link.platform && link.url) {
          formData.append(`Links[${i}].Platform`, link.platform);
          formData.append(`Links[${i}].Url`, link.url);
        }
      });
    }

    return formData;
  }
}
