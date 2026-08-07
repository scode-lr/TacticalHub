export interface Team {
  id: number;
  teamSeasonId?: number;
  name: string;
  squadCode?: string;
  divisionId?: number;
  categoryId: number;
  clubId?: number;
}

export interface TeamCategory {
  id: number;
  sportId: number;
  countryId: number;
  name: string;
  minAge?: number;
  maxAge?: number;
}

export interface TeamSeasons {
  clubId: number;
  seasonId: number;
  seasonName: string;
  teams: Team[];
}
