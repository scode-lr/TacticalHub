export enum SponsorTier {
  Bronze = 0,
  Silver = 1,
  Gold = 2
}

export interface SponsorLink {
  id?: number;
  platform: string;
  url: string;
}

export interface Sponsor {
  id: number;
  clubId: number;
  name: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  links: SponsorLink[];
  tier: SponsorTier;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSponsorRequest {
  name: string;
  image: File;
  tier: SponsorTier;
  title?: string;
  description?: string;
  links?: SponsorLink[];
}

export interface UpdateSponsorRequest {
  name: string;
  tier: SponsorTier;
  image?: File;
  title?: string;
  description?: string;
  links?: SponsorLink[];
}

export interface ReorderSponsorsRequest {
  ids: number[];
}
