export interface Team {
  id: number;
  name: string;
  squadCode?: string;
  divisionId?: number;
  categoryId: string;
  clubId: number;
}

export interface TeamSeasons {
  clubId: number;
  seasonId: number;
  seasonName: string;
  teams: Team[];
}
