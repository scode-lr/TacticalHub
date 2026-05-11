export interface ClubInformation {
  id: number;
  clubId: number;
  title: string;
  content: string;
  icon: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  isExpanded?: boolean;
}

export interface CreateClubInformationRequest {
  title: string;
  content: string;
  icon: string | null;
}

export interface UpdateClubInformationRequest {
  title: string;
  content: string;
  icon: string | null;
}

export interface ReorderClubInformationRequest {
  ids: number[];
}
