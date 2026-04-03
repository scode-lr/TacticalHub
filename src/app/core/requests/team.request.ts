export interface CreateTeamRequest {
  name: string;
  description: string;
  location: string;
  level: string;
  imageUrl?: string;
}

export interface UpdateTeamRequest {
  id: string;
  name?: string;
  description?: string;
  location?: string;
  level?: string;
  imageUrl?: string;
}

export interface JoinTeamRequest {
  teamId: string;
  userId: string;
  message?: string;
}

export interface SearchTeamsRequest {
  query?: string;
  location?: string;
  level?: string;
  page?: number;
  limit?: number;
}
