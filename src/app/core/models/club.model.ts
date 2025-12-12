import { Team } from "./team.model";

export interface Club {
  id: number;
  name: string;
  description: string;
  location: string;
  logoUrl: string;
  teams?: Team[];
}
