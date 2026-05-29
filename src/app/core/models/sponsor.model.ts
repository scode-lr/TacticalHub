export enum SponsorTier {
  Bronze = 0,
  Silver = 1,
  Gold = 2
}

export const SPONSOR_INFO_KEYS = [
  { value: 'Website', label: 'admin.settings.sponsors.infoKeys.website' },
  { value: 'Instagram', label: 'admin.settings.sponsors.infoKeys.instagram' },
  { value: 'Twitter', label: 'admin.settings.sponsors.infoKeys.twitter' },
  { value: 'Facebook', label: 'admin.settings.sponsors.infoKeys.facebook' },
  { value: 'TikTok', label: 'admin.settings.sponsors.infoKeys.tiktok' },
  { value: 'Youtube', label: 'admin.settings.sponsors.infoKeys.youtube' },
  { value: 'Linkedin', label: 'admin.settings.sponsors.infoKeys.linkedin' },
  { value: 'Twitch', label: 'admin.settings.sponsors.infoKeys.twitch' },
  { value: 'Email', label: 'admin.settings.sponsors.infoKeys.email' },
  { value: 'Mobile', label: 'admin.settings.sponsors.infoKeys.mobile' }
];

export interface AdditionalInfo {
  id?: number;
  key: string;
  value: string;
}

export interface Sponsor {
  id: number;
  clubId: number;
  name: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  additionalInfo: AdditionalInfo[];
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
  additionalInfo?: AdditionalInfo[];
}

export interface UpdateSponsorRequest {
  name: string;
  tier: SponsorTier;
  image?: File;
  title?: string;
  description?: string;
  additionalInfo?: AdditionalInfo[];
}

export interface ReorderSponsorsRequest {
  ids: number[];
}

export interface UploadImageResponse {
  url: string;
}

export interface DeleteImagesRequest {
  urls: string[];
}

export interface BatchSponsorRequest {
  additions: Sponsor[];
  updates: Sponsor[];
  deletions: number[];
  orphanedImageUrls: string[];
}
