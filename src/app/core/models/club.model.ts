export interface Club {
  id: string;
  name: string;
  description: string;
  location: string;
  logoUrl: string;
  level?: string;
  membersCount?: number;
  teamsCount?: number;
}
